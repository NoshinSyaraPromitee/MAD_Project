const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { createOrderService, localizeOrder } = require('../services/orderService');
const { createOrderRouter } = require('../routes/orderroutes');

const CATALOG = [
  { _id: 'p1', name: 'Jade', imageUrl: 'http://img/1', priceBdt: 350 },
  { _id: 'p2', name: 'Pot', imageUrl: '', priceBdt: 199.99 },
];
function fakes() {
  const saved = [];
  const Product = { find: async ({ _id }) => CATALOG.filter((p) => _id.$in.includes(p._id)) };
  const Order = {
    create: async (doc) => { const o = { ...doc, toJSON() { const { toJSON, ...r } = this; return { ...r, id: r._id }; } }; saved.push(o); return o; },
    find: ({ userId }) => ({ sort: async () => saved.filter((o) => o.userId === userId).reverse() }),
    findOne: async ({ _id, userId }) => saved.find((o) => o._id === _id && o.userId === userId) || null,
  };
  let n = 0;
  return { saved, svc: createOrderService({ Order, Product, newId: () => `ord_${++n}`, now: () => new Date('2026-01-01T00:00:00Z') }) };
}
const body = (over = {}) => ({
  items: [{ productId: 'p1', quantity: 2 }], shippingName: ' Rina ', shippingPhone: '01700000000', shippingAddress: 'Dhaka',
  deliveryOptionId: 'Standard', paymentMethodId: 'BKASH', ...over,
});

test('create: prices from the catalog (client prices ignored), tax and fee added', async () => {
  const { svc } = fakes();
  const o = await svc.create('u1', body({ items: [{ productId: 'p1', quantity: 2, priceBdt: 1 }, { productId: 'p2', quantity: 3 }] }));
  assert.equal(o.items[0].unitPriceBdt, 350);
  assert.equal(o.items[1].lineTotalBdt, 599.97);
  assert.equal(o.subtotalBdt, 1299.97);
  assert.equal(o.taxBdt, 65);
  assert.equal(o.delivery.feeBdt, 60);
  assert.equal(o.totalBdt, 1424.97);
  assert.equal(o.paymentMethodId, 'bkash');
  assert.equal(o.shipping.name, 'Rina');
  assert.equal(o.status, 'processing');
});

test('create: duplicate product lines merge', async () => {
  const { svc } = fakes();
  const o = await svc.create('u1', body({ items: [{ productId: 'p1', quantity: 1 }, { productId: 'p1', quantity: 2 }] }));
  assert.equal(o.items.length, 1);
  assert.equal(o.items[0].quantity, 3);
});

test('create: rejects bad input with 400/404', async () => {
  const { svc } = fakes();
  const bad = async (over, status, re) => assert.rejects(svc.create('u1', body(over)), (e) => e.status === status && re.test(e.message));
  await bad({ items: [] }, 400, /empty/i);
  await bad({ items: undefined }, 400, /empty/i);
  await bad({ items: [{ productId: 'p1', quantity: 0 }] }, 400, /quantity/i);
  await bad({ items: [{ productId: 'p1', quantity: 1.5 }] }, 400, /quantity/i);
  await bad({ items: [{ productId: 'p1', quantity: '2' }] }, 400, /quantity/i);
  await bad({ items: [{ productId: 'p1', quantity: 100 }] }, 400, /at most/i);
  await bad({ items: [{ quantity: 1 }] }, 400, /productId/i);
  await bad({ items: [{ productId: 'nope', quantity: 1 }] }, 404, /not found/i);
  await bad({ shippingName: '  ' }, 400, /name/i);
  await bad({ shippingPhone: '123' }, 400, /phone/i);
  await bad({ shippingAddress: '' }, 400, /address/i);
  await bad({ deliveryOptionId: 'drone' }, 400, /delivery/i);
  await bad({ paymentMethodId: 'bitcoin' }, 400, /payment/i);
  await bad({ shippingName: { $ne: 1 } }, 400, /name/i);
  await assert.rejects(svc.create('u1', undefined), { status: 400 });
});

test('get/list are scoped to the owner, newest first; Bangla only on request', async () => {
  const { svc } = fakes();
  const a = await svc.create('u1', body());
  const b = await svc.create('u1', body());
  await svc.create('u2', body());
  assert.deepEqual((await svc.list('u1')).map((o) => o._id), [b._id, a._id]);
  assert.equal((await svc.get('u1', a._id))._id, a._id);
  await assert.rejects(svc.get('u2', a._id), { status: 404 });
  assert.equal(localizeOrder(a, 'en').delivery.title, 'Standard Delivery');
  assert.match(localizeOrder(a, 'bn').delivery.title, /[\u0980-\u09FF]/);
  assert.equal(a.delivery.title, 'Standard Delivery');
});

test('HTTP: auth required, 201 on create, owner-scoped fetch', async () => {
  const { svc } = fakes();
  const requireAuth = (req, res, next) => { const u = req.headers['x-user']; if (!u) return res.status(401).json({ error: 'no' }); req.user = { userId: u }; next(); };
  const app = express().use(express.json()).use('/orders', createOrderRouter({ orders: svc, requireAuth }))
    .use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }));
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}/orders`;
  const call = (path, user, init = {}) => fetch(base + path, { ...init, headers: { 'content-type': 'application/json', ...(user ? { 'x-user': user } : {}), ...(init.headers || {}) } });
  try {
    assert.equal((await call('', null)).status, 401);
    const made = await call('', 'u1', { method: 'POST', body: JSON.stringify(body()) });
    assert.equal(made.status, 201);
    const order = await made.json();
    assert.equal(order.id, 'ord_1');
    assert.equal((await call(`/${order.id}`, 'u1')).status, 200);
    assert.equal((await call(`/${order.id}`, 'u2')).status, 404);
    assert.equal((await call('', 'u1', { method: 'POST', body: JSON.stringify(body({ items: [] })) })).status, 400);
    const bn = await (await call(`/${order.id}`, 'u1', { headers: { 'accept-language': 'bn' } })).json();
    assert.match(bn.delivery.title, /[\u0980-\u09FF]/);
  } finally { server.close(); }
});