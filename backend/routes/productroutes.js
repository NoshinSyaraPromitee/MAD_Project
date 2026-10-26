const express = require('express');
const mongoose = require('mongoose');
const Product = require('../model/product');
const { requireAuth } = require('../middleware/auth');
const { normalizeCategoryId, localizedCategories } = require('../services/productCatalog');
const { seedProducts } = require('../services/productSeed');

// Bangla if Accept-Language starts with "bn", otherwise English.
const langOf = (req) => ((req.headers['accept-language'] || '').toLowerCase().startsWith('bn') ? 'bn' : 'en');

function createProductRouter({ Product, requireAuth }) {
  const router = express.Router();
  router.use(requireAuth);

  // GET /products[?categoryId=plants]   (legacy ?category= also accepted;
  // categoryId wins). Always returns both categories and products. An
  // unknown category gives an empty product list, not an error.
  router.get('/', async (req, res) => {
    const categoryId = normalizeCategoryId(req.query.categoryId || req.query.category);
    const filter = categoryId ? { categoryId } : {};
    const products = await Product.find(filter).sort({ categoryId: 1, name: 1 });
    res.json({ categories: localizedCategories(langOf(req)), products });
  });

  // GET /products/:id
  router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  return router;
}

// Insert the built-in catalog as soon as the database connects.
mongoose.connection.once('connected', () => {
  seedProducts(Product).catch((err) => console.error('Product seeding failed:', err.message));
});

module.exports = createProductRouter({ Product, requireAuth });
module.exports.createProductRouter = createProductRouter;