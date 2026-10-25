const care = require('./plantCare');

class PlantError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status; // picked up by the JSON error handler in server.js
  }
}
const invalid = (m) => new PlantError(400, m);
const notFound = () => new PlantError(404, 'Plant not found');

const EVENT_LIST_LIMIT = 200;

const text = (v) => String(v ?? '').trim();

// undefined/null/'' -> null; a bad date is a 400, not a silent null.
function parseDate(value, field) {
  if (value === undefined || value === null || value === '') return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw invalid(`${field} must be a valid date`);
  return d;
}

function parseFrequency(value, { allowZero }) {
  const n = Number(value);
  const min = allowZero ? 0 : 1;
  if (!Number.isInteger(n) || n < min || n > care.MAX_FREQUENCY_DAYS) {
    throw invalid(`wateringFrequencyDays must be a whole number from ${min} to ${care.MAX_FREQUENCY_DAYS}`);
  }
  return n;
}

function createPlantService({ Plant, PlantEvent, now = () => new Date() }) {
  // The response shape: stored fields plus everything derived on read, so
  // nothing derived can go stale. `offsetMinutes` is the caller's UTC offset.
  function present(doc, { offsetMinutes = 0 } = {}) {
    const at = now();
    const plant = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
    const nextWatering = care.effectiveNextWatering(plant, at);

    // Plants created before roadmaps existed get one computed on the fly.
    if (!care.hasRoadmap(plant.careRoadmap)) plant.careRoadmap = care.buildRoadmap(plant.species, plant.ageStage);

    const health = care.computeHealth({ nextWateringAt: nextWatering, nextFertilizingAt: plant.nextFertilizing }, null, at);
    plant.nextWatering = nextWatering;
    plant.waterLevel = care.waterLevelFor(nextWatering, at, offsetMinutes);
    plant.health = health.score;
    plant.healthState = health.state;
    plant.healthReasons = health.reasons;
    return plant;
  }

  async function getOwned(userId, id) {
    const plant = await Plant.findOne({ _id: id, owner: userId });
    if (!plant) throw notFound();
    return plant;
  }

  // Writes a roadmap onto plants that predate them, so care actions work on
  // old documents too.
  function ensureRoadmap(plant, at) {
    if (care.hasRoadmap(plant.careRoadmap)) return;
    plant.careRoadmap = care.buildRoadmap(plant.species, plant.ageStage);
    if (!plant.fertilizerNote) plant.fertilizerNote = plant.careRoadmap.fertilizerRecommendation;
    if (!plant.nextFertilizing) plant.nextFertilizing = care.nextFertilizingFrom(plant.careRoadmap, plant.lastFertilized, at);
  }

  const record = (plant, userId, at, fields) =>
    PlantEvent.create({ plant: plant._id, owner: userId, createdAt: at, ...fields });

  async function list(userId, opts) {
    const plants = await Plant.find({ owner: userId }).sort({ createdAt: -1 });
    return plants.map((p) => present(p, opts));
  }

  async function get(userId, id, opts) {
    return present(await getOwned(userId, id), opts);
  }

  async function create(userId, body, opts) {
    const nickname = text(body.nickname);
    const species = text(body.species);
    if (!nickname || !species) throw invalid('nickname and species are required');

    const at = now();
    const days = body.wateringFrequencyDays === undefined ? 7 : parseFrequency(body.wateringFrequencyDays, { allowZero: true });
    let lastWatered = parseDate(body.lastWatered, 'lastWatered');
    if (lastWatered && lastWatered > at) lastWatered = at; // a watering can't be in the future

    const roadmap = care.buildRoadmap(species, body.ageStage);
    // Values the AI-identify step previewed replace the rule-based ones, so the
    // saved plan matches what the user saw.
    const amount = Number(body.waterAmountMl);
    if (Number.isInteger(amount) && amount > 0 && amount <= 5000) roadmap.waterAmountMl = amount;
    const tips = text(body.careTips).slice(0, care.MAX_NOTE_LENGTH);
    if (tips) roadmap.tips = tips;

    const plant = {
      owner: userId,
      nickname,
      species,
      ageStage: text(body.ageStage),
      outdoor: body.outdoor === true,
      location: text(body.location),
      sunlight: text(body.sunlight),
      wateringFrequencyDays: days,
      lastWatered,
      careRoadmap: roadmap,
      fertilizerNote: roadmap.fertilizerRecommendation,
      nextFertilizing: care.nextFertilizingFrom(roadmap, null, at),
    };
    plant.nextWateringAt = lastWatered ? care.scheduleNextWatering(plant, lastWatered, opts && opts.offsetMinutes) : at;
    return present(await Plant.create(plant), opts);
  }

  async function update(userId, id, body, opts) {
    const plant = await getOwned(userId, id);
    const at = now();
    let regenerate = false;

    if (body.nickname !== undefined) {
      const nickname = text(body.nickname);
      if (!nickname) throw invalid('nickname cannot be empty');
      plant.nickname = nickname;
    }
    if (body.species !== undefined) {
      const species = text(body.species);
      if (!species) throw invalid('species cannot be empty');
      if (species.toLowerCase() !== text(plant.species).toLowerCase()) regenerate = true;
      plant.species = species;
    }
    if (body.ageStage !== undefined) {
      const ageStage = text(body.ageStage);
      if (ageStage.toLowerCase() !== text(plant.ageStage).toLowerCase()) regenerate = true;
      plant.ageStage = ageStage;
    }
    if (body.outdoor !== undefined) {
      if (typeof body.outdoor !== 'boolean') throw invalid('outdoor must be true or false');
      plant.outdoor = body.outdoor;
    }
    for (const field of ['location', 'sunlight', 'status', 'humidity', 'fertilizerNote']) {
      if (body[field] !== undefined) plant[field] = text(body[field]);
    }
    if (body.lastScan !== undefined) plant.lastScan = parseDate(body.lastScan, 'lastScan');
    // `health` is intentionally not editable: it is computed from care history.

    const freq = body.wateringFrequencyDays === undefined ? undefined : parseFrequency(body.wateringFrequencyDays, { allowZero: false });
    const lastWateredGiven = body.lastWatered !== undefined;
    if (lastWateredGiven) {
      let lastWatered = parseDate(body.lastWatered, 'lastWatered');
      if (lastWatered && lastWatered > at) lastWatered = at;
      plant.lastWatered = lastWatered;
    }

    // Re-anchor on lastWatered, never on "now". A plant that was never watered
    // keeps its due date when only the interval changes.
    if (freq !== undefined && freq !== plant.wateringFrequencyDays) {
      plant.wateringFrequencyDays = freq;
      if (plant.lastWatered) plant.nextWateringAt = care.scheduleNextWatering(plant, plant.lastWatered, opts && opts.offsetMinutes);
    } else if (lastWateredGiven) {
      plant.nextWateringAt = plant.lastWatered ? care.scheduleNextWatering(plant, plant.lastWatered, opts && opts.offsetMinutes) : at;
    }

    // The roadmap is regenerated only when species/age stage really changed.
    if (regenerate) {
      plant.careRoadmap = care.buildRoadmap(plant.species, plant.ageStage);
      if (body.fertilizerNote === undefined) plant.fertilizerNote = plant.careRoadmap.fertilizerRecommendation;
      plant.nextFertilizing = care.nextFertilizingFrom(plant.careRoadmap, plant.lastFertilized, at);
    }

    await plant.save();
    return present(plant, opts);
  }

  // Returns the removed document so the route can clean up its Cloudinary image.
  async function remove(userId, id) {
    const plant = await Plant.findOneAndDelete({ _id: id, owner: userId });
    if (!plant) throw notFound();
    await PlantEvent.deleteMany({ plant: plant._id });
    return plant;
  }

  async function markWatered(userId, id, opts) {
    const plant = await getOwned(userId, id);
    const at = now();
    ensureRoadmap(plant, at);
    const wasDue = care.effectiveNextWatering(plant, at) <= at;
    const pointsEarned = wasDue ? care.POINTS.water : 0;

    plant.lastWatered = at;
    plant.nextWateringAt = care.scheduleNextWatering(plant, at, opts && opts.offsetMinutes);
    await plant.save();
    await record(plant, userId, at, { eventType: 'water', points: pointsEarned });
    return { plant: present(plant, opts), pointsEarned };
  }

  async function markFertilized(userId, id, opts) {
    const plant = await getOwned(userId, id);
    const at = now();
    ensureRoadmap(plant, at);
    const interval = plant.careRoadmap.fertilizingIntervalDays;
    if (!(interval > 0)) throw invalid('fertilizing is not recommended for this plant yet');

    const wasDue = Boolean(plant.nextFertilizing) && new Date(plant.nextFertilizing) <= at;
    const pointsEarned = wasDue ? care.POINTS.fertilize : 0;

    plant.lastFertilized = at;
    plant.nextFertilizing = care.nextFertilizingFrom(plant.careRoadmap, at, at);
    await plant.save();
    await record(plant, userId, at, { eventType: 'fertilize', points: pointsEarned });
    return { plant: present(plant, opts), pointsEarned };
  }

  // "Not today": push the next watering back (soil still wet, it rained...).
  async function skip(userId, id, { reason, days } = {}, opts) {
    if (!care.SKIP_REASONS.includes(reason)) {
      throw invalid(`reason must be one of: ${care.SKIP_REASONS.join(', ')}`);
    }
    const snooze = days === undefined || days === null ? 1 : Number(days);
    if (!Number.isInteger(snooze) || snooze < 1 || snooze > care.MAX_SNOOZE_DAYS) {
      throw invalid(`days must be a whole number from 1 to ${care.MAX_SNOOZE_DAYS}`);
    }
    const plant = await getOwned(userId, id);
    const at = now();
    plant.nextWateringAt = new Date(at.getTime() + snooze * care.DAY_MS);
    await plant.save();
    await record(plant, userId, at, { eventType: 'skip', reason, metadata: { snoozeDays: snooze } });
    return present(plant, opts);
  }

  async function addNote(userId, id, note) {
    const trimmed = text(note);
    if (!trimmed) throw invalid('note is required');
    const plant = await getOwned(userId, id);
    return record(plant, userId, now(), { eventType: 'note', note: trimmed.slice(0, care.MAX_NOTE_LENGTH) });
  }

  // Newest first. One plant's history, or the whole garden's.
  async function events(userId, id) {
    const filter = { owner: userId };
    if (id) filter.plant = (await getOwned(userId, id))._id;
    return PlantEvent.find(filter).sort({ createdAt: -1 }).limit(EVENT_LIST_LIMIT).lean();
  }

  // Plants with a watering or fertilizing reminder due at or before `before`,
  // soonest first. Filtered here (not in the query) so plants created before
  // nextWateringAt existed are included.
  async function due(userId, before, opts) {
    const plants = await Plant.find({ owner: userId });
    const dueAt = (p) => care.effectiveNextWatering(p, now());
    return plants
      .filter((p) => dueAt(p) <= before || (p.nextFertilizing && new Date(p.nextFertilizing) <= before))
      .map((p) => present(p, opts))
      .sort((a, b) => a.nextWatering - b.nextWatering);
  }

  return { present, getOwned, list, get, create, update, remove, markWatered, markFertilized, skip, addNote, events, due };
}

module.exports = { createPlantService, PlantError };