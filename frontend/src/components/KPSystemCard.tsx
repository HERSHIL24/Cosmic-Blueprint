"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, Target, Zap } from "lucide-react";

interface KPSystemProps {
  kpData?: {
    planetsKP?: Record<string, any>;
    cusps?: any[];
    eventTimingInsights?: Array<{
      domain: string;
      cusp: string;
      subLord: string;
      nature: string;
      timingClue: string;
    }>;
  };
}

export function KPSystemCard({ kpData }: KPSystemProps) {
  if (!kpData) return null;

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xl font-bold font-serif text-white">KP System — Sub-Lord Precision Engine</h4>
            <p className="text-xs text-slate-400">Krishnamurti Paddhati: 249 Sub-Lord subdivisions for pinpoint event timing (85% Accuracy)</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          KP Stellar Astrology
        </span>
      </div>

      {/* Core House Cusp Sub-Lords Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpData.eventTimingInsights?.map((insight, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{insight.cusp}</span>
                <span className="font-mono font-bold text-amber-400">Sub: {insight.subLord}</span>
              </div>
              <div className="text-sm font-bold text-white mb-2">{insight.domain}</div>
              <div className="text-xs text-emerald-400 font-medium mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                {insight.nature}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 italic">
              {insight.timingClue}
            </p>
          </div>
        ))}
      </div>

      {/* Planetary Stellar Coordinates Table */}
      {kpData.planetsKP && (
        <div className="pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Planetary Sign-Star-Sub Coordinates
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Object.entries(kpData.planetsKP).slice(0, 9).map(([pName, pVal]: any) => (
              <div key={pName} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex justify-between items-center font-bold text-white mb-1">
                  <span>{pName}</span>
                  <span className="text-amber-400 font-mono text-[11px]">{pVal.kp?.rashi}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex flex-col gap-0.5">
                  <div>Star: <span className="text-slate-200">{pVal.kp?.starLord}</span></div>
                  <div>Sub: <span className="text-amber-300 font-semibold">{pVal.kp?.subLord}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
