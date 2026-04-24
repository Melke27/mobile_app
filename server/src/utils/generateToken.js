const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET && process.env.JWT_SECRET.trim();
  if (!secret) {
    const error = new Error(
      'Server auth is not configured (JWT_SECRET missing). Contact admin to set JWT_SECRET.'
    );
    error.status = 500;
    throw error;
  }

  return jwt.sign({ sub: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
