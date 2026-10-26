const express = require('express');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Plant = require('../model/plant');
const PlantEvent = require('../model/plantEvent');
const { createPlantService } = require('../services/plantService');
const { resolveOffsetMinutes } = require('../utils/timezone');
const { requireAuth } = require('../middleware/auth');
const { imageUpload } = require('../utils/imageUpload');
const { scanSource } = require('./diagnosisroutes');
const { createGeminiProvider } = require('../services/aiProvider');

const router = express.Router();
const ai = createGeminiProvider();
const plants = createPlantService({ Plant, PlantEvent, scanSource });

router.use(requireAuth);

// Clients may send X-Timezone (e.g. Asia/Dhaka) or X-UTC-Offset-Minutes so that
// "Today" / "Tomorrow" mean the user's day, not the server's.
const tz = (req) => ({
  offsetMinutes: resolveOffsetMinutes(req.headers),
  lang: String(req.headers['accept-language'] || '').toLowerCase().startsWith('bn') ? 'bn' : 'en',
});
// Route order matters: the fixed paths (/events, /due) must come before /:id.


// POST /plants/identify  multipart: image (file)
// Photo -> species, suggested nickname, location, sunlight, watering interval/amount,
// health and care tips. Nothing is saved; the app previews it, then calls POST /plants.
router.post('/identify', imageUpload('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided (field name must be "image")' });
  res.json(await ai.identify(req.file.buffer, req.file.detectedType));
});

// GET /plants
router.get('/', async (req, res) => {
  res.json(await plants.list(req.user.userId, tz(req)));
});

// POST /plants
// { nickname, species, ageStage?, outdoor?, location?, sunlight?,
//   wateringFrequencyDays?, lastWatered?, waterAmountMl?, careTips? }
router.post('/', async (req, res) => {
  res.status(201).json(await plants.create(req.user.userId, req.body || {}, tz(req)));
});

// GET /plants/events - the whole garden's timeline, newest first
router.get('/events', async (req, res) => {
  res.json(await plants.events(req.user.userId));
});

// GET /plants/due[?before=<ISO date>] - watering/fertilizing due now (or by `before`)
router.get('/due', async (req, res) => {
  let before = new Date();
  if (req.query.before !== undefined) {
    before = new Date(String(req.query.before));
    if (Number.isNaN(before.getTime())) return res.status(400).json({ error: '?before must be a valid date' });
  }
  res.json(await plants.due(req.user.userId, before, tz(req)));
});

// GET /plants/:id
router.get('/:id', async (req, res) => {
  res.json(await plants.get(req.user.userId, req.params.id, tz(req)));
});

// GET /plants/:id/events
router.get('/:id/events', async (req, res) => {
  res.json(await plants.events(req.user.userId, req.params.id));
});

// PATCH /plants/:id
// `health` is computed and cannot be set; the care roadmap is regenerated only
// when species or ageStage actually change.
router.patch('/:id', async (req, res) => {
  res.json(await plants.update(req.user.userId, req.params.id, req.body || {}, tz(req)));
});

// DELETE /plants/:id
router.delete('/:id', async (req, res) => {
  const plant = await plants.remove(req.user.userId, req.params.id);

  if (plant.imagePublicId) {
    await cloudinary.uploader.destroy(plant.imagePublicId).catch(() => {});
  }

  res.json({ success: true });
});

// POST /plants/:id/water -> { plant, pointsEarned }
router.post('/:id/water', async (req, res) => {
  res.json(await plants.markWatered(req.user.userId, req.params.id, tz(req)));
});

// POST /plants/:id/fertilize -> { plant, pointsEarned }
router.post('/:id/fertilize', async (req, res) => {
  res.json(await plants.markFertilized(req.user.userId, req.params.id, tz(req)));
});

// POST /plants/:id/skip  { reason: soil_still_wet | rained | other, days?: 1-30 }
router.post('/:id/skip', async (req, res) => {
  res.json(await plants.skip(req.user.userId, req.params.id, req.body || {}, tz(req)));
});

// POST /plants/:id/notes  { note }
router.post('/:id/notes', async (req, res) => {
  const event = await plants.addNote(req.user.userId, req.params.id, (req.body || {}).note);
  res.status(201).json({ status: 'recorded', event });
});

router.post('/:id/image', imageUpload('image'), async (req, res) => {
  const plant = await plants.getOwned(req.user.userId, req.params.id);
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided (field name must be "image")' });
  }

  try {
    if (plant.imagePublicId) {
      await cloudinary.uploader.destroy(plant.imagePublicId).catch(() => {});
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'plantpal', resource_type: 'image' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    plant.image = uploadResult.secure_url;
    plant.imagePublicId = uploadResult.public_id;
    await plant.save();

    res.json(await plants.presentOne(req.user.userId, plant, tz(req)));
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;