const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    imagePublicId: {
      // Cloudinary public_id, needed to replace/delete the image later
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    sunlight: {
      type: String,
      default: '',
    },

    // --- The following are placeholders until a real scan feature exists.
    // ScanPlantScreen.jsx currently has no logic behind it — ScanResult is
    // an empty destination. Until that's built, these are either left blank
    // at creation or entered manually; nothing computes them automatically yet.
    health: {
      type: Number, // 0-100
      default: null,
    },
    status: {
      type: String, // "Healthy" | "Needs Water" | "Needs Fertilizer"
      default: '',
    },
    humidity: {
      type: String,
      default: '',
    },
    lastScan: {
      type: Date,
      default: null,
    },

    // --- Watering, computable from real dates rather than free text
    wateringFrequencyDays: {
      type: Number,
      default: 7,
    },
    lastWatered: {
      type: Date,
      default: null,
    },
    fertilizerNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// nextWatering and waterLevel ("Today" / "Tomorrow" / "2 Days") are derived
// from lastWatered + wateringFrequencyDays rather than stored, so they can't
// drift out of sync with the actual date. Computed in the route/serializer,
// not stored as raw fields.

module.exports = mongoose.model('Plant', plantSchema);