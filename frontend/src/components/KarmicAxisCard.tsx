"use client";

import { motion } from "framer-motion";
import { Compass, RotateCw, Flag, Lightbulb } from "lucide-react";

interface KarmicAxisProps {
  axisData?: {
    rahuHouse: number;
    ketuHouse: number;
    axisName: string;
    title: string;
    ketuLesson: string;
    rahuMission: string;
    growthKey: string;
  };
}

export function KarmicAxisCard({ axisData }: KarmicAxisProps) {
  if (!axisData) return null;

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xl font-bold font-serif text-white">Rahu & Ketu — 12 Karmic Axis Blueprint</h4>
            <p className="text-xs text-slate-400">Past-Life Mastery (Ketu) vs. Present-Life Soul Evolution Frontier (Rahu)</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          {axisData.axisName}
        </span>
      </div>

      <div className="text-base font-bold text-white mb-2 font-serif">{axisData.title}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ketu (Past Life Comfort Zone) */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-slate-500 inline-block" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ketu in House {axisData.ketuHouse} (Innate Mastery / Release Zone)
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {axisData.ketuLesson}
          </p>
        </div>

        {/* Rahu (Current Life Hunger & Growth) */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 relative shadow-sm shadow-cyan-500/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Rahu in House {axisData.rahuHouse} (Soul Mandate / Growth Vector)
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {axisData.rahuMission}
          </p>
        </div>
      </div>

      {/* Actionable Golden Growth Key */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-300">Karmic Breakthrough Key:</strong> {axisData.growthKey}
        </div>
      </div>
    </div>
  );
}
