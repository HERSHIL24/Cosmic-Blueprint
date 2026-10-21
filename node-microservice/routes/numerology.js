const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const {
  calculateMulank, calculateBhagyank, calculateNamank,
  getLoShuGrid, getPersonalYear, calculateKuaNumber,
  generateLifePredictions
} = require('../engines/numerologyEngine');
const { getNameVibration } = require('../engines/namologyEngine');

const NUMBER_INTERPRETATIONS = {
  1: { planet:'Sun', themes:['Leadership','Independence','Originality'], strengths:['Confident','Decisive','Creative'], challenges:['Ego','Domineering'], career:['Entrepreneurship','Politics','Management'], colours:['Gold','Orange'], days:['Sunday'], gemstone:'Ruby', mantra:'Om Suryaya Namah', deity:'Surya (Sun God)' },
  2: { planet:'Moon', themes:['Intuition','Cooperation','Sensitivity'], strengths:['Empathetic','Diplomatic','Artistic'], challenges:['Over-sensitive','Indecisive'], career:['Counselling','Arts','HR'], colours:['White','Silver'], days:['Monday'], gemstone:'Pearl', mantra:'Om Chandraya Namah', deity:'Chandra (Moon God)' },
  3: { planet:'Jupiter', themes:['Creativity','Communication','Optimism'], strengths:['Expressive','Generous','Wise'], challenges:['Scattered','Overindulgent'], career:['Teaching','Law','Writing'], colours:['Yellow','Gold'], days:['Thursday'], gemstone:'Yellow Sapphire', mantra:'Om Gurave Namah', deity:'Brihaspati (Jupiter)' },
  4: { planet:'Rahu', themes:['Stability','Order','Discipline'], strengths:['Practical','Hardworking','Reliable'], challenges:['Rigid','Resistant to change'], career:['Engineering','Architecture','Finance'], colours:['Blue','Grey'], days:['Saturday'], gemstone:'Hessonite Garnet', mantra:'Om Rahave Namah', deity:'Rahu' },
  5: { planet:'Mercury', themes:['Freedom','Adventure','Versatility'], strengths:['Quick thinking','Communicative','Adaptable'], challenges:['Restless','Impulsive'], career:['Business','Travel','Media'], colours:['Green','Light yellow'], days:['Wednesday'], gemstone:'Emerald', mantra:'Om Budhaya Namah', deity:'Budha (Mercury)' },
  6: { planet:'Venus', themes:['Love','Beauty','Harmony'], strengths:['Caring','Creative','Diplomatic'], challenges:['People-pleasing','Indulgent'], career:['Fashion','Hospitality','Counselling'], colours:['Pink','Ivory'], days:['Friday'], gemstone:'Diamond', mantra:'Om Shukraya Namah', deity:'Shukra (Venus)' },
  7: { planet:'Ketu', themes:['Spirituality','Analysis','Wisdom'], strengths:['Intuitive','Philosophical','Research-oriented'], challenges:['Reclusive','Over-analytical'], career:['Research','Spirituality','Psychology'], colours:['Violet','Grey'], days:['Monday'], gemstone:"Cat's Eye", mantra:'Om Ketave Namah', deity:'Ketu' },
  8: { planet:'Saturn', themes:['Power','Achievement','Karma'], strengths:['Disciplined','Strategic','Authoritative'], challenges:['Materialistic','Ruthless'], career:['Business','Law','Finance'], colours:['Dark blue','Black'], days:['Saturday'], gemstone:'Blue Sapphire', mantra:'Om Shanicharaya Namah', deity:'Shani (Saturn)' },
  9: { planet:'Mars', themes:['Courage','Humanitarianism','Completion'], strengths:['Brave','Determined','Compassionate'], challenges:['Aggressive','Impatient'], career:['Military','Surgery','Sports'], colours:['Red','Crimson'], days:['Tuesday'], gemstone:'Red Coral', mantra:'Om Mangalaya Namah', deity:'Mangala (Mars)' }
};

// POST /api/numerology/calculate
router.post('/calculate', async (req, res, next) => {
  try {
    const { name, dob, userId, gender } = req.body;
    if (!name || !dob) return res.status(400).json({ error: 'name and dob are required' });

    const mulank = calculateMulank(dob);
    const bhagyank = calculateBhagyank(dob);
    const namank = calculateNamank(name);
    const loShuGrid = getLoShuGrid(dob);
    const personalYear = getPersonalYear(dob);

    const parts = dob.replace(/\//g, '-').split('-');
    const birthYear = parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
    const kuaNumber = calculateKuaNumber(birthYear, gender || 'M');

    // Deep predictive life matrix & name triad vibrations
    const predictions = generateLifePredictions({ mulank, bhagyank, namank, dob });
    const nameVibration = getNameVibration(name);

    const result = {
      name, dob,
      mulank, bhagyank, namank, personalYear, kuaNumber,
      mulankInfo: NUMBER_INTERPRETATIONS[mulank],
      bhagyankInfo: NUMBER_INTERPRETATIONS[bhagyank],
      namankInfo: NUMBER_INTERPRETATIONS[namank],
      loShuGrid,
      predictions,
      nameTriad: nameVibration.triad,
      compatibility: {
        bestNumbers: [mulank % 9 + 1, bhagyank % 9 + 1],
        neutralNumbers: [namank],
        note: 'Traditional compatibility based on ruling planet relationships'
      }
    };

    if (userId) {
      await Report.create({ userId, reportType: 'numerology', inputData: { name, dob }, result });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/numerology/history/:userId
router.get('/history/:userId', async (req, res, next) => {
  try {
    const reports = await Report.find({ userId: req.params.userId, reportType: 'numerology' })
      .sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: reports });
  } catch (err) { next(err); }
});

// GET /api/numerology/number/:num
router.get('/number/:num', (req, res) => {
  const num = parseInt(req.params.num);
  if (num < 1 || num > 9) return res.status(400).json({ error: 'Number must be between 1 and 9' });
  res.json({ success: true, data: { number: num, ...NUMBER_INTERPRETATIONS[num] } });
});

module.exports = router;
