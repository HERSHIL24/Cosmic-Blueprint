const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { getRashiFromName, getNameVibration, getNameCorrection } = require('../engines/namologyEngine');

// POST /api/namology/analyze
router.post('/analyze', async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });

    const rashi = getRashiFromName(name);
    const vibration = getNameVibration(name);

    const result = {
      name,
      probableRashi: rashi,
      vibration,
      nameAnalysis: {
        totalLetters: name.replace(/\s/g,'').length,
        vowelCount: (name.match(/[aeiouAEIOU]/g) || []).length,
        consonantCount: (name.replace(/[^a-zA-Z]/g,'').match(/[^aeiouAEIOU]/gi) || []).length,
        startsWithSyllable: name.slice(0, 3).toLowerCase()
      },
      recommendations: {
        strongNumbers: [vibration.chaldeanNumber, (vibration.chaldeanNumber % 9) + 1],
        note: 'Traditional namology analysis for cultural and reflective purposes only.'
      }
    };

    if (userId) {
      await Report.create({ userId, reportType: 'namology', inputData: { name }, result });
    }

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// POST /api/namology/correct
router.post('/correct', (req, res, next) => {
  try {
    const { name, targetNumber } = req.body;
    if (!name || !targetNumber) return res.status(400).json({ error: 'name and targetNumber are required' });
    const correction = getNameCorrection(name, parseInt(targetNumber));
    res.json({ success: true, data: correction });
  } catch (err) { next(err); }
});

// GET /api/namology/history/:userId
router.get('/history/:userId', async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.params.userId, reportType: 'namology' })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

module.exports = router;
