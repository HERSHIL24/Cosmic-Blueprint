const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const {
  dateToJulianDay, getPlanetaryPositions,
  getLagnaRashi, getNakshatra, generateHouseData
} = require('../engines/astrologyEngine');

// POST /api/astrology/chart
router.post('/chart', async (req, res, next) => {
  try {
    const { dob, time, lat, lon, userId } = req.body;
    if (!dob) return res.status(400).json({ error: 'dob is required' });

    const latitude = parseFloat(lat) || 28.6139;
    const longitude = parseFloat(lon) || 77.2090;
    const birthTime = time || '12:00';

    const jd = dateToJulianDay(dob, birthTime);
    const planets = getPlanetaryPositions(jd);
    const lagna = getLagnaRashi(jd, latitude, longitude);
    const moonNakshatra = getNakshatra(planets.Moon.longitude);
    const houses = generateHouseData(lagna.longitude);

    // Identify key yogas (simplified)
    const yogas = [];
    if (planets.Jupiter.rashi === lagna.rashi) yogas.push({ name: 'Hamsa Yoga', description: 'Jupiter in Lagna — wisdom and spiritual grace' });
    if (planets.Sun.rashi === 'Mesha') yogas.push({ name: 'Uchcha Surya', description: 'Exalted Sun — strong leadership and vitality' });
    if (planets.Moon.rashi === 'Vrishabha') yogas.push({ name: 'Uchcha Chandra', description: 'Exalted Moon — emotional strength and prosperity' });

    const result = {
      dob, time: birthTime, lat: latitude, lon: longitude,
      lagnaRashi: lagna.rashi,
      lagnaLongitude: lagna.longitude,
      moonRashi: planets.Moon.rashi,
      moonNakshatra: moonNakshatra.name,
      nakshatraRuler: moonNakshatra.ruler,
      planets,
      houses,
      yogas,
      summary: {
        lagna: `Your Lagna (Ascendant) is ${lagna.rashi}, giving you a ${lagna.rashi}-natured personality and physical constitution.`,
        moonSign: `Moon in ${planets.Moon.rashi} in the ${moonNakshatra.name} Nakshatra shapes your emotional world and intuitive mind.`,
        sunSign: `Sun in ${planets.Sun.rashi} represents your core soul purpose and conscious identity.`
      }
    };

    if (userId) {
      await Report.create({ userId, reportType: 'astrology', inputData: { dob, time, lat, lon }, result });
    }

    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

// GET /api/astrology/history/:userId
router.get('/history/:userId', async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.params.userId, reportType: 'astrology' })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

module.exports = router;
