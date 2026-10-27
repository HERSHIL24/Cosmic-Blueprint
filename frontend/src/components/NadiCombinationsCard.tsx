"use client";

import { motion } from "framer-motion";
import { Sparkles, Award, Layers, CheckCircle2 } from "lucide-react";

interface NadiCombination {
  title: string;
  planets: string[];
  classicalSource: string;
  archetype: string;
  prediction: string;
  accuracyRating: string;
}

interface NadiProps {
  combinations?: NadiCombination[];
}

export function NadiCombinationsCard({ combinations }: NadiProps) {
  if (!combinations || combinations.length === 0) return null;

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xl font-bold font-serif text-white">Bhrigu Nandi Nadi — Planetary Alliances</h4>
            <p className="text-xs text-slate-400">Directional trine & conjunction rules for direct event manifestation (95% Accuracy)</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
          Nadi Siddhanta
        </span>
      </div>

      {/* Grid of Nadi Alliances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combinations.map((comb, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/20 relative flex flex-col justify-between hover:border-purple-500/40 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                  {comb.classicalSource}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {comb.accuracyRating} Empirical Match
                </span>
              </div>

              <div className="text-base font-bold text-white mb-1.5">{comb.title}</div>

              <div className="flex items-center gap-1.5 mb-3">
                {comb.planets.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs font-semibold">
                    {p}
                  </span>
                ))}
                <span className="text-xs text-slate-400 italic">→ {comb.archetype}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {comb.prediction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
