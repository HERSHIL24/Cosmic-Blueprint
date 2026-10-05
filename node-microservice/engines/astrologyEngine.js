/**
 * Vedic Astrology Calculation Engine
 * Uses simplified ephemeris lookup tables for demo/educational purposes.
 * For production, integrate with Swiss Ephemeris or astro.com API.
 */

const RASHIS = [
  'Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya',
  'Tula','Vrischika','Dhanu','Makara','Kumbha','Meena'
];

const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', rashi: 'Mesha', startDeg: 0 },
  { name: 'Bharani', ruler: 'Venus', rashi: 'Mesha', startDeg: 13.33 },
  { name: 'Krittika', ruler: 'Sun', rashi: 'Mesha', startDeg: 26.67 },
  { name: 'Rohini', ruler: 'Moon', rashi: 'Vrishabha', startDeg: 40 },
  { name: 'Mrigashira', ruler: 'Mars', rashi: 'Vrishabha', startDeg: 53.33 },
  { name: 'Ardra', ruler: 'Rahu', rashi: 'Mithuna', startDeg: 66.67 },
  { name: 'Punarvasu', ruler: 'Jupiter', rashi: 'Mithuna', startDeg: 80 },
  { name: 'Pushya', ruler: 'Saturn', rashi: 'Karka', startDeg: 93.33 },
  { name: 'Ashlesha', ruler: 'Mercury', rashi: 'Karka', startDeg: 106.67 },
  { name: 'Magha', ruler: 'Ketu', rashi: 'Simha', startDeg: 120 },
  { name: 'Purva Phalguni', ruler: 'Venus', rashi: 'Simha', startDeg: 133.33 },
  { name: 'Uttara Phalguni', ruler: 'Sun', rashi: 'Simha', startDeg: 146.67 },
  { name: 'Hasta', ruler: 'Moon', rashi: 'Kanya', startDeg: 160 },
  { name: 'Chitra', ruler: 'Mars', rashi: 'Kanya', startDeg: 173.33 },
  { name: 'Swati', ruler: 'Rahu', rashi: 'Tula', startDeg: 186.67 },
  { name: 'Vishakha', ruler: 'Jupiter', rashi: 'Tula', startDeg: 200 },
  { name: 'Anuradha', ruler: 'Saturn', rashi: 'Vrischika', startDeg: 213.33 },
  { name: 'Jyeshtha', ruler: 'Mercury', rashi: 'Vrischika', startDeg: 226.67 },
  { name: 'Mula', ruler: 'Ketu', rashi: 'Dhanu', startDeg: 240 },
  { name: 'Purva Ashadha', ruler: 'Venus', rashi: 'Dhanu', startDeg: 253.33 },
  { name: 'Uttara Ashadha', ruler: 'Sun', rashi: 'Dhanu', startDeg: 266.67 },
  { name: 'Shravana', ruler: 'Moon', rashi: 'Makara', startDeg: 280 },
  { name: 'Dhanishtha', ruler: 'Mars', rashi: 'Makara', startDeg: 293.33 },
  { name: 'Shatabhisha', ruler: 'Rahu', rashi: 'Kumbha', startDeg: 306.67 },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', rashi: 'Kumbha', startDeg: 320 },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', rashi: 'Meena', startDeg: 333.33 },
  { name: 'Revati', ruler: 'Mercury', rashi: 'Meena', startDeg: 346.67 }
];

/**
 * Convert DOB string to Julian Day Number (simplified)
 */
function dateToJulianDay(dob, time = '12:00') {
  const parts = dob.replace(/\//g, '-').split('-');
  const [timeParts] = [time.split(':')];
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  const hour = parseInt(timeParts[0] || 12);
  const min = parseInt(timeParts[1] || 0);

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  jdn += (hour - 12) / 24 + min / 1440;
  return jdn;
}

/**
 * Get tropical longitude for a planet (simplified lookup-based approach)
 * For educational/demo purposes. In production use Swiss Ephemeris.
 */
function getPlanetLongitude(jd, planet) {
  // Base: J2000.0 = JD 2451545.0
  const T = (jd - 2451545.0) / 36525;
  const base = {
    Sun:    (280.46646 + 36000.76983 * T) % 360,
    Moon:   (218.3165 + 481267.8813 * T) % 360,
    Mars:   (355.433 + 19140.2993 * T) % 360,
    Mercury:(252.251 + 149472.6746 * T) % 360,
    Jupiter:(34.351 + 3034.9057 * T) % 360,
    Venus:  (181.979 + 58517.8156 * T) % 360,
    Saturn: (50.077 + 1222.1138 * T) % 360,
    Rahu:   (125.04 - 1934.136 * T) % 360,
    Ketu:   0  // always opposite to Rahu
  };

  // Apply Vedic Ayanamsha (Lahiri ~23.85 degrees for J2000)
  const ayanamsha = 23.85 + (0.014 * T);

  let lon = ((base[planet] || 0) - ayanamsha) % 360;
  if (lon < 0) lon += 360;
  if (planet === 'Ketu') lon = (base['Rahu'] - ayanamsha + 180) % 360;
  return lon;
}

function longitudeToRashi(longitude) {
  const index = Math.floor(longitude / 30) % 12;
  return RASHIS[index];
}

function getNakshatra(moonLongitude) {
  const nakshatraIndex = Math.floor(moonLongitude / 13.333) % 27;
  return NAKSHATRAS[nakshatraIndex];
}

function getPlanetaryPositions(jd) {
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  const positions = {};
  for (const planet of planets) {
    const lon = getPlanetLongitude(jd, planet);
    positions[planet] = {
      longitude: parseFloat(lon.toFixed(2)),
      rashi: longitudeToRashi(lon),
      degree: parseFloat((lon % 30).toFixed(2))
    };
  }
  return positions;
}

function getLagnaRashi(jd, lat, lon) {
  // Simplified lagna calculation — for production use full house calculation
  const sunLon = getPlanetLongitude(jd, 'Sun');
  const timeFactor = (jd % 1) * 24; // hour of day
  const lagnaLon = (sunLon + (timeFactor * 15) + (lon)) % 360;
  return {
    rashi: longitudeToRashi(lagnaLon),
    longitude: parseFloat(lagnaLon.toFixed(2)),
    degree: parseFloat((lagnaLon % 30).toFixed(2))
  };
}

function generateHouseData(ascendantLongitude) {
  const houses = [];
  for (let i = 0; i < 12; i++) {
    const houseLon = (ascendantLongitude + i * 30) % 360;
    houses.push({
      house: i + 1,
      rashi: longitudeToRashi(houseLon),
      longitude: parseFloat(houseLon.toFixed(2))
    });
  }
  return houses;
}

module.exports = {
  dateToJulianDay,
  getPlanetaryPositions,
  getLagnaRashi,
  getNakshatra,
  generateHouseData,
  longitudeToRashi,
  RASHIS,
  NAKSHATRAS
};
