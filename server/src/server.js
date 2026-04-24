require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const ensureRuntimeConfig = () => {
  const hasJwtSecret = Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.trim());
  if (hasJwtSecret) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Missing JWT_SECRET in environment. Add JWT_SECRET in Render dashboard and redeploy.'
    );
  }

  process.env.JWT_SECRET = 'local-dev-insecure-jwt-secret';
  console.warn(
    'JWT_SECRET is missing. Using local development fallback secret. Set JWT_SECRET in server/.env.'
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
