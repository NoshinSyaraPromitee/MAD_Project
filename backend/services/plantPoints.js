'use strict';

const mongoose = require('mongoose');
const Plant = require('../model/plant');
const PlantEvent = require('../model/plantEvent');
const { addDays, waterLevelFor, nextWateringTime } = require('../utils/dates');

const POINTS = { WATER: 10, FERTILIZE: 20 };
const SKIP_REASONS = ['soil_still_wet', 'rained', 'other'];

class AppError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}
const notFound = () => new AppError('resource not found', 404);
const invalid = (m) => new AppError(`invalid input: ${m}`, 400);

async function getPlant(id, userId) {
  let plant;
  try { plant = await Plant.findOne({ _id: id, userId }); }
  catch (e) { if (e.name === 'CastError') throw notFound(); throw e; }
  if (!plant) throw notFound();
  return plant;
}

const record = (e) => PlantEvent.create(e);

async function markWatered(id, userId, { tzOffsetMinutes = 0 } = {}) {
  const plant = await getPlant(id, userId);
  const now = new Date();
  const wasDue = plant.nextWateringAt <= now;
  const next = plant.wateringFrequencyDays > 0
    ? addDays(now, plant.wateringFrequencyDays)
    : nextWateringTime(plant.careRoadmap && plant.careRoadmap.wateringTimes, now, tzOffsetMinutes);

  const updated = await Plant.findOneAndUpdate(
    { _id: plant._id, userId, nextWateringAt: plant.nextWateringAt },
    { $set: { lastWateredAt: now, nextWateringAt: next, waterLevel: waterLevelFor(next, now), updatedAt: now } },
    { new: true }
  );
  if (!updated) return { plant: await getPlant(id, userId), pointsEarned: 0 };

  const points = wasDue ? POINTS.WATER : 0;
  await record({ plantId: plant._id, userId, eventType: 'water', points, createdAt: now });
  return { plant: updated, pointsEarned: points };
}

async function markFertilized(id, userId) {
  const plant = await getPlant(id, userId);
  const interval = (plant.careRoadmap && plant.careRoadmap.fertilizingIntervalDays) || 0;
  if (interval <= 0) throw invalid('fertilizing not recommended yet');

  const now = new Date();
  const wasDue = !!plant.nextFertilizingAt && plant.nextFertilizingAt <= now;
  const updated = await Plant.findOneAndUpdate(
    { _id: plant._id, userId, nextFertilizingAt: plant.nextFertilizingAt || null },
    { $set: { lastFertilizedAt: now, nextFertilizingAt: addDays(now, interval), updatedAt: now } },
    { new: true }
  );
  if (!updated) return { plant: await getPlant(id, userId), pointsEarned: 0 };

  const points = wasDue ? POINTS.FERTILIZE : 0;
  await record({ plantId: plant._id, userId, eventType: 'fertilize', points, createdAt: now });
  return { plant: updated, pointsEarned: points };
}

async function skip(id, userId, reason, days) {
  if (!SKIP_REASONS.includes(reason)) throw invalid('unsupported skip reason');
  const n = !days ? 1 : days;
  if (!Number.isInteger(n) || n < 1 || n > 30) throw invalid('snooze days must be from 1 to 30');
  const plant = await getPlant(id, userId);
  const now = new Date();
  plant.nextWateringAt = addDays(now, n);
  plant.waterLevel = waterLevelFor(plant.nextWateringAt, now);
  plant.updatedAt = now;
  await plant.save();
  await record({ plantId: plant._id, userId, eventType: 'skip', reason, metadata: { snoozeDays: n }, points: 0, createdAt: now });
  return plant;
}

async function addNote(id, userId, note) {
  let text = String(note == null ? '' : note).trim();
  if (!text) throw invalid('note is required');
  text = [...text].slice(0, 1000).join('');
  const plant = await getPlant(id, userId);
  await record({ plantId: plant._id, userId, eventType: 'note', note: text, points: 0, createdAt: new Date() });
}

async function plantEvents(id, userId) {
  await getPlant(id, userId);
  return PlantEvent.find({ plantId: id, userId }).sort({ createdAt: -1 });
}

const gardenEvents = (userId) => PlantEvent.find({ userId }).sort({ createdAt: -1 });

async function totalPoints(userId) {
 
  const path = PlantEvent.schema.path('userId');
  const uid = path && path.instance === 'ObjectId' ? new mongoose.Types.ObjectId(String(userId)) : userId;
  const [row] = await PlantEvent.aggregate([
    { $match: { userId: uid } },
    { $group: { _id: null, total: { $sum: '$points' } } },
  ]);
  return row ? row.total : 0;
}

module.exports = { markWatered, markFertilized, skip, addNote, plantEvents, gardenEvents, totalPoints, AppError, POINTS };