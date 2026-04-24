require('dotenv').config();
const crypto = require('crypto');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const ensureRuntimeConfig = () => {
  const hasJwtSecret = Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.trim());
  if (hasJwtSecret) {
    process.env.JWT_SECRET_SOURCE = 'configured';
    return;
  }

  const runtimeSecret = crypto.randomBytes(48).toString('hex');
  process.env.JWT_SECRET = runtimeSecret;
  process.env.JWT_SECRET_SOURCE = 'runtime-fallback';

  console.warn(
    'JWT_SECRET is missing. Generated runtime fallback secret so server can start. ' +
      'Set JWT_SECRET in environment for persistent auth across restarts.'
  );
};

const bootstrap = async () => {
  ensureRuntimeConfig();
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
