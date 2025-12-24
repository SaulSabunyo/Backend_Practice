const jwt = require('jsonwebtoken');

function ensureAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error('ensureAuth error:', err.message || err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { ensureAuth };