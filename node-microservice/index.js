require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cosmic_reports';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/numerology', require('./routes/numerology'));
app.use('/api/astrology', require('./routes/astrology'));
app.use('/api/namology', require('./routes/namology'));
app.use('/api/kundli', require('./routes/kundli'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cosmic-node-engine', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    service: 'node-engine'
  });
});

// Connect to MongoDB & start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('[MongoDB] Connected successfully');
    app.listen(PORT, () => {
      console.log(`[Server] Node.js Astrology Engine running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
