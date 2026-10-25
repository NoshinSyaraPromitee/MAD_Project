// Works out the caller's UTC offset so "Today" / "Tomorrow" and clock-time
// schedules use the user's local day instead of the server's (UTC).
//
// Clients may send either header:
//   X-Timezone: Asia/Dhaka          (IANA name, preferred - handles DST)
//   X-UTC-Offset-Minutes: 360       (fixed offset, minutes east of UTC)
// With neither (or invalid values) the offset is 0, i.e. UTC.

const MAX_OFFSET_MINUTES = 14 * 60;

function offsetForZone(zone, at) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' }).formatToParts(at);
    const label = (parts.find((p) => p.type === 'timeZoneName') || {}).value || '';
    if (label === 'GMT') return 0;
    const m = /^GMT([+-])(\d{2}):(\d{2})$/.exec(label);
    if (!m) return null;
    return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
  } catch {
    return null; // unknown time zone name
  }
}

function resolveOffsetMinutes(headers = {}, at = new Date()) {
  const zone = String(headers['x-timezone'] || '').trim();
  if (zone && zone.length <= 64) {
    const off = offsetForZone(zone, at);
    if (off !== null) return off;
  }
  const raw = String(headers['x-utc-offset-minutes'] ?? '').trim();
  if (/^-?\d+$/.test(raw)) {
    const n = Number(raw);
    if (Math.abs(n) <= MAX_OFFSET_MINUTES) return n;
  }
  return 0;
}

module.exports = { resolveOffsetMinutes, offsetForZone };