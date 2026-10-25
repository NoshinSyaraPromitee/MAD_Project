// Port of the Go backend's usecase/auth (service.go, password_reset.go,
// google.go). Models are injected so the logic can be unit-tested without a
// database (see test/auth.test.js).
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parseDuration, generateOpaqueToken, hashToken, generateResetCode } = require('../utils/tokens');

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const invalid = (m) => new AuthError(400, m);
const unauthorized = (m) => new AuthError(401, m);
const conflict = (m) => new AuthError(409, m);

const MIN_PASSWORD = 8;
const RESET_CODE_TTL_MS = 15 * 60 * 1000;
const normalizeEmail = (e) => String(e || '').trim().toLowerCase();
const isDuplicateKey = (err) => err && err.code === 11000;

// Compared against when the email is unknown, so "no such user" and "wrong
// password" take about the same time (don't leak which emails exist).
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

function createAuthService({ User, RefreshToken, PasswordReset, env = process.env, now = () => new Date(), log = console.log }) {
  const secret = env.JWT_SECRET;
  // Default 7d, not the Go default of 15m: the Expo app has no refresh logic
  // yet, so a short access token would sign users out. Lower this (e.g. 15m)
  // once the app calls /auth/refresh.
  const accessTtlMs = parseDuration(env.JWT_ACCESS_TTL, 7 * 86_400_000);
  const refreshTtlMs = parseDuration(env.JWT_REFRESH_TTL, 30 * 86_400_000);

  if (!secret) throw new Error('JWT_SECRET is not set');

  async function issueTokens(user) {
    const accessToken = jwt.sign({ userId: String(user._id), email: user.email }, secret, {
      expiresIn: Math.floor(accessTtlMs / 1000),
    });
    const refreshToken = generateOpaqueToken();
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(now().getTime() + refreshTtlMs),
    });
    return {
      user: typeof user.toJSON === 'function' ? user.toJSON() : user,
      accessToken,
      refreshToken,
      expiresIn: Math.floor(accessTtlMs / 1000),
    };
  }

  async function register({ email, password, name }) {
    email = normalizeEmail(email);
    if (!email || !email.includes('@')) throw invalid('a valid email is required');
    if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
      throw invalid(`password must be at least ${MIN_PASSWORD} characters`);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    let user;
    try {
      user = await User.create({ email, name: String(name || '').trim(), passwordHash });
    } catch (err) {
      if (isDuplicateKey(err)) throw conflict('an account with this email already exists');
      throw err;
    }
    return issueTokens(user);
  }

  async function login({ email, password }) {
    email = normalizeEmail(email);
    const user = await User.findOne({ email }).select('+passwordHash');
    const ok = await bcrypt.compare(String(password || ''), (user && user.passwordHash) || DUMMY_HASH);
    // A Google-only user has no passwordHash, so `ok` can't be true for them.
    if (!user || !user.passwordHash || !ok) throw unauthorized('invalid email or password');
    return issueTokens(user);
  }

  // Rotating refresh: the presented token is revoked and a new pair issued.
  // The revoke is a single atomic update, so two requests racing with the
  // same token can't both succeed.
  async function refresh(rawToken) {
    if (!rawToken) throw invalid('refreshToken is required');
    const at = now();
    const rt = await RefreshToken.findOneAndUpdate(
      { tokenHash: hashToken(rawToken), revokedAt: null, expiresAt: { $gt: at } },
      { revokedAt: at }
    );
    if (!rt) throw unauthorized('invalid or expired refresh token');
    const user = await User.findById(rt.user);
    if (!user) throw unauthorized('invalid refresh token');
    return issueTokens(user);
  }

  // Idempotent: an unknown or already-revoked token is not an error.
  async function logout(rawToken) {
    if (!rawToken) throw invalid('refreshToken is required');
    await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(rawToken), revokedAt: null }, { revokedAt: now() });
  }

  async function me(userId) {
    const user = await User.findById(userId);
    if (!user) throw unauthorized('account no longer exists');
    return user;
  }

  // Unknown email behaves like success (no account enumeration). A
  // Google-only account gets an explicit error, same as the Go version.
  async function forgotPassword(email) {
    email = normalizeEmail(email);
    if (!email) throw invalid('email is required');
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return;
    if (!user.passwordHash && user.googleId) {
      throw invalid("this account uses Google sign-in - there's no password to reset");
    }
    const code = generateResetCode();
    await PasswordReset.findOneAndUpdate(
      { email },
      { codeHash: hashToken(code), expiresAt: new Date(now().getTime() + RESET_CODE_TTL_MS) },
      { upsert: true }
    );
    // TODO: send through a real email provider (e.g. nodemailer). Logged so
    // the flow is testable end to end, same as the Go backend.
    log(`password reset code for ${email}: ${code} (expires in 15m)`);
  }

  // The code is consumed on the first attempt, right or wrong.
  async function resetPassword({ email, code, newPassword }) {
    email = normalizeEmail(email);
    if (!email || !code || !newPassword) throw invalid('email, code and newPassword are required');
    if (String(newPassword).length < MIN_PASSWORD) {
      throw invalid(`password must be at least ${MIN_PASSWORD} characters`);
    }
    const stored = await PasswordReset.findOneAndDelete({ email });
    if (!stored || stored.expiresAt <= now() || stored.codeHash !== hashToken(String(code))) {
      throw unauthorized('invalid or expired reset code');
    }
    const user = await User.findOne({ email });
    if (!user) throw unauthorized('invalid or expired reset code');
    await User.updateOne({ _id: user._id }, { passwordHash: await bcrypt.hash(newPassword, 10) });
    // Whoever knew the old password must not stay signed in.
    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: now() });
  }

  // Called by the Google callback after the ID token has been verified.
  // Find by Google id, else by verified email (link), else create.
  async function loginWithGoogle({ sub, email, name, picture, emailVerified }) {
    email = normalizeEmail(email);
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        if (user.googleId && user.googleId !== sub) {
          throw conflict('this email is linked to a different Google account');
        }
        // Don't let an unverified Google email take over an existing account.
        if (!emailVerified) throw unauthorized('Google email is not verified');
        await User.updateOne({ _id: user._id }, { googleId: sub });
        user.googleId = sub;
      } else {
        user = await User.create({ googleId: sub, email, name: name || '', avatarUrl: picture || '' });
      }
    }
    return issueTokens(user);
  }

  return { register, login, refresh, logout, me, forgotPassword, resetPassword, loginWithGoogle, issueTokens };
}

module.exports = { createAuthService, AuthError };
