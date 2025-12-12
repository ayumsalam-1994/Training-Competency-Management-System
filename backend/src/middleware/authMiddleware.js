const jwt = require('jsonwebtoken');

function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin role check (requires authGuard to be called first)
function adminOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user role is Admin (case-insensitive)
  if (req.user.role && req.user.role.toLowerCase() === 'admin') {
    return next();
  }

  return res.status(403).json({ error: 'Admin access required' });
}

module.exports = { authGuard, adminOnly };
