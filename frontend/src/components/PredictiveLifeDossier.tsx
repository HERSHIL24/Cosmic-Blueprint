"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Heart, Globe, Sparkles, CheckCircle2, Clock, ShieldCheck, DollarSign, Baby } from "lucide-react";

interface PredictionsProps {
  predictions?: {
    career?: {
      businessProbability: number;
      jobProbability: number;
      recommendation: string;
      milestones: {
        foundationAge: number;
        foundationText: string;
        peakGrowthAge: number;
        peakGrowthText: string;
        wellSettledAge: number;
        wellSettledText: string;
      };
    };
    wealth?: {
      potentialGrade: string;
      pattern: string;
      wealthAdvice: string;
    };
    marriage?: {
      loveProbability: number;
      arrangeProbability: number;
      relationshipNature: string;
      partnerStartingLetters: string[];
      idealPartnerQualities: string;
    };
    progeny?: {
      score: number;
      status: string;
      expectedCount: string;
      favorableTimingWindow: string;
      realities: {
        strengths: string;
        cautions: string;
        saptamsaInsight: string;
      };
    };
    abroad?: {
      probability: number;
      status: string;
      primaryPurpose: string;
      recommendedWindows: string[];
    };
    luckyAttributes?: {
      scentAura?: {
        primary: { name: string; notes: string; benefit: string };
        secondary: { name: string; notes: string; benefit: string };
        sprayTip: string;
      };
    };
  };
}

export function PredictiveLifeDossier({ predictions }: PredictionsProps) {
  // Graceful defaults if not yet generated
  const career = predictions?.career || {
    businessProbability: 75,
    jobProbability: 25,
    recommendation: "Dynamic High-Impact Entrepreneurship / Tech Venture Leadership",
    milestones: {
      foundationAge: 22,
      foundationText: "Around Age 22: Path crystallizes; personal purpose aligns and strategic foundation begins.",
      peakGrowthAge: 28,
      peakGrowthText: "Around Age 28: Major exponential surge; financial scalability and broad professional prominence.",
      wellSettledAge: 33,
      wellSettledText: "Around Age 33: Total sovereign authority; diversified assets, financial empire, and established standing."
    }
  };

  const wealth = predictions?.wealth || {
    potentialGrade: "A+ (Superior Asset Arc)",
    pattern: "Compound Wealth Engine with explosive multi-stream inflows during favorable transits.",
    wealthAdvice: "Focus on intellectual capital, scalable technology, and prime real estate holdings."
  };

  const marriage = predictions?.marriage || {
    loveProbability: 72,
    arrangeProbability: 28,
    relationshipNature: "High alignment toward Love Marriage / Self-Chosen life partner rooted in deep intellectual bonding.",
    partnerStartingLetters: ["A", "S", "D", "M", "R", "K", "V"],
    idealPartnerQualities: "Intellectually acute, intensely loyal, aesthetic-minded, and emotionally anchoring."
  };

  const progeny = predictions?.progeny || {
    score: 82,
    status: "Highly Favourable & Blessed (Saptamsa D7 Purva Punya Active)",
    expectedCount: "1 to 2 Children (High Intellectual & Creative Arc)",
    favorableTimingWindow: "Age 27 to Age 31 (Aligned with Benefic Jupiter/Venus sub-cycles)",
    realities: {
      strengths: "Children will possess sharp intellect, analytical depth, and creative aesthetic inclination matching your Venus-Ketu vibrations.",
      cautions: "Career prioritization and perfectionism may cause intentional delay in early twenties. Ideal child planning window is post age 27 when emotional and financial grounding is achieved.",
      saptamsaInsight: "Vedic Saptamsa (D7) reveals strong filial attachment and high respect earned through progeny's future achievements."
    }
  };

  const abroad = predictions?.abroad || {
    probability: 84,
    status: "Highly Favourable (Strong Foreign Horizon)",
    primaryPurpose: "Global Wealth Creation, International Trade & Strategic High-Yield Ventures",
    recommendedWindows: ["Age 24", "Age 27", "Age 31"]
  };

  const scentAura = predictions?.luckyAttributes?.scentAura || {
    primary: {
      name: "Venusian Velvet Rose & Sandalwood",
      notes: "Damask Rose, Italian Bergamot, White Oud & Creamy Sandalwood",
      benefit: "Harmonizes aura, amplifies natural magnetic charm, attracts luxury and executive respect"
    },
    sprayTip: "Apply on pulse points (wrists, collarbone) every morning before critical meetings to harmonize your electromagnetic aura."
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Career & Business Roadmap */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-serif text-white">Career Destiny: Job vs. Business Alignment</h4>
            <p className="text-xs text-slate-400">Computational assessment of leadership vs institutional employment</p>
          </div>
        </div>

        {/* Progress Comparison */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-amber-400">Business / Venture Leadership ({career.businessProbability}%)</span>
            <span className="text-blue-400">Structured Corporate Job ({career.jobProbability}%)</span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div style={{ width: `${career.businessProbability}%` }} className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full" />
            <div style={{ width: `${career.jobProbability}%` }} className="bg-gradient-to-r from-blue-600 to-blue-400 h-full" />
          </div>
          <div className="text-xs text-slate-300 italic pt-1">
            <strong>Verdict:</strong> {career.recommendation}
          </div>
        </div>

        {/* Age Milestones Timeline */}
        <div className="border-t border-slate-800/80 pt-5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Key Age Milestone Trajectory
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-amber-400 mb-1">MILESTONE 1</div>
              <div className="text-sm font-bold text-white mb-2">Age {career.milestones.foundationAge}: Foundation</div>
              <p className="text-xs text-slate-400 leading-relaxed">{career.milestones.foundationText}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 relative shadow-sm shadow-amber-500/10">
              <div className="text-xs font-mono font-bold text-amber-400 mb-1">MILESTONE 2 (PEAK)</div>
              <div className="text-sm font-bold text-white mb-2">Age {career.milestones.peakGrowthAge}: Golden Surge</div>
              <p className="text-xs text-slate-400 leading-relaxed">{career.milestones.peakGrowthText}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-1">MILESTONE 3 (SETTLED)</div>
              <div className="text-sm font-bold text-white mb-2">Age {career.milestones.wellSettledAge}: Sovereign Authority</div>
              <p className="text-xs text-slate-400 leading-relaxed">{career.milestones.wellSettledText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Wealth & Prosperity */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-serif text-white">Wealth Potential & Financial Manifestation</h4>
            <p className="text-xs text-slate-400">Capital accumulation arc and high-yield wealth sectors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Wealth Velocity Grade</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mb-2">{wealth.potentialGrade}</div>
            <p className="text-xs text-slate-300 leading-relaxed">{wealth.pattern}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Strategic Asset Allocation</div>
            <div className="text-xs text-slate-300 leading-relaxed mt-1">{wealth.wealthAdvice}</div>
          </div>
        </div>
      </div>

      {/* 3. Love & Marriage Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-serif text-white">Love & Marriage Dynamics</h4>
            <p className="text-xs text-slate-400">Soulmate vibrational resonance and ideal partner initial letters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-rose-400">Love Marriage / Self-Chosen ({marriage.loveProbability}%)</span>
              <span className="text-slate-400">Arranged Alignment ({marriage.arrangeProbability}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 mb-3">
              <div style={{ width: `${marriage.loveProbability}%` }} className="bg-gradient-to-r from-rose-500 to-pink-400 h-full" />
              <div style={{ width: `${marriage.arrangeProbability}%` }} className="bg-slate-700 h-full" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{marriage.relationshipNature}</p>
          </div>

          {/* Partner Starting Letters */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20">
            <div className="text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
              Best Compatible Partner Starting Letters
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {marriage.partnerStartingLetters.map((char) => (
                <span
                  key={char}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 italic">
              <strong>Partner Personality:</strong> {marriage.idealPartnerQualities}
            </div>
          </div>
        </div>
      </div>

      {/* Children & Progeny Matrix (5th House & Saptamsa D7) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl avoid-break">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Baby className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-serif text-white">Children & Progeny Matrix (Saptamsa D7)</h4>
            <p className="text-xs text-slate-400">Putra Bhava analysis, expected count, timing windows & realistic dynamics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Progeny Blessing Index</div>
            <div className="text-2xl font-bold text-purple-400 font-mono mb-1">{progeny.score}%</div>
            <div className="text-xs text-emerald-400 font-medium">{progeny.status}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated Progeny Arc</div>
            <div className="text-lg font-bold text-white mb-1">{progeny.expectedCount}</div>
            <div className="text-[11px] text-slate-400">Governed by Jupiter (Putrakaraka) & Venus</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Auspicious Planning Window</div>
            <div className="text-sm font-bold text-amber-300 mb-1">{progeny.favorableTimingWindow}</div>
            <div className="text-[11px] text-slate-400">Favorable planetary transit support</div>
          </div>
        </div>

        {/* Realistic Astrological Pros & Cons */}
        <div className="space-y-3 pt-3 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">Lineage Blessings: </span>
            <span className="text-slate-300">{progeny.realities.strengths}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
            <span className="text-amber-400 font-bold uppercase tracking-wider">Realistic Cautions & Delays: </span>
            <span className="text-slate-300">{progeny.realities.cautions}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
            <span className="font-bold uppercase tracking-wider text-purple-300">Saptamsa (D7) Insight: </span>
            <span>{progeny.realities.saptamsaInsight}</span>
          </div>
        </div>
      </div>

      {/* 4. Abroad / Foreign Travel Horizon */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl avoid-break">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-serif text-white">Abroad & International Horizon</h4>
            <p className="text-xs text-slate-400">Cross-border mobility, settlement probability & core motivation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Abroad Probability</div>
            <div className="text-2xl font-bold text-cyan-400 font-mono mb-1">{abroad.probability}%</div>
            <div className="text-xs text-emerald-400 font-medium">{abroad.status}</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 md:col-span-2">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Nature of Foreign Transit</div>
            <p className="text-xs text-slate-200 font-medium mb-3">{abroad.primaryPurpose}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-cyan-300">Prime Window Ages:</span>
              {abroad.recommendedWindows.map((win) => (
                <span key={win} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-[11px]">
                  {win}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Lucky Aura & Fragrance (Perfume Sprays) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-amber-950/40 border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold font-serif text-white">Sacred Aromatherapy & Lucky Aura Fragrance</h4>
            <p className="text-xs text-slate-400">Planetary scent notes designed to tune your electromagnetic field</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 mb-3">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            Recommended Signature Fragrance Blend
          </div>
          <div className="text-base font-bold text-white mb-1">{scentAura.primary.name}</div>
          <div className="text-xs text-slate-300 mb-2">
            <strong>Key Notes:</strong> {scentAura.primary.notes}
          </div>
          <p className="text-xs text-slate-400 italic mb-2">
            <strong>Metaphysical Benefit:</strong> {scentAura.primary.benefit}
          </p>
          <div className="text-[11px] text-amber-300/80 font-medium bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
            ✨ {scentAura.sprayTip}
          </div>
        </div>
      </div>
    </div>
  );
}
