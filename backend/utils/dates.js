'use strict';

const DAY_MS = 24 * 60 * 60 * 1000;

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function waterLevelFor(next, now) {
  const day = (d) => Math.floor(d.getTime() / DAY_MS);
  const days = day(next) - day(now);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

function nextWateringTime(times, from, offsetMinutes = 0) {
  const offMs = offsetMinutes * 60 * 1000;
  const local = new Date(from.getTime() + offMs);
  let best = null;
  for (const raw of times || []) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(raw).trim());
    if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) continue;
    let c = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), Number(m[1]), Number(m[2]));
    if (c <= local.getTime()) c += DAY_MS;
    if (best === null || c < best) best = c;
  }
  return best === null ? new Date(from.getTime() + DAY_MS) : new Date(best - offMs);
}

module.exports = { addDays, waterLevelFor, nextWateringTime };