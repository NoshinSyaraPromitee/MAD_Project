const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../model/user');

const router = express.Router();

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
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    // Exchange the one-time code for Google tokens (server-to-server, uses client secret)
    const { tokens } = await oauthClient.getToken(code);

    // Verify the ID token and pull out the user's Google profile
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Find or create the user in Mongo
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({ googleId, email, name, avatarUrl: picture || '' });
    }

    // Issue our own session token — this is what the app uses from now on,
    // not Google's tokens.
    const appToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Bounce the browser back into the Expo app, carrying the token.
    // APP_REDIRECT_URI must be the redirect URI expo-auth-session's
    // AuthSession.makeRedirectUri() produced on the app side.
    // In Expo Go during dev this looks like: exp://192.168.x.x:8081/--/auth
    // Set it in .env once you know your dev machine's LAN IP; it changes
    // per network, so you'll update this occasionally during development.
    const appRedirect = process.env.APP_REDIRECT_URI;

    if (!appRedirect) {
      // Fallback so you can at least confirm the exchange worked while wiring
      // up the frontend — shows the token instead of redirecting.
      return res.json({ warning: 'APP_REDIRECT_URI not set in .env', token: appToken, user });
    }

    return res.redirect(`${appRedirect}?token=${appToken}`);
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(500).send('Authentication failed');
  }
});

module.exports = router;