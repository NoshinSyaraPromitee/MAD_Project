const mongoose = require('mongoose');

const EVENT_TYPES = ['water', 'fertilize', 'scan', 'skip', 'note'];

const plantEventSchema = new mongoose.Schema({
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, enum: EVENT_TYPES, required: true },
  reason: { type: String, default: '' }, // skip: soil_still_wet | rained | other
  note: { type: String, default: '' },
  points: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: undefined },
  createdAt: { type: Date, default: Date.now },
});

plantEventSchema.index({ owner: 1, createdAt: -1 });
plantEventSchema.index({ plant: 1, createdAt: -1 });

module.exports = mongoose.model('PlantEvent', plantEventSchema);
module.exports.EVENT_TYPES = EVENT_TYPES;