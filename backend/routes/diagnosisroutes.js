const express = require('express');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Diagnosis = require('../model/diagnosis');
const Plant = require('../model/plant');
const PlantEvent = require('../model/plantEvent');
const { createDiagnosisService } = require('../services/diagnosisService');
const { createGeminiProvider } = require('../services/aiProvider');
const { requireAuth } = require('../middleware/auth');
const { imageUpload } = require('../utils/imageUpload');

const router = express.Router();

function uploadImage(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'plantpal/diagnoses', resource_type: 'image' },
      (error, result) => (error ? reject(error) : resolve({ url: result.secure_url, publicId: result.public_id }))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

const diagnoses = createDiagnosisService({
  Diagnosis,
  Plant,
  PlantEvent,
  provider: createGeminiProvider(),
  uploadImage,
});

// Exposed so server.js can hand it to the plant service (health uses the latest scan).
router.scanSource = { latestScans: diagnoses.latestScans };

router.use(requireAuth);

// Bangla if Accept-Language starts with "bn", otherwise English.
const langOf = (req) => ((req.headers['accept-language'] || '').toLowerCase().startsWith('bn') ? 'bn' : 'en');

// POST /diagnoses  multipart: image (file), plantId?, note?
router.post('/', imageUpload('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided (field name must be "image")' });
  const body = req.body || {};
  const result = await diagnoses.analyze({
    userId: req.user.userId,
    plantId: String(body.plantId || '').trim() || null,
    file: req.file,
    note: body.note,
    lang: langOf(req),
  });
  res.status(201).json(result);
});

// GET /diagnoses[?plantId=<id>] - newest first
router.get('/', async (req, res) => {
  const plantId = String(req.query.plantId || '').trim() || null;
  res.json(await diagnoses.list(req.user.userId, plantId, langOf(req)));
});

// GET /diagnoses/:id
router.get('/:id', async (req, res) => {
  res.json(await diagnoses.get(req.user.userId, req.params.id, langOf(req)));
});

// POST /diagnoses/:id/treated
router.post('/:id/treated', async (req, res) => {
  res.json(await diagnoses.markTreated(req.user.userId, req.params.id, langOf(req)));
});

module.exports = router;
