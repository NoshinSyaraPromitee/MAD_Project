// Runs without MongoDB: Plant / PlantEvent are tiny in-memory fakes supporting
// only the query shapes plantService uses.
const test = require('node:test');
const assert = require('node:assert/strict');
const { createPlantService } = require('../services/plantService');

const DAY = 86_400_000;
const T0 = new Date('2026-10-26T10:00:00Z');

function setup() {
  let seq = 0;
  const clock = { t: new Date(T0) };
  const plants = [];
  const events = [];

  const wrap = (row) =>
    Object.assign(row, {
      toObject() {
        const { toObject, save, ...rest } = this; // eslint-disable-line no-unused-vars
        return { ...rest };
      },
      async save() {
        return this;
      },
    });
  const matches = (row, q) => Object.entries(q).every(([k, v]) => String(row[k]) === String(v));
  const chain = (rows) => {
    let out = [...rows];
    const api = {
      sort: (s) => {
        const [[k, dir]] = Object.entries(s);
        out.sort((a, b) => (a[k] - b[k]) * dir);
        return api;
      },
      limit: (n) => {
        out = out.slice(0, n);
        return api;
      },
      lean: () => api,
      then: (f, e) => Promise.resolve(out).then(f, e),
    };
    return api;
  };

  const Plant = {
    create: async (data) => {
      const row = wrap({ _id: `p${++seq}`, ...data });
      plants.push(row);
      return row;
    },
    findOne: async (q) => plants.find((r) => matches(r, q)) || null,
    find: (q) => chain(plants.filter((r) => matches(r, q))),
    findOneAndDelete: async (q) => {
      const i = plants.findIndex((r) => matches(r, q));
      return i < 0 ? null : plants.splice(i, 1)[0];
    },
  };
  const PlantEvent = {
    create: async (data) => {
      const row = { _id: `e${++seq}`, ...data };
      events.push(row);
      return row;
    },
    find: (q) => chain(events.filter((r) => matches(r, q))),
    deleteMany: async (q) => {
      for (let i = events.length - 1; i >= 0; i--) if (matches(events[i], q)) events.splice(i, 1);
    },
  };

  const svc = createPlantService({ Plant, PlantEvent, now: () => new Date(clock.t) });
  const advance = (days) => (clock.t = new Date(clock.t.getTime() + days * DAY));
  return { svc, plants, events, advance };
}

const U = 'user1';
const rejectsWith = (p, status, re) => assert.rejects(p, (e) => e.status === status && re.test(e.message));

test('create builds a roadmap and a fertilizing schedule; never watered = due now', async () => {
  const { svc } = setup();
  const p = await svc.create(U, { nickname: 'Fern', species: 'Boston Fern', ageStage: 'mature' });
  assert.equal(p.careRoadmap.fertilizingIntervalDays, 7);
  assert.equal(p.nextFertilizing.getTime(), T0.getTime() + 7 * DAY);
  assert.equal(p.waterLevel, 'Today');
  assert.equal(p.healthState, 'thriving');
  assert.equal(p.wateringFrequencyDays, 7);
});

test('create from lastWatered schedules the next watering and clamps the future', async () => {
  const { svc } = setup();
  const p = await svc.create(U, {
    nickname: 'A',
    species: 'B',
    wateringFrequencyDays: 7,
    lastWatered: new Date(T0.getTime() - 2 * DAY).toISOString(),
  });
  assert.equal(p.waterLevel, '5 Days');
  const future = await svc.create(U, { nickname: 'A', species: 'B', lastWatered: new Date(T0.getTime() + 9 * DAY).toISOString() });
  assert.equal(future.lastWatered.getTime(), T0.getTime());
});

test('create validates input and keeps AI-identify values', async () => {
  const { svc } = setup();
  await rejectsWith(svc.create(U, { nickname: 'x' }), 400, /nickname and species/);
  await rejectsWith(svc.create(U, { nickname: 'x', species: 'y', wateringFrequencyDays: -2 }), 400, /wateringFrequencyDays/);
  await rejectsWith(svc.create(U, { nickname: 'x', species: 'y', lastWatered: 'nope' }), 400, /lastWatered/);
  const p = await svc.create(U, { nickname: 'x', species: 'y', waterAmountMl: 450, careTips: ' Keep it humid ' });
  assert.equal(p.careRoadmap.waterAmountMl, 450);
  assert.equal(p.careRoadmap.tips, 'Keep it humid');
});

test('watering awards points only when due, and reschedules', async () => {
  const { svc, events, advance } = setup();
  const p = await svc.create(U, { nickname: 'A', species: 'B', wateringFrequencyDays: 3 });

  const first = await svc.markWatered(U, p._id);
  assert.equal(first.pointsEarned, 10); // was due (never watered)
  assert.equal(first.plant.waterLevel, '3 Days');

  const early = await svc.markWatered(U, p._id);
  assert.equal(early.pointsEarned, 0); // not due yet

  advance(3);
  assert.equal((await svc.markWatered(U, p._id)).pointsEarned, 10);
  assert.deepEqual(events.map((e) => [e.eventType, e.points]), [['water', 10], ['water', 0], ['water', 10]]);
});

test('fertilize: refused for seedlings, points only when due', async () => {
  const { svc, advance } = setup();
  const seedling = await svc.create(U, { nickname: 'S', species: 'Basil', ageStage: 'seedling' });
  await rejectsWith(svc.markFertilized(U, seedling._id), 400, /not recommended/);

  const adult = await svc.create(U, { nickname: 'A', species: 'Rose', ageStage: 'adult' });
  assert.equal((await svc.markFertilized(U, adult._id)).pointsEarned, 0); // not due on day 0
  advance(7);
  const done = await svc.markFertilized(U, adult._id);
  assert.equal(done.pointsEarned, 20);
  assert.equal(done.plant.nextFertilizing.getTime(), T0.getTime() + 14 * DAY);
});

test('skip validates reason and days, moves the due date, logs an event', async () => {
  const { svc, events } = setup();
  const p = await svc.create(U, { nickname: 'A', species: 'B' });
  await rejectsWith(svc.skip(U, p._id, { reason: 'lazy' }), 400, /reason/);
  await rejectsWith(svc.skip(U, p._id, { reason: 'rained', days: 31 }), 400, /days/);
  await rejectsWith(svc.skip(U, p._id, { reason: 'rained', days: 1.5 }), 400, /days/);

  assert.equal((await svc.skip(U, p._id, { reason: 'rained' })).waterLevel, 'Tomorrow'); // default 1 day
  const snoozed = await svc.skip(U, p._id, { reason: 'soil_still_wet', days: 4 });
  assert.equal(snoozed.waterLevel, '4 Days');
  assert.deepEqual(events.at(-1).metadata, { snoozeDays: 4 });
});

test('notes: required, trimmed, capped at 1000 characters', async () => {
  const { svc, events } = setup();
  const p = await svc.create(U, { nickname: 'A', species: 'B' });
  await rejectsWith(svc.addNote(U, p._id, '   '), 400, /note is required/);
  await svc.addNote(U, p._id, `  ${'x'.repeat(1500)}  `);
  assert.equal(events[0].note.length, 1000);
});

test('update: roadmap regenerates only when species/age stage really change', async () => {
  const { svc } = setup();
  const p = await svc.create(U, { nickname: 'A', species: 'Rose', ageStage: 'seedling' });
  assert.equal(p.careRoadmap.fertilizingIntervalDays, 0);

  const same = await svc.update(U, p._id, { species: 'rose' }); // same name, different case
  assert.equal(same.careRoadmap.fertilizingIntervalDays, 0);

  const grown = await svc.update(U, p._id, { ageStage: 'adult' });
  assert.equal(grown.careRoadmap.fertilizingIntervalDays, 7);
  assert.ok(grown.nextFertilizing);
  assert.match(grown.fertilizerNote, /Potassium/);
});

test('update: interval change re-anchors on lastWatered; client cannot set health', async () => {
  const { svc } = setup();
  const p = await svc.create(U, {
    nickname: 'A',
    species: 'B',
    wateringFrequencyDays: 7,
    lastWatered: new Date(T0.getTime() - 2 * DAY).toISOString(),
  });
  const changed = await svc.update(U, p._id, { wateringFrequencyDays: 4, health: 5 });
  assert.equal(changed.waterLevel, '2 Days'); // lastWatered(-2d) + 4d
  assert.equal(changed.health, 100);
  await rejectsWith(svc.update(U, p._id, { wateringFrequencyDays: 0 }), 400, /wateringFrequencyDays/);
  await rejectsWith(svc.update(U, p._id, { nickname: ' ' }), 400, /nickname/);
});

test('update: setting lastWatered to now moves the due date out', async () => {
  const { svc } = setup();
  const p = await svc.create(U, { nickname: 'A', species: 'B', wateringFrequencyDays: 5 });
  assert.equal(p.waterLevel, 'Today');
  const watered = await svc.update(U, p._id, { lastWatered: T0.toISOString() });
  assert.equal(watered.waterLevel, '5 Days');
});

test('a plant created before these fields existed still works', async () => {
  const { svc, plants } = setup();
  plants.push(
    Object.assign(
      { _id: 'old1', owner: U, nickname: 'Old', species: 'Cactus', wateringFrequencyDays: 7, lastWatered: new Date(T0.getTime() - 10 * DAY) },
      { toObject() { const { toObject, save, ...r } = this; return { ...r }; }, async save() { return this; } } // eslint-disable-line
    )
  );
  const p = await svc.get(U, 'old1');
  assert.equal(p.waterLevel, 'Today'); // due 3 days ago
  assert.equal(p.health, 76); // 100 - (3-1)*12
  assert.ok(p.careRoadmap.tips);
  const fert = await svc.markFertilized(U, 'old1'); // backfills the roadmap
  assert.equal(fert.pointsEarned, 0);
});

test('events: newest first, per plant or whole garden, 404 for other users', async () => {
  const { svc, advance } = setup();
  const a = await svc.create(U, { nickname: 'A', species: 'x' });
  const b = await svc.create(U, { nickname: 'B', species: 'y' });
  await svc.markWatered(U, a._id);
  advance(1);
  await svc.addNote(U, b._id, 'new leaf');
  advance(1);
  await svc.markWatered(U, b._id);

  const garden = await svc.events(U);
  assert.deepEqual(garden.map((e) => e.eventType), ['water', 'note', 'water']);
  assert.deepEqual((await svc.events(U, a._id)).map((e) => e.eventType), ['water']);
  await rejectsWith(svc.events('intruder', a._id), 404, /not found/i);
  await rejectsWith(svc.markWatered('intruder', a._id), 404, /not found/i);
});

test('due: includes overdue watering and fertilizing, soonest first', async () => {
  const { svc, advance } = setup();
  const soon = await svc.create(U, { nickname: 'Soon', species: 'a', wateringFrequencyDays: 2, lastWatered: T0.toISOString() });
  const never = await svc.create(U, { nickname: 'Never', species: 'b' }); // due now
  const adult = await svc.create(U, { nickname: 'Adult', species: 'c', ageStage: 'adult', wateringFrequencyDays: 30, lastWatered: T0.toISOString() });

  assert.deepEqual((await svc.due(U, new Date(T0))).map((p) => p.nickname), ['Never']);
  advance(2);
  assert.deepEqual((await svc.due(U, new Date(T0.getTime() + 2 * DAY))).map((p) => p.nickname), ['Never', 'Soon']);
  advance(6); // adult's fertilizing (day 7) is due even though watering is not
  const names = (await svc.due(U, new Date(T0.getTime() + 8 * DAY))).map((p) => p.nickname);
  assert.deepEqual(names, ['Never', 'Soon', 'Adult']);
  assert.ok(soon && never && adult);
});

test('remove deletes the plant and its events', async () => {
  const { svc, events } = setup();
  const p = await svc.create(U, { nickname: 'A', species: 'B' });
  await svc.addNote(U, p._id, 'hi');
  await svc.remove(U, p._id);
  assert.equal(events.length, 0);
  await rejectsWith(svc.get(U, p._id), 404, /not found/i);
  await rejectsWith(svc.remove(U, p._id), 404, /not found/i);
});
