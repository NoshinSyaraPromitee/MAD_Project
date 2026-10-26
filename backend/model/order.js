const mongoose = require('mongoose');

// A completed checkout: a priced snapshot of the cart. Item name/image/price
// are copied at purchase time, so later catalog edits never change old orders.
const itemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    unitPriceBdt: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotalBdt: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // "ord_" + random hex
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [itemSchema], required: true },
  shipping: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  delivery: {
    id: String,
    title: String,
    eta: String,
    feeBdt: Number,
  },
  paymentMethodId: { type: String, required: true },
  subtotalBdt: { type: Number, required: true },
  taxBdt: { type: Number, required: true },
  totalBdt: { type: Number, required: true },
  status: { type: String, enum: ['processing'], default: 'processing' },
  createdAt: { type: Date, default: Date.now },
});

// "my orders, newest first" is the only list query.
orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id; // _id is kept too, like plants/diagnoses/users
    ret.userId = String(ret.userId);
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Order', orderSchema);