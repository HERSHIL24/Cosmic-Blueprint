const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const {
  dateToJulianDay, getPlanetaryPositions,
  getLagnaRashi, getNakshatra, generateHouseData,
  calculateYogasAndDoshas,
  generateDivisionalCharts,
  calculateKPSystem,
  calculateNadiCombinations,
  calculateRahuKetuKarmicAxis,
  generatePracticalKalyugRemedies
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

    const { yogas: deepYogas, doshas } = calculateYogasAndDoshas(planets, lagna.rashi);
    const allYogas = deepYogas || [];

    // Part 2 Real Engines:
    const divisionalCharts = generateDivisionalCharts(planets, lagna);
    const kpSystem = calculateKPSystem(planets, lagna.longitude);
    const nadiCombinations = calculateNadiCombinations(planets);
    const karmicAxis = calculateRahuKetuKarmicAxis(planets, lagna.rashi);
    const practicalRemedies = generatePracticalKalyugRemedies(planets, lagna.rashi, allYogas, doshas);

    const result = {
      dob, time: birthTime, lat: latitude, lon: longitude,
      lagnaRashi: lagna.rashi,
      lagnaLongitude: lagna.longitude,
      moonRashi: planets.Moon.rashi,
      moonNakshatra: moonNakshatra.name,
      nakshatraRuler: moonNakshatra.ruler,
      planets,
      houses,
      yogas: allYogas,
      doshas,
      divisionalCharts,
      kpSystem,
      nadiCombinations,
      karmicAxis,
      practicalRemedies,
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
