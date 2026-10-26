const mongoose = require('mongoose');

// A shop item. _id is a readable string (e.g. "plant-jade-crassula-ongkoor"),
// the same ids the seed file uses, so orders can reference them later.
const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    scientificName: { type: String, default: '' },
    categoryId: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    priceBdt: { type: Number, required: true, min: 0 },
    priceUsd: { type: Number, default: 0, min: 0 },
    vendor: { type: String, default: '' },
    buyUrl: { type: String, default: '' },
    lastVerified: { type: Date, default: null },
    refreshedAt: { type: Date, default: null },
    refreshedSource: { type: String, default: '' },
  },
  { timestamps: false }
);

productSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Product', productSchema);