const express = require('express');
const Order = require('../model/order');
const Product = require('../model/product');
const { requireAuth } = require('../middleware/auth');
const { createOrderService, localizeOrder } = require('../services/orderService');

const langOf = (req) => ((req.headers['accept-language'] || '').toLowerCase().startsWith('bn') ? 'bn' : 'en');

function createOrderRouter({ orders, requireAuth }) {
  const router = express.Router();
  router.use(requireAuth);

  // POST /orders  { items:[{productId, quantity}], shippingName, shippingPhone,
  //                 shippingAddress, deliveryOptionId, paymentMethodId }
  router.post('/', async (req, res) => {
    const order = await orders.create(req.user.userId, req.body);
    res.status(201).json(localizeOrder(order, langOf(req)));
  });

  // GET /orders  (newest first)
  router.get('/', async (req, res) => {
    const list = await orders.list(req.user.userId);
    res.json(list.map((o) => localizeOrder(o, langOf(req))));
  });

  // GET /orders/:id
  router.get('/:id', async (req, res) => {
    res.json(localizeOrder(await orders.get(req.user.userId, req.params.id), langOf(req)));
  });

  return router;
}

module.exports = createOrderRouter({ orders: createOrderService({ Order, Product }), requireAuth });
module.exports.createOrderRouter = createOrderRouter;