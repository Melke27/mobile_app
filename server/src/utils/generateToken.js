const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (userId) => {
  let secret = process.env.JWT_SECRET && process.env.JWT_SECRET.trim();
  if (!secret) {
    secret = crypto.randomBytes(48).toString('hex');
    process.env.JWT_SECRET = secret;
    process.env.JWT_SECRET_SOURCE = 'runtime-fallback';
    console.warn(
      'JWT_SECRET was missing during token generation. Runtime fallback secret was created.'
    );
  }

  return jwt.sign({ sub: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
