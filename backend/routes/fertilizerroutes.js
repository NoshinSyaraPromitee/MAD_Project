const express = require('express');
const crypto = require('crypto');
const Fertilizer = require('../model/fertilizer');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

// Bangla if Accept-Language starts with "bn", otherwise English.
const langOf = (req) => ((req.headers['accept-language'] || '').toLowerCase().startsWith('bn') ? 'bn' : 'en');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /fertilizers[?q=text] - search by name or category, sorted by name
router.get('/', async (req, res) => {
  const q = String(req.query.q || '').trim();
  const filter = q
    ? { $or: [{ name: new RegExp(escapeRegex(q), 'i') }, { category: new RegExp(escapeRegex(q), 'i') }] }
    : {};
  const items = await Fertilizer.find(filter).sort({ name: 1 });
  res.json(items.map((f) => f.localized(langOf(req))));
});

// POST /fertilizers  { name, instructions, category? }
router.post('/', async (req, res) => {
  const { name, category, instructions } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof instructions !== 'string' || !instructions.trim()) {
    return res.status(400).json({ error: 'name and instructions are required' });
  }
  const f = await Fertilizer.create({
    _id: `fert_${crypto.randomBytes(8).toString('hex')}`,
    name,
    category: typeof category === 'string' ? category : '',
    instructions,
  });
  res.status(201).json(f.localized(langOf(req)));
});

// GET /fertilizers/:id
router.get('/:id', async (req, res) => {
  const f = await Fertilizer.findById(req.params.id);
  if (!f) return res.status(404).json({ error: 'Fertilizer not found' });
  res.json(f.localized(langOf(req)));
});

module.exports = router;
