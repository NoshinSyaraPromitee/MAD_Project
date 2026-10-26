const crypto = require('crypto');

class OrderError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status; // picked up by the JSON error handler in server.js
  }
}

// Shipping tiers live here, never in the request, so a client can't under-report
// the fee. Same values as the Go backend (and the app's checkout screen).
const DELIVERY_OPTIONS = {
  standard: { id: 'standard', title: 'Standard Delivery', eta: '3-5 Days', feeBdt: 60, titleBn: 'স্ট্যান্ডার্ড ডেলিভারি', etaBn: '৩-৫ দিন' },
  express: { id: 'express', title: 'Express Delivery', eta: '1-2 Days', feeBdt: 120, titleBn: 'এক্সপ্রেস ডেলিভারি', etaBn: '১-২ দিন' },
};
const PAYMENT_METHODS = new Set(['card', 'bkash', 'nagad', 'cod']);
const TAX_RATE = 0.05;
const MAX_LINES = 50;
const MAX_QTY = 99;

const money = (n) => Math.round(n * 100) / 100;
const text = (v) => (typeof v === 'string' ? v.trim() : '');

// Bangla delivery title/ETA only when asked; the stored order stays English.
function localizeOrder(order, lang) {
  const o = typeof order.toJSON === 'function' ? order.toJSON() : { ...order };
  if (lang === 'bn') {
    const d = Object.values(DELIVERY_OPTIONS).find((x) => x.id === (o.delivery && o.delivery.id));
    if (d) o.delivery = { ...o.delivery, title: d.titleBn, eta: d.etaBn };
  }
  return o;
}

function createOrderService({ Order, Product, now = () => new Date(), newId = () => `ord_${crypto.randomBytes(8).toString('hex')}` }) {
  // Prices the cart from the live catalog and saves it. There is no payment
  // gateway, so any valid request is recorded as "processing" (as in Go).
  async function create(userId, body = {}) {
    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) throw new OrderError(400, 'Cart is empty');
    if (rawItems.length > MAX_LINES) throw new OrderError(400, `A cart can have at most ${MAX_LINES} lines`);

    const name = text(body.shippingName);
    const phone = text(body.shippingPhone);
    const address = text(body.shippingAddress);
    if (!name) throw new OrderError(400, 'Shipping name is required');
    if (phone.length < 7) throw new OrderError(400, 'A valid shipping phone number is required');
    if (!address) throw new OrderError(400, 'Shipping address is required');

    const delivery = DELIVERY_OPTIONS[text(body.deliveryOptionId).toLowerCase()];
    if (!delivery) throw new OrderError(400, `Unknown delivery option "${text(body.deliveryOptionId)}"`);
    const paymentMethodId = text(body.paymentMethodId).toLowerCase();
    if (!PAYMENT_METHODS.has(paymentMethodId)) throw new OrderError(400, `Unknown payment method "${text(body.paymentMethodId)}"`);

    // Same product listed twice becomes one line with the summed quantity.
    const quantities = new Map();
    for (const it of rawItems) {
      const id = text(it && it.productId);
      const qty = it && it.quantity;
      if (!id) throw new OrderError(400, 'productId is required for every item');
      if (!Number.isInteger(qty) || qty < 1) throw new OrderError(400, 'Quantity must be a whole number of at least 1');
      quantities.set(id, (quantities.get(id) || 0) + qty);
    }
    for (const qty of quantities.values()) {
      if (qty > MAX_QTY) throw new OrderError(400, `At most ${MAX_QTY} of one product per order`);
    }

    const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
    const byId = new Map(products.map((p) => [String(p._id), p]));
    const items = [];
    let subtotal = 0;
    for (const [productId, quantity] of quantities) {
      const p = byId.get(productId);
      if (!p) throw new OrderError(404, `Product not found: ${productId}`);
      const lineTotalBdt = money(p.priceBdt * quantity);
      items.push({ productId, name: p.name, imageUrl: p.imageUrl || '', unitPriceBdt: p.priceBdt, quantity, lineTotalBdt });
      subtotal += lineTotalBdt;
    }

    const subtotalBdt = money(subtotal);
    const taxBdt = money(subtotalBdt * TAX_RATE);
    return Order.create({
      _id: newId(),
      userId,
      items,
      shipping: { name, phone, address },
      delivery: { id: delivery.id, title: delivery.title, eta: delivery.eta, feeBdt: delivery.feeBdt },
      paymentMethodId,
      subtotalBdt,
      taxBdt,
      totalBdt: money(subtotalBdt + delivery.feeBdt + taxBdt),
      status: 'processing',
      createdAt: now(),
    });
  }

  const list = (userId) => Order.find({ userId }).sort({ createdAt: -1 });

  // Scoped to the owner: someone else's order id looks the same as a missing one.
  async function get(userId, id) {
    const order = await Order.findOne({ _id: id, userId });
    if (!order) throw new OrderError(404, 'Order not found');
    return order;
  }

  return { create, list, get };
}

module.exports = { createOrderService, localizeOrder, OrderError, DELIVERY_OPTIONS };