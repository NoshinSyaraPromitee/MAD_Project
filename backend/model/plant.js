const mongoose = require('mongoose');

const careRoadmapSchema = new mongoose.Schema(
  {
    wateringTimes: { type: [String], default: [] }, 
    waterAmountMl: { type: Number, default: 0 },
    tips: { type: String, default: '' },
    fertilizerRecommendation: { type: String, default: '' },
    fertilizingIntervalDays: { type: Number, default: 0 }, 
  },
  { _id: false }
);

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
    // "seed" | "seedling" | "young" | "mature" | "adult" - drives the roadmap.
    ageStage: {
      type: String,
      default: '',
    },
    // Outdoor plants (garden, balcony) are the ones weather-aware tips apply to.
    outdoor: {
      type: Boolean,
      default: false,
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

    nextWateringAt: {
      type: Date,
      default: null,
    },

    careRoadmap: {
      type: careRoadmapSchema,
      default: undefined,
    },
    fertilizerNote: {
      type: String,
      default: '',
    },
    lastFertilized: {
      type: Date,
      default: null,
    },
    nextFertilizing: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Every plant query filters by owner (list/due/get) and the list sorts by
// newest first, so this one compound index covers them all.
plantSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model('Plant', plantSchema);