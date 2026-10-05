/**
 * Numerology Calculation Engine
 * Implements Chaldean + Pythagorean systems
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
 * e.g. 25 → 2+5 = 7
 */
function calculateMulank(dob) {
  // Expects DD-MM-YYYY or DD/MM/YYYY
  const parts = dob.replace(/\//g, '-').split('-');
  const day = parseInt(parts[0]);
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
 * Based on birth year and gender
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
  // Lo Shu layout: 4,9,2 / 3,5,7 / 8,1,6
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
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const total = day + month + currentYear;
  return reduceToSingleDigit(total);
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
  reduceToSingleDigit
};
