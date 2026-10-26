// Pure rules only - no database, no clock.
const test = require('node:test');
const assert = require('node:assert/strict');
const care = require('../services/plantCare');
const { resolveOffsetMinutes } = require('../utils/timezone');

const NOW = new Date('2026-10-26T10:00:00Z');
const daysAgo = (n, from = NOW) => new Date(from.getTime() - n * care.DAY_MS);
const daysAhead = (n, from = NOW) => new Date(from.getTime() + n * care.DAY_MS);

test('roadmap follows the age stage', () => {
  assert.deepEqual(
    [care.buildRoadmap('Rose', 'seedling').fertilizingIntervalDays, care.buildRoadmap('Rose', 'seedling').waterAmountMl],
    [0, 100]
  );
  const adult = care.buildRoadmap('Rose', 'Adult');
  assert.equal(adult.fertilizingIntervalDays, 7);
  assert.deepEqual(adult.wateringTimes, ['08:00', '12:00', '18:00']);
  assert.equal(care.buildRoadmap('Rose', '').fertilizingIntervalDays, 14);
});

test('water plants get 100ml extra', () => {
  assert.equal(care.buildRoadmap('Water Lily', 'mature').waterAmountMl, 400);
});

test('waterLevel counts local calendar days and keeps the literal strings', () => {
  const now = new Date('2026-10-26T10:00:00Z');
  assert.equal(care.waterLevelFor(now, now), 'Today');
  assert.equal(care.waterLevelFor(daysAgo(3), now), 'Today'); // overdue is still "Today"
  assert.equal(care.waterLevelFor(daysAhead(1), now), 'Tomorrow');
  assert.equal(care.waterLevelFor(daysAhead(5), now), '5 Days');
  // 20:00Z is already tomorrow 02:00 in Dhaka (UTC+6) but still today in UTC.
  const lateEvening = new Date('2026-10-26T20:00:00Z');
  assert.equal(care.waterLevelFor(lateEvening, now, 0), 'Today');
  assert.equal(care.waterLevelFor(lateEvening, now, 360), 'Tomorrow');
});

test('schedule uses the interval, else the roadmap clock times in local time', () => {
  const plant = { wateringFrequencyDays: 3, careRoadmap: { wateringTimes: ['08:00', '18:00'] } };
  assert.equal(care.scheduleNextWatering(plant, NOW).toISOString(), '2026-10-29T10:00:00.000Z');

  const clock = { wateringFrequencyDays: 0, careRoadmap: { wateringTimes: ['08:00', '18:00'] } };
  // 10:00Z is 16:00 in Dhaka -> next slot is 18:00 Dhaka = 12:00Z the same day.
  assert.equal(care.scheduleNextWatering(clock, NOW, 360).toISOString(), '2026-10-26T12:00:00.000Z');
  // After the last slot it rolls to tomorrow's first: 08:00 Dhaka = 02:00Z.
  const late = new Date('2026-10-26T13:00:00Z');
  assert.equal(care.scheduleNextWatering(clock, late, 360).toISOString(), '2026-10-27T02:00:00.000Z');
  // No usable times: +24h.
  assert.equal(care.nextWateringTime([], NOW).toISOString(), '2026-10-27T10:00:00.000Z');
});

test('effective next watering: stored, derived, or due now', () => {
  const stored = new Date('2026-11-01T00:00:00Z');
  assert.equal(care.effectiveNextWatering({ nextWateringAt: stored }, NOW).getTime(), stored.getTime());
  const legacy = { lastWatered: daysAgo(2), wateringFrequencyDays: 7 };
  assert.equal(care.effectiveNextWatering(legacy, NOW).getTime(), daysAhead(5).getTime());
  assert.equal(care.effectiveNextWatering({ wateringFrequencyDays: 7 }, NOW).getTime(), NOW.getTime());
});

test('next fertilizing anchors on the last fertilizing, null for seedlings', () => {
  const road = { fertilizingIntervalDays: 14 };
  assert.equal(care.nextFertilizingFrom(road, null, NOW).getTime(), daysAhead(14).getTime());
  assert.equal(care.nextFertilizingFrom(road, daysAgo(4), NOW).getTime(), daysAhead(10).getTime());
  assert.equal(care.nextFertilizingFrom({ fertilizingIntervalDays: 0 }, null, NOW), null);
});

test('health: full score when on schedule, one day of grace for water', () => {
  assert.deepEqual(care.computeHealth({ nextWateringAt: daysAhead(2) }, null, NOW), {
    score: 100,
    state: 'thriving',
    reasons: [],
  });
  assert.equal(care.computeHealth({ nextWateringAt: daysAgo(1) }, null, NOW).score, 100); // grace day
});

test('health: water penalty is 12/day after grace, capped at 70', () => {
  const four = care.computeHealth({ nextWateringAt: daysAgo(4) }, null, NOW);
  assert.equal(four.score, 64);
  assert.equal(four.state, 'needs_care');
  assert.deepEqual(four.reasons, [{ code: 'water_late', value: 4, impact: -36 }]);
  const twenty = care.computeHealth({ nextWateringAt: daysAgo(20) }, null, NOW);
  assert.equal(twenty.score, 30);
  assert.equal(twenty.state, 'critical');
});

test('health: fertilizer penalty is 5 per started week after 3 days, capped at 15', () => {
  const h = (late) => care.computeHealth({ nextWateringAt: daysAhead(1), nextFertilizingAt: daysAgo(late) }, null, NOW);
  assert.equal(h(3).score, 100);
  assert.equal(h(4).score, 95);
  assert.equal(h(11).score, 90);
  assert.equal(h(60).score, 85);
});

test('health: untreated scans count fully, then half, then stop; treated never count', () => {
  const scan = (ageDays, extra = {}) => ({ severity: 'Severe', issue: 'Leaf rust', at: daysAgo(ageDays), ...extra });
  const h = (s) => care.computeHealth({ nextWateringAt: daysAhead(1) }, s, NOW);
  assert.equal(h(scan(2)).score, 55);
  assert.equal(h(scan(10)).score, 78); // floor(45 / 2) = 22
  assert.equal(h(scan(15)).score, 100);
  assert.equal(h(scan(2, { treated: true })).score, 100);
  assert.equal(h(scan(2, { severity: 'None' })).score, 100);
  assert.equal(h(scan(2)).reasons[0].detail, 'Leaf rust');
});

test('health never drops below 10', () => {
  const plant = { nextWateringAt: daysAgo(30), nextFertilizingAt: daysAgo(60) };
  const scan = { severity: 'severe', issue: 'x', at: NOW };
  assert.equal(care.computeHealth(plant, scan, NOW).score, 10);
});

test('timezone: IANA name, numeric offset, and safe fallbacks', () => {
  assert.equal(resolveOffsetMinutes({ 'x-timezone': 'Asia/Dhaka' }), 360);
  assert.equal(resolveOffsetMinutes({ 'x-timezone': 'UTC' }), 0);
  assert.equal(resolveOffsetMinutes({ 'x-utc-offset-minutes': '-300' }), -300);
  assert.equal(resolveOffsetMinutes({ 'x-timezone': 'Not/AZone', 'x-utc-offset-minutes': '330' }), 330);
  assert.equal(resolveOffsetMinutes({ 'x-utc-offset-minutes': '99999' }), 0);
  assert.equal(resolveOffsetMinutes({}), 0);
});
