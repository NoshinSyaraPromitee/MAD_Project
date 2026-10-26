const seed = require('../data/products.json');

// Inserts the built-in catalog once. $setOnInsert never overwrites a product
// that already exists, so later edits/price refreshes in the database stay.
async function seedProducts(Product) {
  if (!seed.length) return;
  await Product.bulkWrite(
    seed.map((p) => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $setOnInsert: { ...p, lastVerified: p.lastVerified ? new Date(p.lastVerified) : null } },
        upsert: true,
      },
    }))
  );
}

module.exports = { seedProducts };