export async function fetchJson(url: string) {
  const res = await fetch(url);
  return res.json();
}

export function getProbableRashiFromName(name: string, rashis: any[]) {
  if (!name) return null;
  const cleanName = name.trim().toLowerCase();
  
  let bestMatch = null;
  let maxMatchLength = 0;

  for (const rashi of rashis) {
    for (const syllable of rashi.syllables) {
      const cleanSyllable = syllable.toLowerCase();
      if (cleanName.startsWith(cleanSyllable)) {
        if (cleanSyllable.length > maxMatchLength) {
          maxMatchLength = cleanSyllable.length;
          bestMatch = rashi;
        }
      }
    }
  }

  // Fallback if no exact match (very rare, but possible)
  return bestMatch || rashis[0]; 
}

export function generateConvergenceReport(
  nameRashi: any, 
  actualRashi: any | null, 
  mulankData: any, 
  bhagyankData: any, 
  namankData: any,
  planetsDb: any
) {
  const activeRashi = actualRashi || nameRashi;
  
  // Collect all ruling planets
  const influences = [
    { source: 'Rashi', planet: activeRashi.ruler, data: activeRashi },
    { source: 'Mulank', planet: mulankData.planet, data: mulankData },
    { source: 'Bhagyank', planet: bhagyankData.planet, data: bhagyankData },
    { source: 'Namank', planet: namankData.planet, data: namankData }
  ];

  // Tally planet frequencies
  const planetCounts: Record<string, number> = {};
  influences.forEach(inf => {
    planetCounts[inf.planet] = (planetCounts[inf.planet] || 0) + 1;
  });

  // Determine dominant planets (those appearing > 1 time, or just the top 2)
  const sortedPlanets = Object.entries(planetCounts).sort((a, b) => b[1] - a[1]);
  const dominantPlanets = sortedPlanets.slice(0, 2).map(p => p[0]);

  // Aggregate Themes
  const allThemes: string[] = [];
  influences.forEach(inf => {
    if (inf.data.themes) allThemes.push(...inf.data.themes);
    if (inf.data.theme) allThemes.push(inf.data.theme);
  });

  // Count theme frequencies
  const themeCounts: Record<string, number> = {};
  allThemes.forEach(t => {
    // simple normalization
    const norm = t.split(',')[0].trim(); 
    themeCounts[norm] = (themeCounts[norm] || 0) + 1;
  });

  const topThemes = Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(t => t[0]);

  // Calculate Alignment Scores (Interpretive)
  const calculateScore = (domainThemes: string[]) => {
    let score = 50; // base score
    domainThemes.forEach(dt => {
      if (allThemes.join(' ').toLowerCase().includes(dt.toLowerCase())) {
        score += 15;
      }
    });
    return Math.min(score, 98); // Max 98 for realism
  };

  const scores = {
    creativity: calculateScore(['art', 'creativity', 'beauty', 'expression', 'music']),
    communication: calculateScore(['communication', 'intellect', 'writing', 'networking']),
    leadership: calculateScore(['leadership', 'authority', 'power', 'action', 'courage']),
    business: calculateScore(['business', 'finance', 'wealth', 'organization']),
    spirituality: calculateScore(['spirituality', 'healing', 'research', 'intuition', 'mysticism'])
  };

  // Compile Colors and Days
  const colors = [...new Set([...activeRashi.colours, ...mulankData.auspicious_colours])];
  const days = [...new Set([...mulankData.favourable_days, ...bhagyankData.favourable_days])];

  // Generate Departments
  const departments = {
    psychological: {
      title: "Psychological & Behavioral Profile",
      strengths: activeRashi.traits.strengths,
      challenges: activeRashi.traits.challenges,
      cognitiveStyle: `Driven by ${activeRashi.element} element and ${activeRashi.nature} nature. Your Mulank (${mulankData.planet}) shapes your daily approach.`
    },
    career: {
      title: "Professional & Wealth Trajectory",
      domains: activeRashi.career.slice(0, 5),
      workplaceDynamics: `Influenced heavily by ${dominantPlanets.join(" and ")}, favoring environments centered around ${topThemes.slice(0,2).join(" and ")}.`
    },
    interpersonal: {
      title: "Interpersonal & Relationship Dynamics",
      communicationStyle: `Governed by the intersection of ${activeRashi.ruler} and ${namankData.planet}.`,
      socialSynergy: `You thrive in relationships that balance your ${activeRashi.element} nature.`
    },
    lifestyle: {
      title: "Lifestyle & Environment Optimization",
      colors: colors.slice(0, 4),
      days: days.slice(0, 3),
      direction: activeRashi.direction,
      gemstones: activeRashi.gemstones
    },
    karmic: {
      title: "Karmic & Evolutionary Blueprint",
      destinyPath: `Guided by your Bhagyank (${bhagyankData.planet}), your overarching life theme involves ${bhagyankData.theme}.`,
      spiritualInclinations: `Your Rashi connects you to themes of ${activeRashi.themes.slice(0, 3).join(", ")}.`
    }
  };

  return {
    dominantPlanets,
    topThemes,
    scores,
    influences,
    colors,
    days,
    departments
  };
}
