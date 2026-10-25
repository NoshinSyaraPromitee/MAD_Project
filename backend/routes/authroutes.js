const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../model/user');
const RefreshToken = require('../model/refreshToken');
const PasswordReset = require('../model/passwordReset');
const { createAuthService } = require('../services/authService');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const auth = createAuthService({ User, RefreshToken, PasswordReset });

// Short-lived holding area: sessionId -> appToken. The final redirect back
// into the app doesn't reliably carry query params through Expo Go's deep
// link handling, so instead of putting the token in the URL, we stash it
// here and let the app fetch it right after the browser closes.
const pendingSessions = new Map();
const SESSION_TTL_MS = 5 * 60 * 1000; // 5 minutes — plenty for the round trip

// This MUST exactly match the "Authorized redirect URI" you registered
// in Google Cloud Console for this client.
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/auth/google/callback';

const oauthClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// GET /auth/google/callback?code=...
// Google redirects here after the user approves the login in the browser.
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  // The app sends its own redirect URI (exp://<ip>:<port>/...) as `state`
  // when it kicks off the login. This avoids hardcoding it in .env, since
  // that URI changes every time the dev machine's IP/network changes.
  const appRedirect = state ? decodeURIComponent(state) : process.env.APP_REDIRECT_URI;

  try {
    // Exchange the one-time code for Google tokens (server-to-server, uses client secret)
    const { tokens } = await oauthClient.getToken(code);

    // Verify the ID token and pull out the user's Google profile
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture, email_verified: emailVerified } = payload;

    // Find by Google id, else link to an existing account with the same
    // verified email, else create. Issues our own access + refresh tokens.
    const session = await auth.loginWithGoogle({ sub, email, name, picture, emailVerified });

    // Stash the token under the sessionId the app sent as `state`, then
    // redirect the browser back with no sensitive data in the URL at all.
    if (!appRedirect) {
      // No state passed and no fallback set — show the token as JSON so you
      // can still test this route by hand.
      return res.json({ warning: 'No redirect target (state or APP_REDIRECT_URI)', token: session.accessToken, ...session });
    }

    if (state) {
      pendingSessions.set(state, session);
      setTimeout(() => pendingSessions.delete(state), SESSION_TTL_MS);
    }

    return res.redirect(appRedirect);
  } catch (err) {
    console.error('Google auth error:', err);
    // Surface deliberate auth errors (e.g. email linked to another Google account).
    return res.status(err.status || 500).send(err.status ? err.message : 'Authentication failed');
  }
});

// GET /auth/google/session/:sessionId
// The app polls this right after the in-app browser closes, to retrieve
// the token the callback above stashed. Single-use — deleted once read.
router.get('/google/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = pendingSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found or already used' });
  }

  pendingSessions.delete(sessionId);
  // `token` kept for the current app; accessToken/refreshToken are the new pair.
  return res.json({ token: session.accessToken, accessToken: session.accessToken, refreshToken: session.refreshToken });
});

// ---- Email + password -------------------------------------------------------

// POST /auth/register  { email, password, name }
router.post('/register', async (req, res) => {
  res.status(201).json(await auth.register(req.body || {}));
});

// POST /auth/login  { email, password }
router.post('/login', async (req, res) => {
  res.json(await auth.login(req.body || {}));
});

// POST /auth/refresh  { refreshToken }  -> new access + refresh (old one is revoked)
router.post('/refresh', async (req, res) => {
  res.json(await auth.refresh((req.body || {}).refreshToken));
});

// POST /auth/logout  { refreshToken }
router.post('/logout', async (req, res) => {
  await auth.logout((req.body || {}).refreshToken);
  res.status(204).end();
});

// POST /auth/forgot-password  { email }
router.post('/forgot-password', async (req, res) => {
  await auth.forgotPassword((req.body || {}).email);
  res.status(204).end();
});

// POST /auth/reset-password  { email, code, newPassword }
router.post('/reset-password', async (req, res) => {
  await auth.resetPassword(req.body || {});
  res.status(204).end();
});

// GET /auth/me
router.get('/me', requireAuth, async (req, res) => {
  res.json(await auth.me(req.user.userId));
});

module.exports = router;