'use strict';

const jwt = require('jsonwebtoken');

/**
 * Verify JWT from Authorization header.
 * Returns { user } on success or { error, status } on failure.
 */
function verifyAuth(req) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: 'Authorization header missing or malformed. Expected: Bearer <token>',
      status: 401,
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return {
      error: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
      status: 401,
    };
  }
}

module.exports = { verifyAuth };
