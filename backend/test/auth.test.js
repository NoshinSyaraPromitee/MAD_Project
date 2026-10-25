// Runs without MongoDB: models are replaced by tiny in-memory fakes that
// support only the query shapes authService uses.
const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { createAuthService } = require('../services/authService');
const { hashToken } = require('../utils/tokens');

let seq = 0;
const matches = (doc, q) =>
  Object.entries(q).every(([k, v]) => {
    if (v && typeof v === 'object' && '$gt' in v) return doc[k] > v.$gt;
    return String(doc[k] ?? null) === String(v ?? null);
  });

function fakeModel({ unique = [] } = {}) {
  const rows = [];
  const wrap = (r) => (r ? Object.assign(r, { toJSON: () => ({ ...r, passwordHash: undefined, toJSON: undefined }) }) : null);
  const query = (r) => ({ select: () => r, then: (f, e) => Promise.resolve(r).then(f, e) });
  return {
    rows,
    create: async (data) => {
      for (const k of unique) {
        if (data[k] && rows.some((r) => r[k] === data[k])) throw Object.assign(new Error('dup'), { code: 11000 });
      }
      const row = { _id: `id${++seq}`, ...data };
      rows.push(row);
      return wrap(row);
    },
    findOne: (q) => query(wrap(rows.find((r) => matches(r, q)))),
    findById: async (id) => wrap(rows.find((r) => r._id === id)),
    findOneAndUpdate: async (q, upd, opts = {}) => {
      let row = rows.find((r) => matches(r, q));
      if (!row && opts.upsert) rows.push((row = { _id: `id${++seq}`, ...q }));
      if (row) Object.assign(row, upd);
      return row || null;
    },
    findOneAndDelete: async (q) => {
      const i = rows.findIndex((r) => matches(r, q));
      return i < 0 ? null : rows.splice(i, 1)[0];
    },
    updateOne: async (q, upd) => Object.assign(rows.find((r) => matches(r, q)) || {}, upd),
    updateMany: async (q, upd) => rows.filter((r) => matches(r, q)).forEach((r) => Object.assign(r, upd)),
  };
}

function setup(extra = {}) {
  const User = fakeModel({ unique: ['email'] });
  const RefreshToken = fakeModel();
  const PasswordReset = fakeModel();
  const logs = [];
  let clock = Date.now();
  const svc = createAuthService({
    User, RefreshToken, PasswordReset,
    env: { JWT_SECRET: 'test-secret', JWT_ACCESS_TTL: '15m', JWT_REFRESH_TTL: '1h', ...extra },
    now: () => new Date(clock),
    log: (m) => logs.push(m),
  });
  return { svc, User, RefreshToken, PasswordReset, logs, advance: (ms) => (clock += ms) };
}

const creds = { email: ' Maha@Example.com ', password: 'hunter2hunter2', name: 'Maha' };

test('register normalizes email, hashes password, issues tokens', async () => {
  const { svc, User } = setup();
  const r = await svc.register(creds);
  assert.equal(User.rows[0].email, 'maha@example.com');
  assert.notEqual(User.rows[0].passwordHash, creds.password);
  assert.equal(r.expiresIn, 900);
  const payload = jwt.verify(r.accessToken, 'test-secret');
  assert.equal(payload.userId, User.rows[0]._id); // shape plantroutes.js relies on
  assert.equal(payload.email, 'maha@example.com');
  assert.equal(r.user.passwordHash, undefined);
});

test('register validation and duplicate email', async () => {
  const { svc } = setup();
  await assert.rejects(svc.register({ email: 'nope', password: 'longenough1' }), { status: 400 });
  await assert.rejects(svc.register({ email: 'a@b.c', password: 'short' }), { status: 400 });
  await svc.register(creds);
  await assert.rejects(svc.register(creds), { status: 409 });
});

test('login: success, wrong password, unknown email give same 401 message', async () => {
  const { svc } = setup();
  await svc.register(creds);
  const ok = await svc.login({ email: 'MAHA@example.com', password: creds.password });
  assert.ok(ok.accessToken && ok.refreshToken);
  const bad = await svc.login({ email: 'maha@example.com', password: 'wrong-wrong' }).catch((e) => e);
  const unk = await svc.login({ email: 'who@example.com', password: 'whatever12' }).catch((e) => e);
  assert.equal(bad.status, 401);
  assert.equal(unk.status, 401);
  assert.equal(bad.message, unk.message);
});

test('Google-only account cannot password-login', async () => {
  const { svc } = setup();
  await svc.loginWithGoogle({ sub: 'g1', email: 'g@x.com', name: 'G', emailVerified: true });
  await assert.rejects(svc.login({ email: 'g@x.com', password: '' }), { status: 401 });
  await assert.rejects(svc.login({ email: 'g@x.com', password: 'anything12' }), { status: 401 });
});

test('refresh rotates: old token dies, new one works, reuse rejected', async () => {
  const { svc } = setup();
  const first = await svc.register(creds);
  const second = await svc.refresh(first.refreshToken);
  assert.notEqual(second.refreshToken, first.refreshToken);
  await assert.rejects(svc.refresh(first.refreshToken), { status: 401 });
  await svc.refresh(second.refreshToken);
  await assert.rejects(svc.refresh(''), { status: 400 });
  await assert.rejects(svc.refresh('garbage'), { status: 401 });
});

test('refresh token expires', async () => {
  const { svc, advance } = setup();
  const r = await svc.register(creds);
  advance(61 * 60 * 1000);
  await assert.rejects(svc.refresh(r.refreshToken), { status: 401 });
});

test('logout revokes, is idempotent', async () => {
  const { svc } = setup();
  const r = await svc.register(creds);
  await svc.logout(r.refreshToken);
  await svc.logout(r.refreshToken);
  await svc.logout('never-issued');
  await assert.rejects(svc.refresh(r.refreshToken), { status: 401 });
});

test('stores only a hash of the refresh token', async () => {
  const { svc, RefreshToken } = setup();
  const r = await svc.register(creds);
  assert.equal(RefreshToken.rows[0].tokenHash, hashToken(r.refreshToken));
  assert.notEqual(RefreshToken.rows[0].tokenHash, r.refreshToken);
});

test('forgot/reset password: full flow, single use, revokes sessions', async () => {
  const { svc, logs } = setup();
  const s = await svc.register(creds);
  await svc.forgotPassword('maha@example.com');
  const code = /: (\d{6}) /.exec(logs.at(-1))[1];
  await svc.resetPassword({ email: 'maha@example.com', code, newPassword: 'brand-new-pass' });
  await assert.rejects(svc.login({ email: 'maha@example.com', password: creds.password }), { status: 401 });
  await svc.login({ email: 'maha@example.com', password: 'brand-new-pass' });
  await assert.rejects(svc.refresh(s.refreshToken), { status: 401 }); // old session killed
  await assert.rejects(svc.resetPassword({ email: 'maha@example.com', code, newPassword: 'another-pass-1' }), { status: 401 });
});

test('wrong reset code burns the code; expired code rejected', async () => {
  const { svc, logs, advance } = setup();
  await svc.register(creds);
  await svc.forgotPassword('maha@example.com');
  const code = /: (\d{6}) /.exec(logs.at(-1))[1];
  const wrong = code === '000000' ? '111111' : '000000';
  await assert.rejects(svc.resetPassword({ email: 'maha@example.com', code: wrong, newPassword: 'brand-new-pass' }), { status: 401 });
  await assert.rejects(svc.resetPassword({ email: 'maha@example.com', code, newPassword: 'brand-new-pass' }), { status: 401 });

  await svc.forgotPassword('maha@example.com');
  const code2 = /: (\d{6}) /.exec(logs.at(-1))[1];
  advance(16 * 60 * 1000);
  await assert.rejects(svc.resetPassword({ email: 'maha@example.com', code: code2, newPassword: 'brand-new-pass' }), { status: 401 });
});

test('forgot-password: unknown email is silent; Google-only is explicit', async () => {
  const { svc, logs } = setup();
  await svc.forgotPassword('nobody@example.com');
  assert.equal(logs.length, 0);
  await svc.loginWithGoogle({ sub: 'g1', email: 'g@x.com', name: 'G', emailVerified: true });
  await assert.rejects(svc.forgotPassword('g@x.com'), { status: 400 });
});

test('Google: creates, relogs same user, links to verified email account only', async () => {
  const { svc, User } = setup();
  await svc.register(creds);
  // unverified Google email must not take over the existing account
  await assert.rejects(svc.loginWithGoogle({ sub: 'g9', email: 'maha@example.com', emailVerified: false }), { status: 401 });
  // verified: linked, no duplicate user
  await svc.loginWithGoogle({ sub: 'g9', email: 'maha@example.com', emailVerified: true });
  assert.equal(User.rows.length, 1);
  assert.equal(User.rows[0].googleId, 'g9');
  await svc.loginWithGoogle({ sub: 'g9', email: 'maha@example.com', emailVerified: true });
  assert.equal(User.rows.length, 1);
  // same email, different Google account -> conflict
  await assert.rejects(svc.loginWithGoogle({ sub: 'other', email: 'maha@example.com', emailVerified: true }), { status: 409 });
  // password login still works after linking
  await svc.login({ email: 'maha@example.com', password: creds.password });
});

test('missing JWT_SECRET fails fast', () => {
  assert.throws(() => setup({ JWT_SECRET: '' }), /JWT_SECRET/);
});
