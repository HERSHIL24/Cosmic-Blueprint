/**
 * Namology Engine — Name Analysis & Correction
 * Combines phonetic syllable matching with vibrational analysis
 */

const { calculateChaldeanValue, calculatePythagoreanValue, reduceToSingleDigit } = require('./numerologyEngine');

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

function getNameVibration(name) {
  const chaldean = calculateChaldeanValue(name);
  const pythagorean = calculatePythagoreanValue(name);
  const rashi = getRashiFromName(name);

  // Find ruling planet for the chaldean number
  const rulingPlanet = Object.entries(PLANET_VIBRATIONS).find(([, data]) => data.number === chaldean)?.[0] || 'Mercury';
  const vibData = PLANET_VIBRATIONS[rulingPlanet];

  return {
    chaldeanNumber: chaldean,
    pythagoreanNumber: pythagorean,
    probableRashi: rashi,
    rulingPlanet,
    favourableDay: vibData?.day,
    favourableColour: vibData?.colour,
    suggestedGemstone: vibData?.gemstone,
    mantra: vibData?.mantra
  };
}

function getNameCorrection(name, targetNumber) {
  // Suggest appending a letter to shift the chaldean total toward targetNumber
  const current = calculateChaldeanValue(name);
  if (current === targetNumber) {
    return { suggestion: 'Name is already vibrating at the target number.', currentNumber: current };
  }

  const CHALDEAN_MAP = {
    A:1, I:1, J:1, Q:1, Y:1, B:2, K:2, R:2, C:3, G:3, L:3, S:3,
    D:4, M:4, T:4, E:5, H:5, N:5, X:5, U:6, V:6, W:6, O:7, Z:7, F:8, P:8
  };

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

module.exports = { getRashiFromName, getNameVibration, getNameCorrection, RASHIS_DATA, PLANET_VIBRATIONS };
