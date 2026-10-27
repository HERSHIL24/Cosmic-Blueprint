"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Check, Sparkles, Moon, Sun, Compass, Shield } from "lucide-react";

interface Remedy {
  category: string;
  remedyType: string;
  prescription: string;
  timing: string;
  icon?: string;
}

interface RemediesProps {
  remedies?: Remedy[];
}

export function PracticalRemediesCard({ remedies }: RemediesProps) {
  if (!remedies || remedies.length === 0) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case "Moon": return <Moon className="w-5 h-5 text-blue-300" />;
      case "Sun": return <Sun className="w-5 h-5 text-amber-400" />;
      case "Compass": return <Compass className="w-5 h-5 text-emerald-400" />;
      case "Sparkles": return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return <Shield className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xl font-bold font-serif text-white">Modern Practical Remedies (Kalyug Upaye)</h4>
            <p className="text-xs text-slate-400">Action-oriented, habit-based remedies — Zero superstition, zero expensive gemstones</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          Result-Oriented Vedic Science
        </span>
      </div>

      {/* Comparison Badge: Traditional Superstition vs Modern Science */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-rose-400/80">
          <span className="font-bold">❌ Obsolete Approaches:</span> Expensive gems, complex 3 AM rituals, fear-based daan.
        </div>
        <div className="flex items-center gap-2 text-emerald-400">
          <span className="font-bold">✅ Scientific Vedic Approach:</span> Daily circadian discipline, spatial alignment & mental habits.
        </div>
      </div>

      {/* Grid of Actionable Remedies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {remedies.map((rem, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {renderIcon(rem.icon)}
                  </div>
                  <span className="text-xs font-bold text-white font-serif">{rem.category}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {rem.remedyType}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3 mt-2">
                {rem.prescription}
              </p>
            </div>

            <div className="text-[11px] font-mono text-amber-300/80 bg-slate-900/60 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span>Optimal Timing:</span>
              <span className="text-white font-medium">{rem.timing}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
