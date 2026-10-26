'use strict';

const express = require('express');
const points = require('../services/plantPoints');

const authMod = require('../middleware/auth');
const requireAuth = typeof authMod === 'function' ? authMod : (authMod.auth || authMod.requireAuth || authMod.authenticate || authMod.protect);
if (typeof requireAuth !== 'function') throw new Error('pointsroutes: cannot find auth middleware export in middleware/auth.js');

const router = express.Router();

const userIdOf = (req) => String((req.user && (req.user.id || req.user._id)) || req.userId);
const tz = (req) => { const n = Number(req.get('X-UTC-Offset-Minutes')); return Number.isFinite(n) ? n : 0; };

const ok = (res, status, data) => res.status(status).json({ data });

const h = (fn) => async (req, res) => {
  try { await fn(req, res, userIdOf(req)); }
  catch (e) {
    if (e instanceof points.AppError) return res.status(e.status).json({ error: e.message });
    console.error('[points]', e);
    res.status(500).json({ error: 'internal server error' });
  }
};

router.get('/plants/events', requireAuth, h(async (req, res, u) => ok(res, 200, await points.gardenEvents(u))));
router.get('/plants/points', requireAuth, h(async (req, res, u) => ok(res, 200, { totalPoints: await points.totalPoints(u) })));
router.get('/plants/:id/events', requireAuth, h(async (req, res, u) => ok(res, 200, await points.plantEvents(req.params.id, u))));

router.post('/plants/:id/water', requireAuth, h(async (req, res, u) => {
  const r = await points.markWatered(req.params.id, u, { tzOffsetMinutes: tz(req) });
  ok(res, 200, { plant: r.plant, pointsEarned: r.pointsEarned });
}));
router.post('/plants/:id/fertilize', requireAuth, h(async (req, res, u) => {
  const r = await points.markFertilized(req.params.id, u);
  ok(res, 200, { plant: r.plant, pointsEarned: r.pointsEarned });
}));
router.post('/plants/:id/skip', requireAuth, h(async (req, res, u) => {
  const { reason, days } = req.body || {};
  ok(res, 200, await points.skip(req.params.id, u, reason, days));
}));
router.post('/plants/:id/notes', requireAuth, h(async (req, res, u) => {
  await points.addNote(req.params.id, u, (req.body || {}).note);
  ok(res, 201, { status: 'recorded' });
}));

module.exports = router;