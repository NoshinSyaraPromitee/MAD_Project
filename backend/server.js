require('dotenv').config();
//require('dns').setServers(['1.1.1.1','8.8.8.8']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authroutes');
const plantRoutes = require('./routes/plantroutes');
const diagnosisRoutes = require('./routes/diagnosisroutes');
const fertilizerRoutes = require('./routes/fertilizerroutes');
const Fertilizer = require('./model/fertilizer');
const fertilizerSeed = require('./data/fertilizers.json');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/plants', plantRoutes);
app.use('/diagnoses', diagnosisRoutes);
app.use('/fertilizers', fertilizerRoutes);

// 404 for unknown routes, then one JSON error handler for everything above.
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  if (err.status && (err.status < 500 || err.expose)) return res.status(err.status).json({ error: err.message });
  if (err.name === 'CastError') return res.status(404).json({ error: 'Not found' }); // malformed ObjectId
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Rebuilds indexes to match the models. Needed once for the new
    // partial-unique googleId index (the old one was a plain unique index).
    await Promise.all(
      [require('./model/user'), require('./model/refreshToken'), require('./model/passwordReset'), require('./model/diagnosis')].map((m) => m.syncIndexes())
    );
    // Insert the built-in recipes once; $setOnInsert never overwrites edits.
    await Fertilizer.bulkWrite(
      fertilizerSeed.map((f) => ({ updateOne: { filter: { _id: f._id }, update: { $setOnInsert: f }, upsert: true } }))
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));