const jwt = require('jsonwebtoken');

// Protects any route it's attached to. Expects: Authorization: Bearer <access jwt>
// Sets req.user = { userId, email } (unchanged, so plantroutes.js keeps working).
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, email: payload.email };
    next();
  } catch (err) {
    // 401 on every failure (including expiry) so a client knows to refresh.
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
