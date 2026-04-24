const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();
const parsedRateLimit = Number(process.env.RATE_LIMIT_MAX);
const defaultRateLimit = process.env.NODE_ENV === 'production' ? 500 : 5000;
const requestLimit = Number.isFinite(parsedRateLimit) && parsedRateLimit > 0 ? parsedRateLimit : defaultRateLimit;
const rateLimitEnabled = process.env.RATE_LIMIT_ENABLED !== 'false';

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

if (rateLimitEnabled) {
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: requestLimit,
      standardHeaders: true,
      legacyHeaders: false,
      skip: (req) => req.path === '/health',
    })
  );
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'campus-lost-found-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
