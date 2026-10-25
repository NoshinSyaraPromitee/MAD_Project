const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;

const MAX_FREQUENCY_DAYS = 365;
const MAX_NOTE_LENGTH = 1000;
const MAX_SNOOZE_DAYS = 30;
const SKIP_REASONS = ['soil_still_wet', 'rained', 'other'];

const POINTS = { water: 10, fertilize: 20 };

const HEALTH = Object.freeze({
  min: 10,
  max: 100,
  waterGraceDays: 1,
  waterPenaltyPerDay: 12,
  waterPenaltyCap: 70,
  fertilizerGraceDays: 3,
  fertilizerPenaltyPerWeek: 5,
  fertilizerPenaltyCap: 15,
  scanFullDays: 7, 
  scanHalfDays: 14, 
});


// Rule-based care plan derived from the plant's age stage and species.
function buildRoadmap(species, ageStage) {
  let waterAmountMl = 200;
  let wateringTimes = ['08:00', '18:00'];
  let fertilizingIntervalDays = 14;
  let fertilizerRecommendation = 'Use a balanced NPK fertilizer every 2 weeks.';
  const tips = "Don't expose to excess sun; find a cool, dry place with plenty of indirect sunlight.";

  switch (String(ageStage || '').trim().toLowerCase()) {
    case 'seed':
    case 'seedling':
      waterAmountMl = 100;
      wateringTimes = ['08:00'];
      fertilizingIntervalDays = 0;
      fertilizerRecommendation = 'Avoid fertilizer until the first true leaves appear.';
      break;
    case 'mature':
    case 'adult':
      waterAmountMl = 300;
      wateringTimes = ['08:00', '12:00', '18:00'];
      fertilizingIntervalDays = 7;
      fertilizerRecommendation = 'Use Potassium (K) based fertilizer to support blooming.';
      break;
    default:
  }
  if (String(species || '').toLowerCase().includes('water')) waterAmountMl += 100;

  return { wateringTimes, waterAmountMl, tips, fertilizerRecommendation, fertilizingIntervalDays };
}

const hasRoadmap = (roadmap) => Boolean(roadmap && roadmap.tips);


// Next "HH:MM" clock time strictly after `from`, read in the user's local time
// (offsetMinutes east of UTC). Falls back to +24h when no time parses.
function nextWateringTime(times, from, offsetMinutes = 0) {
  const offMs = offsetMinutes * MINUTE_MS;
  const localMidnight = Math.floor((from.getTime() + offMs) / DAY_MS) * DAY_MS;
  let best = null;
  for (const t of times || []) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(t).trim());
    if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) continue;
    let candidate = localMidnight + Number(m[1]) * 3_600_000 + Number(m[2]) * MINUTE_MS - offMs;
    if (candidate <= from.getTime()) candidate += DAY_MS;
    if (best === null || candidate < best) best = candidate;
  }
  return new Date(best === null ? from.getTime() + DAY_MS : best);
}

// When the plant is next due after being watered at `from`: from + interval.
// Only when the interval is 0 does it use the roadmap's clock times.
function scheduleNextWatering(plant, from, offsetMinutes = 0) {
  const days = Number(plant.wateringFrequencyDays);
  if (days > 0) return new Date(from.getTime() + days * DAY_MS);
  const times = plant.careRoadmap ? plant.careRoadmap.wateringTimes : [];
  return nextWateringTime(times, from, offsetMinutes);
}

// The plant's due date. Never watered (and no stored date) means due right now.
function effectiveNextWatering(plant, now) {
  if (plant.nextWateringAt) return new Date(plant.nextWateringAt);
  if (plant.lastWatered && Number(plant.wateringFrequencyDays) > 0) {
    return new Date(new Date(plant.lastWatered).getTime() + plant.wateringFrequencyDays * DAY_MS);
  }
  return new Date(now);
}

const localDayNumber = (date, offsetMinutes) => Math.floor((date.getTime() + offsetMinutes * MINUTE_MS) / DAY_MS);

// Display string the app compares literally (`waterLevel === 'Today'`), so
// 'Today' and 'Tomorrow' must stay exactly as they are. Counts calendar days in
// the user's time zone, not 24h blocks.
function waterLevelFor(next, now, offsetMinutes = 0) {
  const days = localDayNumber(next, offsetMinutes) - localDayNumber(now, offsetMinutes);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} Days`;
}


// Next fertilizing date, anchored on the last fertilizing (or `now` if never).
// null when the roadmap doesn't recommend fertilizing (e.g. seedlings).
function nextFertilizingFrom(roadmap, lastFertilized, now) {
  const interval = roadmap ? Number(roadmap.fertilizingIntervalDays) : 0;
  if (!(interval > 0)) return null;
  const anchor = lastFertilized ? new Date(lastFertilized) : now;
  return new Date(anchor.getTime() + interval * DAY_MS);
}


const HEALTH_THRIVING = 'thriving';
const HEALTH_OKAY = 'okay';
const HEALTH_NEEDS_CARE = 'needs_care';
const HEALTH_CRITICAL = 'critical';

function stateForScore(score) {
  if (score >= 85) return HEALTH_THRIVING;
  if (score >= 65) return HEALTH_OKAY;
  if (score >= 40) return HEALTH_NEEDS_CARE;
  return HEALTH_CRITICAL;
}

function wholeDaysLate(due, now) {
  if (!due || !(now.getTime() > due.getTime())) return 0;
  return Math.floor((now.getTime() - due.getTime()) / DAY_MS);
}

function scanBasePenalty(severity) {
  switch (String(severity || '').trim().toLowerCase()) {
    case 'mild':
      return 10;
    case 'moderate':
      return 25;
    case 'severe':
      return 45;
    default:
      return 0; // "none", "", or unknown
  }
}

// Health is never stored: the same plant, scan and clock always give the same
// answer. `plant` needs { nextWateringAt, nextFertilizingAt }. `scan` is
// optional ({ severity, issue, at, treated }) - the penalty only applies once a
// scan source exists; until then pass null.
function computeHealth(plant, scan, now) {
  let penalty = 0;
  const reasons = [];

  const waterLate = wholeDaysLate(plant.nextWateringAt, now);
  if (waterLate > HEALTH.waterGraceDays) {
    const pen = Math.min((waterLate - HEALTH.waterGraceDays) * HEALTH.waterPenaltyPerDay, HEALTH.waterPenaltyCap);
    penalty += pen;
    reasons.push({ code: 'water_late', value: waterLate, impact: -pen });
  }

  const fertLate = wholeDaysLate(plant.nextFertilizingAt, now);
  if (fertLate > HEALTH.fertilizerGraceDays) {
    const startedWeeks = Math.ceil((fertLate - HEALTH.fertilizerGraceDays) / 7);
    const pen = Math.min(startedWeeks * HEALTH.fertilizerPenaltyPerWeek, HEALTH.fertilizerPenaltyCap);
    penalty += pen;
    reasons.push({ code: 'fertilizer_late', value: fertLate, impact: -pen });
  }

  if (scan && !scan.treated) {
    let pen = scanBasePenalty(scan.severity);
    const ageDays = now.getTime() > new Date(scan.at).getTime() ? Math.floor((now - new Date(scan.at)) / DAY_MS) : 0;
    if (ageDays > HEALTH.scanHalfDays) pen = 0;
    else if (ageDays > HEALTH.scanFullDays) pen = Math.floor(pen / 2);
    if (pen > 0) {
      penalty += pen;
      reasons.push({
        code: 'scan_issue',
        detail: scan.issue,
        severity: String(scan.severity).trim().toLowerCase(),
        impact: -pen,
      });
    }
  }

  const score = Math.max(HEALTH.min, Math.min(HEALTH.max, HEALTH.max - penalty));
  return { score, state: stateForScore(score), reasons };
}

module.exports = {
  DAY_MS,
  MAX_FREQUENCY_DAYS,
  MAX_NOTE_LENGTH,
  MAX_SNOOZE_DAYS,
  SKIP_REASONS,
  POINTS,
  HEALTH,
  buildRoadmap,
  hasRoadmap,
  nextWateringTime,
  scheduleNextWatering,
  effectiveNextWatering,
  waterLevelFor,
  nextFertilizingFrom,
  computeHealth,
  stateForScore,
};