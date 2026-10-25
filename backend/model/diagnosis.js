const mongoose = require('mongoose');

// One AI Doctor scan of a plant photo. Port of the Go backend's Diagnosis.
const diagnosisSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', default: null },
    issue: { type: String, required: true },
    cure: { type: String, default: '' },
    confidence: { type: String, default: '' },
    // 'none' | 'Mild' | 'Moderate' | 'Severe'
    severity: { type: String, default: 'Mild' },
    fertilizer: { type: String, default: '' },
    disclaimer: { type: String, required: true },
    provider: { type: String, default: '' },
    // Set by "Mark treated"; a treated scan no longer lowers the plant's health.
    treated: { type: Boolean, default: false },
    treatedAt: { type: Date, default: null },
    issueBn: { type: String, default: '' },
    cureBn: { type: String, default: '' },
    disclaimerBn: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' }, // Cloudinary id
  },
  { timestamps: true }
);

diagnosisSchema.index({ owner: 1, createdAt: -1 });
diagnosisSchema.index({ owner: 1, plant: 1, createdAt: -1 });

// The API shape: Bangla swapped in for lang "bn" when a translation exists,
// internal fields (owner, *Bn, Cloudinary id) removed.
diagnosisSchema.methods.present = function (lang) {
  const d = this.toObject ? this.toObject() : { ...this };
  const bn = lang === 'bn' && d.issueBn;
  return {
    _id: d._id,
    plantId: d.plant ? String(d.plant) : null,
    issue: bn ? d.issueBn : d.issue,
    cure: bn ? d.cureBn || d.cure : d.cure,
    confidence: d.confidence,
    severity: d.severity,
    fertilizer: d.fertilizer,
    disclaimer: bn ? d.disclaimerBn || d.disclaimer : d.disclaimer,
    provider: d.provider,
    treated: d.treated,
    treatedAt: d.treatedAt,
    imageUrl: d.imageUrl,
    createdAt: d.createdAt,
  };
};

module.exports = mongoose.model('Diagnosis', diagnosisSchema);
