const mongoose = require('mongoose');

// Homemade fertilizer recipe. String _id so the seeded recipes keep stable ids.
const fertilizerSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: '', trim: true },
    instructions: { type: String, required: true, trim: true },
    // Bangla translations; only surfaced when Accept-Language asks for "bn".
    nameBn: { type: String, default: '' },
    categoryBn: { type: String, default: '' },
    instructionsBn: { type: String, default: '' },
  },
  { timestamps: true }
);

// Swaps in the Bangla text when lang is "bn" and a translation exists, then
// strips the *Bn fields so the response shape is the same in both languages.
fertilizerSchema.methods.localized = function (lang) {
  const o = this.toObject();
  if (lang === 'bn' && o.nameBn) {
    o.name = o.nameBn;
    if (o.categoryBn) o.category = o.categoryBn;
    if (o.instructionsBn) o.instructions = o.instructionsBn;
  }
  delete o.nameBn;
  delete o.categoryBn;
  delete o.instructionsBn;
  delete o.__v;
  return o;
};

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
