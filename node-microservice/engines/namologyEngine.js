/**
 * Namology Engine — Name Analysis & Correction
 * Combines phonetic syllable matching with vibrational analysis & Triad Energy
 */

const { calculateChaldeanValue, calculatePythagoreanValue, reduceToSingleDigit } = require('./numerologyEngine');

// 1-9 Number Power Table (Matching traditional esoteric vibration & notes)
const NUMBER_POWER_TABLE = {
  1: {
    number: 1,
    title: "Fame & Leadership",
    gujarati: "પ્રસિદ્ધિ, નેતૃત્વ",
    hindi: "ख्याति और नेतृत्व",
    planet: "Sun (Surya)",
    vibration: "Initiator, Commanding Authority, Pioneer, High Visibility",
    careerHint: "Government, Founder, Executive Leadership, Big Brand Ambassador"
  },
  2: {
    number: 2,
    title: "Diplomacy & Partnership",
    gujarati: "સહયોગ, કૂટનીતિ",
    hindi: "सहयोग और कूटनीति",
    planet: "Moon (Chandra)",
    vibration: "Empathic, Peacemaker, Intuitive Harmony, Relational Strength",
    careerHint: "Public Relations, Creative Arts, Diplomacy, Advisory"
  },
  3: {
    number: 3,
    title: "Lucky & Wisdom",
    gujarati: "જ્ઞાન - ભાગ્ય, સૌભાગ્ય, રચનાત્મકતા",
    hindi: "ज्ञान, सौभाग्य और रचनात्मकता",
    planet: "Jupiter (Guru)",
    vibration: "Philosophical Expansion, Divine Luck, Mentorship, High Intelligence",
    careerHint: "Advisory, Fintech, Education, Spiritual & Legal Counsel"
  },
  4: {
    number: 4,
    title: "Innovation & Change",
    gujarati: "નવી સોચ ઔર ક્રાંતિ",
    hindi: "नई सोच और क्रांति",
    planet: "Rahu",
    vibration: "Unconventional Genius, Disruption, Structural Architect, System Builder",
    careerHint: "Tech Disruptors, Artificial Intelligence, Complex Engineering, Research"
  },
  5: {
    number: 5,
    title: "Influence & Communication",
    gujarati: "પ્રભાવશાળી વાતચીત, વ્યાપારી",
    hindi: "प्रभावशाली संचार और व्यापारिक बुद्धि",
    planet: "Mercury (Budh)",
    vibration: "Commercial Wizardry, Persuasive Speech, Versatility, High Speed",
    careerHint: "Global Trade, Marketing, Media, Venture Capital, Tech Startups"
  },
  6: {
    number: 6,
    title: "Magnetism & Luxury",
    gujarati: "સુંદરતા, પ્રેમ, સમૃદ્ધ જીવન",
    hindi: "आकर्षण, प्रेम और समृद्ध जीवन",
    planet: "Venus (Shukra)",
    vibration: "Irresistible Charm, Premium Lifestyle, Aesthetic Elegance, Emotional Wealth",
    careerHint: "Luxury Brands, Media & Design, High-End Hospitality, Creative Tech"
  },
  7: {
    number: 7,
    title: "Mysticism & Intuition",
    gujarati: "રહસ્ય ઔર આધ્યાત્મિકતા",
    hindi: "रहस्य और गहन आध्यात्मिकता",
    planet: "Ketu",
    vibration: "Esoteric Depth, Visionary Intuition, Deep Analytical Mind, Research Mastery",
    careerHint: "Deep Tech, Data Science, Strategy Consulting, Psychology, Occult/Vedic Sciences"
  },
  8: {
    number: 8,
    title: "Power & Wealth",
    gujarati: "શક્તિ ઔર સમૃદ્ધિ, સત્તા ઔર સફળતા",
    hindi: "शक्ति, अटूट समृद्धि और सत्ता",
    planet: "Saturn (Shani)",
    vibration: "Empire Builder, Karmic Resilience, Material Supremacy, Long-term Dominance",
    careerHint: "Heavy Industries, Real Estate, Investment Banking, High Political Office"
  },
  9: {
    number: 9,
    title: "Passion & Victory",
    gujarati: "જોશ ઔર વિજય",
    hindi: "जोश, शौर्य और विजय",
    planet: "Mars (Mangal)",
    vibration: "Fearless Fighter, Humanitarian Warrior, Supreme Energy, Triumph",
    careerHint: "Defense, High-Performance Athletics, Transformational Politics, Surge Operations"
  }
};

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

// Full traditional Rashi syllable data
const RASHIS_DATA = [
  { id:1, rashi:'Mesha', english:'Aries', ruler:'Mars', element:'Fire',
    syllables:['chu','che','cho','la','li','lu','le','lo','a','ch'],
    themes:['Leadership','Courage','Action','Initiative'] },
  { id:2, rashi:'Vrishabha', english:'Taurus', ruler:'Venus', element:'Earth',
    syllables:['ee','u','e','o','va','vi','vu','ve','vo'],
    themes:['Stability','Luxury','Beauty','Patience'] },
  { id:3, rashi:'Mithuna', english:'Gemini', ruler:'Mercury', element:'Air',
    syllables:['ka','ki','ku','gha','ng','chha','ke','ko','ha'],
    themes:['Communication','Intelligence','Adaptability'] },
  { id:4, rashi:'Karka', english:'Cancer', ruler:'Moon', element:'Water',
    syllables:['hi','hu','he','ho','da','di','du','de','do'],
    themes:['Emotion','Nurturing','Family','Intuition'] },
  { id:5, rashi:'Simha', english:'Leo', ruler:'Sun', element:'Fire',
    syllables:['ma','mi','mu','me','mo','ta','ti','tu','te'],
    themes:['Leadership','Recognition','Creativity'] },
  { id:6, rashi:'Kanya', english:'Virgo', ruler:'Mercury', element:'Earth',
    syllables:['to','pa','pi','pu','sha','na','tha','pe','po'],
    themes:['Analysis','Precision','Service','Logic'] },
  { id:7, rashi:'Tula', english:'Libra', ruler:'Venus', element:'Air',
    syllables:['ra','ri','ru','re','ro'],
    themes:['Balance','Relationships','Diplomacy'] },
  { id:8, rashi:'Vrischika', english:'Scorpio', ruler:'Mars', element:'Water',
    syllables:['na','ni','nu','ne','no','ya','yi','yu'],
    themes:['Transformation','Intensity','Research'] },
  { id:9, rashi:'Dhanu', english:'Sagittarius', ruler:'Jupiter', element:'Fire',
    syllables:['ye','yo','bha','bhi','bhu','dha','pha','bhe'],
    themes:['Wisdom','Expansion','Philosophy'] },
  { id:10, rashi:'Makara', english:'Capricorn', ruler:'Saturn', element:'Earth',
    syllables:['bho','ja','ji','khi','khu','khe','kho','ga','gi'],
    themes:['Discipline','Responsibility','Authority'] },
  { id:11, rashi:'Kumbha', english:'Aquarius', ruler:'Saturn', element:'Air',
    syllables:['gu','ge','go','sa','si','su','se','so'],
    themes:['Innovation','Humanity','Technology'] },
  { id:12, rashi:'Meena', english:'Pisces', ruler:'Jupiter', element:'Water',
    syllables:['di','du','tha','jha','de','do','cha','chi'],
    themes:['Spirituality','Compassion','Imagination'] }
];

const PLANET_VIBRATIONS = {
  Sun: { number: 1, day: 'Sunday', colour: 'Gold', gemstone: 'Ruby', mantra: 'Om Suryaya Namah' },
  Moon: { number: 2, day: 'Monday', colour: 'White/Silver', gemstone: 'Pearl', mantra: 'Om Chandraya Namah' },
  Jupiter: { number: 3, day: 'Thursday', colour: 'Yellow', gemstone: 'Yellow Sapphire', mantra: 'Om Brihaspataye Namah' },
  Rahu: { number: 4, day: 'Saturday', colour: 'Dark Blue', gemstone: 'Hessonite', mantra: 'Om Rahave Namah' },
  Mercury: { number: 5, day: 'Wednesday', colour: 'Green', gemstone: 'Emerald', mantra: 'Om Budhaya Namah' },
  Venus: { number: 6, day: 'Friday', colour: 'Pink/White', gemstone: 'Diamond', mantra: 'Om Shukraya Namah' },
  Ketu: { number: 7, day: 'Tuesday', colour: 'Grey', gemstone: "Cat's Eye", mantra: 'Om Ketave Namah' },
  Saturn: { number: 8, day: 'Saturday', colour: 'Dark Blue/Black', gemstone: 'Blue Sapphire', mantra: 'Om Shanicharaya Namah' },
  Mars: { number: 9, day: 'Tuesday', colour: 'Red', gemstone: 'Red Coral', mantra: 'Om Mangalaya Namah' }
};

function getRashiFromName(name) {
  if (!name) return null;
  const cleanName = name.trim().toLowerCase();
  let bestMatch = null;
  let maxMatchLength = 0;

  for (const rashi of RASHIS_DATA) {
    for (const syllable of rashi.syllables) {
      if (cleanName.startsWith(syllable) && syllable.length > maxMatchLength) {
        maxMatchLength = syllable.length;
        bestMatch = rashi;
      }
    }
  }
  return bestMatch || RASHIS_DATA[0];
}

function calculateWordVibration(word) {
  const clean = word.toUpperCase().replace(/[^A-Z]/g, '');
  let letters = [];
  let total = 0;

  for (const ch of clean) {
    const val = CHALDEAN_MAP[ch] || 0;
    letters.push({ char: ch, value: val });
    total += val;
  }

  const singleDigit = reduceToSingleDigit(total);
  return {
    word,
    clean,
    letters,
    rawSum: total,
    singleDigit,
    power: NUMBER_POWER_TABLE[singleDigit] || NUMBER_POWER_TABLE[1]
  };
}

function getNameVibration(name) {
  const rawParts = name.trim().split(/\s+/).filter(Boolean);
  const firstNamePart = rawParts[0] || '';
  const lastNamePart = rawParts.slice(1).join(' ') || '';

  const firstNameAnalysis = calculateWordVibration(firstNamePart);
  const lastNameAnalysis = lastNamePart ? calculateWordVibration(lastNamePart) : null;

  // Combined full name
  const combinedRawSum = (firstNameAnalysis.rawSum || 0) + (lastNameAnalysis ? lastNameAnalysis.rawSum : 0);
  const combinedSingleDigit = reduceToSingleDigit(combinedRawSum || calculateChaldeanValue(name));
  const combinedPower = NUMBER_POWER_TABLE[combinedSingleDigit] || NUMBER_POWER_TABLE[1];

  const pythagorean = calculatePythagoreanValue(name);
  const rashi = getRashiFromName(name);

  // Ruling planet based on combined Chaldean vibration
  const rulingPlanet = Object.entries(PLANET_VIBRATIONS).find(([, data]) => data.number === combinedSingleDigit)?.[0] || 'Mercury';
  const vibData = PLANET_VIBRATIONS[rulingPlanet];

  return {
    chaldeanNumber: combinedSingleDigit,
    pythagoreanNumber: pythagorean,
    probableRashi: rashi,
    rulingPlanet,
    favourableDay: vibData?.day,
    favourableColour: vibData?.colour,
    suggestedGemstone: vibData?.gemstone,
    mantra: vibData?.mantra,
    
    // Detailed Namology Triad (First Name + Last Name + Combined)
    triad: {
      firstName: {
        name: firstNamePart,
        number: firstNameAnalysis.singleDigit,
        rawSum: firstNameAnalysis.rawSum,
        letters: firstNameAnalysis.letters,
        power: firstNameAnalysis.power
      },
      lastName: lastNameAnalysis ? {
        name: lastNamePart,
        number: lastNameAnalysis.singleDigit,
        rawSum: lastNameAnalysis.rawSum,
        letters: lastNameAnalysis.letters,
        power: lastNameAnalysis.power
      } : null,
      combined: {
        fullName: name,
        number: combinedSingleDigit,
        rawSum: combinedRawSum,
        power: combinedPower
      }
    }
  };
}

function getNameCorrection(name, targetNumber) {
  const current = calculateChaldeanValue(name);
  if (current === targetNumber) {
    return { suggestion: 'Name is already vibrating at the target number.', currentNumber: current };
  }

  const suggestions = [];
  for (const [letter, value] of Object.entries(CHALDEAN_MAP)) {
    const newName = name + letter.toLowerCase();
    const newNum = calculateChaldeanValue(newName);
    if (newNum === targetNumber) {
      suggestions.push({ addLetter: letter, newName, newNumber: newNum });
    }
  }

  return {
    currentNumber: current,
    targetNumber,
    suggestions: suggestions.slice(0, 5),
    note: 'Consult a traditional numerologist before making any name changes.'
  };
}

module.exports = {
  getRashiFromName,
  getNameVibration,
  getNameCorrection,
  RASHIS_DATA,
  PLANET_VIBRATIONS,
  NUMBER_POWER_TABLE,
  calculateWordVibration
};
