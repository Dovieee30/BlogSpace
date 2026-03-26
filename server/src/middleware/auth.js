'use strict';

const jwt = require('jsonwebtoken');

/**
 * Auth middleware — verifies the JWT sent in the Authorization header.
 * Attaches the decoded payload to req.user on success.
 *
 * Expected header format:  Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      data: null,
      error: 'Authorization header missing or malformed. Expected: Bearer <token>',
      status: 401,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({
      data: null,
      error: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
      status: 401,
    });
  }
}

module.exports = authMiddleware;
