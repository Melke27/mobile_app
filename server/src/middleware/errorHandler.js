const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = { notFoundHandler, errorHandler };
