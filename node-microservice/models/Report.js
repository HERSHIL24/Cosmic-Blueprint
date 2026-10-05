const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  reportType: {
    type: String,
    enum: ['numerology', 'astrology', 'kundli', 'namology'],
    required: true
  },
  inputData: { type: mongoose.Schema.Types.Mixed },
  result: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
