const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Plant = require('../model/plant');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);

// Adds the derived, UI-friendly fields the app expects (waterLevel, nextWatering)
// without storing them, so they never go stale.
function withDerivedFields(plantDoc) {
  const plant = plantDoc.toObject();

  if (plant.lastWatered && plant.wateringFrequencyDays) {
    const next = new Date(plant.lastWatered);
    next.setDate(next.getDate() + plant.wateringFrequencyDays);
    plant.nextWatering = next;

    const daysUntil = Math.ceil((next - new Date()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 0) plant.waterLevel = 'Today';
    else if (daysUntil === 1) plant.waterLevel = 'Tomorrow';
    else plant.waterLevel = `${daysUntil} Days`;
  } else {
    plant.nextWatering = null;
    plant.waterLevel = 'Not set';
  }

  return plant;
}

// GET /plants
router.get('/', async (req, res) => {
  const plants = await Plant.find({ owner: req.user.userId }).sort({ createdAt: -1 });
  res.json(plants.map(withDerivedFields));
});

// POST /plants
router.post('/', async (req, res) => {
  const { nickname, species, location, sunlight, wateringFrequencyDays, lastWatered } = req.body;

  if (!nickname || !species) {
    return res.status(400).json({ error: 'nickname and species are required' });
  }

  const plant = await Plant.create({
    owner: req.user.userId,
    nickname,
    species,
    location,
    sunlight,
    wateringFrequencyDays,
    lastWatered,
  });

  res.status(201).json(withDerivedFields(plant));
});

// PATCH /plants/:id
router.patch('/:id', async (req, res) => {
  const plant = await Plant.findOne({ _id: req.params.id, owner: req.user.userId });
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }

  const editable = [
    'nickname',
    'species',
    'location',
    'sunlight',
    'wateringFrequencyDays',
    'lastWatered',
    'health',
    'status',
    'humidity',
    'lastScan',
    'fertilizerNote',
  ];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) plant[field] = req.body[field];
  });

  await plant.save();
  res.json(withDerivedFields(plant));
});

// DELETE /plants/:id
router.delete('/:id', async (req, res) => {
  const plant = await Plant.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }

  if (plant.imagePublicId) {
    await cloudinary.uploader.destroy(plant.imagePublicId).catch(() => {});
  }

  res.json({ success: true });
});

// POST /plants/:id/image — multipart/form-data, field name "image"
router.post('/:id/image', upload.single('image'), async (req, res) => {
  const plant = await Plant.findOne({ _id: req.params.id, owner: req.user.userId });
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }
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

    res.json(withDerivedFields(plant));
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;