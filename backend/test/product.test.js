const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const seed = require('../data/products.json');
const { categories, normalizeCategoryId, localizedCategories } = require('../services/productCatalog');
const { createProductRouter } = require('../routes/productroutes');

test('seed: unique ids, known categories, sane prices', () => {
  const ids = new Set(seed.map((p) => p._id));
  assert.equal(ids.size, seed.length);
  const cats = new Set(categories.map((c) => c.id));
  for (const p of seed) {
    assert.ok(cats.has(p.categoryId), `${p._id}: unknown category ${p.categoryId}`);
    assert.ok(p.name && p.priceBdt > 0, p._id);
    assert.ok(Math.abs(p.priceUsd - p.priceBdt / 123) < 0.01, `${p._id}: USD does not match BDT`);
    assert.ok(!Number.isNaN(Date.parse(p.lastVerified)), p._id);
  }
});

test('categories: all/blank mean no filter; Bangla only on request', () => {
  assert.equal(normalizeCategoryId(' ALL '), '');
  assert.equal(normalizeCategoryId(undefined), '');
  assert.equal(normalizeCategoryId(' Plants '), 'plants');
  assert.equal(localizedCategories('en')[0].name, 'Houseplants');
  assert.match(localizedCategories('bn')[0].name, /[\u0980-\u09FF]/);
  assert.equal(localizedCategories('bn').length, categories.length);
});

// Real router, fake model, real HTTP.
async function withServer(fn) {
  const calls = [];
  const items = seed.map((p) => ({ ...p, id: p._id }));
  const Product = {
    find(filter) { calls.push(filter); return { sort: async () => items.filter((p) => !filter.categoryId || p.categoryId === filter.categoryId) }; },
    findById: async (id) => items.find((p) => p._id === id) || null,
  };
  const requireAuth = (req, res, next) => (req.headers.authorization ? next() : res.status(401).json({ error: 'no' }));
  const app = express().use('/products', createProductRouter({ Product, requireAuth }));
  const server = app.listen(0);
  try { await fn(`http://127.0.0.1:${server.address().port}/products`, calls); } finally { server.close(); }
}
const H = { authorization: 'x' };

test('GET /products: needs auth, filters by category, empty for unknown', async () => {
  await withServer(async (base, calls) => {
    assert.equal((await fetch(base)).status, 401);
    const all = await (await fetch(base, { headers: H })).json();
    assert.equal(all.products.length, seed.length);
    assert.equal(all.categories.length, categories.length);
    const herbs = await (await fetch(`${base}?categoryId=Herbs-Vegetables`, { headers: H })).json();
    assert.ok(herbs.products.length > 0 && herbs.products.every((p) => p.categoryId === 'herbs-vegetables'));
    const legacy = await (await fetch(`${base}?category=seeds`, { headers: H })).json();
    assert.ok(legacy.products.every((p) => p.categoryId === 'seeds'));
    assert.deepEqual((await (await fetch(`${base}?categoryId=nope`, { headers: H })).json()).products, []);
    assert.deepEqual(calls[calls.length - 1], { categoryId: 'nope' });
    const bn = await (await fetch(base, { headers: { ...H, 'accept-language': 'bn-BD' } })).json();
    assert.match(bn.categories[0].name, /[\u0980-\u09FF]/);
  });
});

test('GET /products/:id: found or 404', async () => {
  await withServer(async (base) => {
    const one = await fetch(`${base}/${seed[0]._id}`, { headers: H });
    assert.equal((await one.json()).name, seed[0].name);
    assert.equal((await fetch(`${base}/missing`, { headers: H })).status, 404);
  });
});