/**
 * Numerology Calculation Engine
 * Implements Chaldean + Pythagorean systems + Predictive Life Matrix
 */

// Chaldean numerology chart (no 9 assigned to any letter)
const CHALDEAN_MAP = {
  A:1, I:1, J:1, Q:1, Y:1,
  B:2, K:2, R:2,
  C:3, G:3, L:3, S:3,
  D:4, M:4, T:4,
  E:5, H:5, N:5, X:5,
  U:6, V:6, W:6,
  O:7, Z:7,
  F:8, P:8
};

// Pythagorean map for name number
const PYTHAGOREAN_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

function reduceToSingleDigit(n) {
  while (n > 9) {
    n = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0);
  }
  return n;
}

function calculateChaldeanValue(name) {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
  let total = 0;
  for (const ch of cleaned) {
    total += CHALDEAN_MAP[ch] || 0;
  }
  return reduceToSingleDigit(total);
}

function calculatePythagoreanValue(name) {
  const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
  let total = 0;
  for (const ch of cleaned) {
    total += PYTHAGOREAN_MAP[ch] || 0;
  }
  return reduceToSingleDigit(total);
}

/**
 * Mulank = Root/Radical Number = sum of day digits
 * e.g. 24 → 2+4 = 6
 */
function calculateMulank(dob) {
  // Handles DD-MM-YYYY or YYYY-MM-DD
  const parts = dob.replace(/\//g, '-').split('-');
  let day;
  if (parts[0].length === 4) {
    day = parseInt(parts[2]); // YYYY-MM-DD
  } else {
    day = parseInt(parts[0]); // DD-MM-YYYY
  }
  return reduceToSingleDigit(day);
}

/**
 * Bhagyank = Destiny Number = sum of ALL digits of full DOB
 */
function calculateBhagyank(dob) {
  const digits = dob.replace(/[^0-9]/g, '');
  const total = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
  return reduceToSingleDigit(total);
}

/**
 * Namank = Name Number (Chaldean)
 */
function calculateNamank(name) {
  return calculateChaldeanValue(name);
}

/**
 * Kua Number (Feng Shui / Chinese numerology)
 */
function calculateKuaNumber(dobYear, gender = 'M') {
  const yearDigits = String(dobYear).split('').reduce((a, d) => a + parseInt(d), 0);
  const yearReduced = reduceToSingleDigit(yearDigits);
  if (gender === 'M') {
    return reduceToSingleDigit(10 - yearReduced);
  } else {
    return reduceToSingleDigit(yearReduced + 5);
  }
}

/**
 * Lo Shu Grid: count occurrences of digits 1-9 in DOB
 */
function getLoShuGrid(dob) {
  const digits = dob.replace(/[^0-9]/g, '');
  const counts = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0 };
  for (const d of digits) {
    const n = parseInt(d);
    if (n >= 1 && n <= 9) counts[n]++;
  }
  return {
    grid: [
      [counts[4], counts[9], counts[2]],
      [counts[3], counts[5], counts[7]],
      [counts[8], counts[1], counts[6]]
    ],
    counts,
    missingNumbers: Object.entries(counts).filter(([,v]) => v === 0).map(([k]) => parseInt(k)),
    repeatingNumbers: Object.entries(counts).filter(([,v]) => v > 1).map(([k,v]) => ({ digit: parseInt(k), count: v }))
  };
}

/**
 * Personal Year Number
 */
function getPersonalYear(dob) {
  const currentYear = new Date().getFullYear();
  const parts = dob.replace(/\//g, '-').split('-');
  const day = parts[0].length === 4 ? parseInt(parts[2]) : parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const total = day + month + currentYear;
  return reduceToSingleDigit(total);
}

/**
 * Deep Predictive Life Matrix:
 * Computes Career (Job vs Business), Age milestones, Wealth, Marriage, Abroad, and Lucky Scents
 */
function generateLifePredictions({ mulank, bhagyank, namank, dob }) {
  // 1. Career: Job vs Business Score
  // Business friendly numbers: 1, 3, 5, 8, 9
  // Creative / Specialized leadership: 6, 7, 2, 4
  const bizNumbers = [1, 3, 5, 8, 9];
  let bizScore = 55;
  if (bizNumbers.includes(mulank)) bizScore += 15;
  if (bizNumbers.includes(bhagyank)) bizScore += 15;
  if (bizNumbers.includes(namank)) bizScore += 10;
  bizScore = Math.min(Math.max(bizScore, 35), 88);
  const jobScore = 100 - bizScore;

  // 2. Timeline & Age Milestones
  const foundationAge = 21 + (mulank % 3);
  const peakGrowthAge = 27 + (bhagyank % 3);
  const wellSettledAge = 32 + (namank % 3);

  // 3. Marriage Dynamics (Love vs Arrange)
  // Venus (6), Rahu (4), Moon (2), Mercury (5) promote Love/Self-Chosen
  let loveScore = 50;
  if ([6, 5, 2, 4].includes(mulank)) loveScore += 18;
  if ([6, 5, 7].includes(namank)) loveScore += 14;
  loveScore = Math.min(Math.max(loveScore, 40), 85);
  const arrangeScore = 100 - loveScore;

  // Best Partner Starting Letters (Harmonizing with Namank & Mulank)
  const letterPool = {
    1: ['A', 'I', 'J', 'S', 'D', 'M'],
    2: ['B', 'K', 'R', 'P', 'T', 'G'],
    3: ['C', 'G', 'L', 'S', 'U', 'N'],
    4: ['D', 'M', 'T', 'A', 'H', 'K'],
    5: ['E', 'H', 'N', 'X', 'B', 'R'],
    6: ['U', 'V', 'W', 'A', 'M', 'S', 'P', 'R'],
    7: ['O', 'Z', 'K', 'V', 'L', 'N', 'D'],
    8: ['F', 'P', 'C', 'G', 'S', 'T'],
    9: ['A', 'B', 'M', 'R', 'K', 'Y']
  };
  const partnerLetters = Array.from(new Set([
    ...(letterPool[namank] || ['A', 'M', 'S']),
    ...(letterPool[mulank] || ['R', 'K', 'P'])
  ])).slice(0, 7);

  // 4. Abroad / Foreign Travel Chances
  // Ketu (7), Rahu (4), Mercury (5), Moon (2) promote high foreign travel
  let abroadProb = 60;
  if ([7, 5, 4, 2].includes(namank) || [7, 5, 4, 2].includes(mulank)) abroadProb += 25;
  abroadProb = Math.min(abroadProb, 92);

  const abroadReason = (bizScore > 65)
    ? "High-Yield Global Wealth & International Commercial Expansion (Making Money & Assets)"
    : "Strategic Work & Specialized Advanced Professional Relocation";

  // 5. Aromatherapy / Lucky Fragrance (Perfume Sprays)
  const fragranceMap = {
    1: { name: "Imperial Solar Amber", notes: "Bergamot, Saffron, Golden Amber", benefit: "Boosts public charisma, leadership respect, and executive focus" },
    2: { name: "Lunar White Pearl", notes: "White Lily, Lotus, Subtle Musk", benefit: "Soothes emotions, amplifies sharp psychic intuition" },
    3: { name: "Jupiterian Golden Spice", notes: "Cinnamon, Nutmeg, Warm Sandalwood", benefit: "Attracts financial luck, academic mastery, and mentor blessings" },
    4: { name: "Electric Vetiver", notes: "Smoky Vetiver, Cedarwood, Green Sage", benefit: "Grounds sudden anxiety, protects against erratic Rahu energy" },
    5: { name: "Mercury Crisp Citrus", notes: "Italian Mint, Grapefruit, Cardamom", benefit: "Sparks lightning-fast communication, sales genius, and deal closing" },
    6: { name: "Venusian Velvet Rose", notes: "Damask Rose, French Vanilla, White Musk", benefit: "Enhances personal magnetism, luxury attraction, and romantic bonding" },
    7: { name: "Mystic Sandalwood & Oud", notes: "Pure Mysore Sandalwood, Frankincense, Light Oud", benefit: "Awakens deep visionary intuition, shields personal aura, sharpens intellect" },
    8: { name: "Saturnian Deep Woods", notes: "Dark Patchouli, Black Pepper, Aged Oakmoss", benefit: "Builds immense mental resilience, attracts solid long-term wealth" },
    9: { name: "Mars Radiant Cinnamon", notes: "Red Ginger, Clove, Siberian Pine", benefit: "Ignites unstoppable vitality, courage, and competitive victory" }
  };

  const primaryFragrance = fragranceMap[namank] || fragranceMap[6];
  const secondaryFragrance = fragranceMap[mulank] || fragranceMap[1];

  return {
    career: {
      businessProbability: bizScore,
      jobProbability: jobScore,
      recommendation: bizScore >= 60 
        ? "Dynamic Entrepreneurship / Hybrid Independent Venture with High Strategic Autonomy"
        : "Corporate Leadership / High-Skill Global Consultancy",
      milestones: {
        foundationAge,
        foundationText: `Around Age ${foundationAge}: Core direction solidifies; initial learning curve turns into distinct professional clarity.`,
        peakGrowthAge,
        peakGrowthText: `Around Age ${peakGrowthAge}: Major growth surge; significant financial upgrade and public recognition.`,
        wellSettledAge,
        wellSettledText: `Around Age ${wellSettledAge}: Fully established power phase; robust wealth assets, stable reputation, and complete independence.`
      }
    },
    wealth: {
      potentialGrade: "A+ (High Accumulation Arc)",
      pattern: "Compound Wealth Engine with explosive surge periods during friendly planetary cycles",
      wealthAdvice: "Invest in high-tech systems, premium brand intellectual property, and prime real estate."
    },
    marriage: {
      loveProbability: loveScore,
      arrangeProbability: arrangeScore,
      relationshipNature: loveScore >= 60
        ? "High inclination toward Love Marriage or self-chosen soulmate partnership with intellectual harmony."
        : "Traditional family-supported alliance with strong shared mutual values and status alignment.",
      partnerStartingLetters: partnerLetters,
      idealPartnerQualities: "Intellectually curious, aesthetic-minded, fiercely loyal, and emotionally grounding."
    },
    progeny: {
      score: ([3, 6, 2, 1].includes(mulank) || [3, 6, 2, 1].includes(bhagyank)) ? 82 : 68,
      status: ([3, 6, 2, 1].includes(mulank) || [3, 6, 2, 1].includes(bhagyank)) 
        ? "Highly Favourable & Blessed (Saptamsa D7 Purva Punya Active)"
        : "Moderate / Delayed Timing (Requires Strategic Planning)",
      expectedCount: "1 to 2 Children (High Intellectual & Creative Arc)",
      favorableTimingWindow: `Age ${foundationAge + 5} to Age ${foundationAge + 9} (Aligned with Benefic Dasha Periods)`,
      realities: {
        strengths: "Children will possess sharp intellect, analytical depth, and creative aesthetic inclination matching your Venus-Ketu vibrations.",
        cautions: ([7, 4, 8].includes(namank) || [7, 4, 8].includes(mulank))
          ? "Career prioritization and perfectionism may cause intentional delay in early twenties. Ideal child planning window is post age 27 when emotional and financial grounding is achieved. Medical/fertility vitals remain favorable."
          : "Smooth and natural progeny blessings. Healthy family expansion indicated post-marriage without chronic obstacles.",
        saptamsaInsight: "Vedic Saptamsa (D7) reveals strong filial attachment and high respect earned through progeny's future achievements."
      }
    },
    abroad: {
      probability: abroadProb,
      status: abroadProb >= 70 ? "Highly Favourable (Strong Foreign Horizon)" : "Moderate / Domestic Peak with Global Travel",
      primaryPurpose: abroadReason,
      recommendedWindows: [`Age ${foundationAge + 2}`, `Age ${peakGrowthAge - 1}`, `Age ${peakGrowthAge + 3}`]
    },
    luckyAttributes: {
      scentAura: {
        primary: primaryFragrance,
        secondary: secondaryFragrance,
        sprayTip: "Apply on pulse points (wrists, collarbone) every morning before critical meetings to harmonize your electromagnetic aura."
      }
    }
  };
}

module.exports = {
  calculateMulank,
  calculateBhagyank,
  calculateNamank,
  calculateChaldeanValue,
  calculatePythagoreanValue,
  getLoShuGrid,
  getPersonalYear,
  calculateKuaNumber,
  reduceToSingleDigit,
  generateLifePredictions
};
