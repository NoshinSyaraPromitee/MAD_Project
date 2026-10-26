const crypto = require('crypto');

// "15m", "720h", "30d", "45s" -> milliseconds. Same style as the Go
// backend's JWT_ACCESS_TTL / JWT_REFRESH_TTL env vars.
function parseDuration(str, fallbackMs) {
  const m = /^(\d+)\s*(s|m|h|d)$/.exec(String(str || '').trim());
  if (!m) return fallbackMs;
  const unit = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[m[2]];
  return Number(m[1]) * unit;
}

// 256-bit random string. Used for refresh tokens: opaque (not a JWT) so they
// can be looked up by hash and revoked.
function generateOpaqueToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Only the hash of a refresh token is stored, so a DB leak can't be replayed.
function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

// 6-digit numeric code, uniform over 000000-999999.
function generateResetCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

module.exports = { parseDuration, generateOpaqueToken, hashToken, generateResetCode };
