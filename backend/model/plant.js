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

    health: {
      type: Number, 
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



module.exports = mongoose.model('Plant', plantSchema);