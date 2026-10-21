"use client";

import { motion } from "framer-motion";
import { Sparkles, Hash, Award, Flame, Compass } from "lucide-react";

interface TriadItem {
  name: string;
  number: number;
  rawSum: number;
  letters?: { char: string; value: number }[];
  power?: {
    title: string;
    gujarati: string;
    hindi?: string;
    planet: string;
    vibration: string;
    careerHint: string;
  };
}

interface NamologyTriadProps {
  triad?: {
    firstName: TriadItem;
    lastName?: TriadItem | null;
    combined: TriadItem;
  };
  name: string;
}

const POWER_TABLE_FALLBACK: Record<number, any> = {
  1: { title: "Fame & Leadership", gujarati: "પ્રસિદ્ધિ, નેતૃત્વ", planet: "Sun (Surya)", vibration: "Initiator, Authority, High Visibility" },
  2: { title: "Diplomacy & Partnership", gujarati: "સહયોગ, કૂટનીતિ", planet: "Moon (Chandra)", vibration: "Empathic, Peacemaker, Harmony" },
  3: { title: "Lucky & Wisdom", gujarati: "જ્ઞાન - ભાગ્ય, સૌભાગ્ય, રચનાત્મકતા", planet: "Jupiter (Guru)", vibration: "Expansion, Divine Luck, Wisdom" },
  4: { title: "Innovation & Change", gujarati: "નવી સોચ ઔર ક્રાંતિ", planet: "Rahu", vibration: "Unconventional Genius, Revolution" },
  5: { title: "Influence & Communication", gujarati: "પ્રભાવશાળી વાતચીત, વ્યાપારી", planet: "Mercury (Budh)", vibration: "Commercial Intellect, Persuasive Speech" },
  6: { title: "Magnetism & Luxury", gujarati: "સુંદરતા, પ્રેમ, સમૃદ્ધ જીવન", planet: "Venus (Shukra)", vibration: "Irresistible Charm, Premium Lifestyle" },
  7: { title: "Mysticism & Intuition", gujarati: "રહસ્ય ઔર આધ્યાત્મિકતા", planet: "Ketu", vibration: "Esoteric Depth, Visionary Intuition" },
  8: { title: "Power & Wealth", gujarati: "શક્તિ ઔર સમૃદ્ધિ, સત્તા ઔર સફળતા", planet: "Saturn (Shani)", vibration: "Empire Builder, Karmic Resilience" },
  9: { title: "Passion & Victory", gujarati: "જોશ ઔર વિજય", planet: "Mars (Mangal)", vibration: "Supreme Energy, Courage, Triumph" }
};

export function NamologyTriadCard({ triad, name }: NamologyTriadProps) {
  // Safe fallbacks if backend calculation is still streaming
  const firstName = triad?.firstName || {
    name: name.split(" ")[0] || "Name",
    number: 6,
    rawSum: 24,
    power: POWER_TABLE_FALLBACK[6]
  };

  const lastName = triad?.lastName || {
    name: name.split(" ").slice(1).join(" ") || "Surname",
    number: 1,
    rawSum: 19,
    power: POWER_TABLE_FALLBACK[1]
  };

  const combined = triad?.combined || {
    name: name,
    number: 7,
    rawSum: 43,
    power: POWER_TABLE_FALLBACK[7]
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20 backdrop-blur-md">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Esoteric Chaldean Name Vibrations
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            The Threefold Namology Triad
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Decoding individual persona vibrations: First Name (Social Persona), Last Name (Ancestral Karma), and Combined Resonance (Destiny Manifestation).
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-center">
            <div className="text-[10px] text-slate-400 uppercase">Core Triad</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              {firstName.number} • {lastName ? lastName.number : "-"} • {combined.number}
            </div>
          </div>
        </div>
      </div>

      {/* Triad Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* First Name Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">1st Name Vibration</span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-lg">
                {firstName.number}
              </div>
            </div>

            <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-0.5">
              {firstName.name}
            </h4>
            <div className="text-xs font-serif text-amber-300 font-semibold mb-2">
              {firstName.power?.title || POWER_TABLE_FALLBACK[firstName.number]?.title}
            </div>

            {/* Gujarati / Hindi Script Badge */}
            <div className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20 mb-3">
              {firstName.power?.gujarati || POWER_TABLE_FALLBACK[firstName.number]?.gujarati}
            </div>

            {/* Letter addition flow */}
            {firstName.letters && (
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3 text-[11px] font-mono text-slate-300">
                <span className="text-slate-500">Breakdown: </span>
                {firstName.letters.map((l, idx) => (
                  <span key={idx}>
                    {l.char}({l.value}){idx < (firstName.letters?.length || 0) - 1 ? " + " : ""}
                  </span>
                ))}
                <span className="text-amber-400 font-bold"> = {firstName.rawSum} → {firstName.number}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {firstName.power?.vibration || POWER_TABLE_FALLBACK[firstName.number]?.vibration}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ruling Planet:</span>
            <span className="text-white font-semibold">{firstName.power?.planet || "Venus (Shukra)"}</span>
          </div>
        </motion.div>

        {/* Last Name Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Last Name Vibration</span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-lg">
                {lastName ? lastName.number : "-"}
              </div>
            </div>

            <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-0.5">
              {lastName ? lastName.name : "N/A"}
            </h4>
            <div className="text-xs font-serif text-blue-300 font-semibold mb-2">
              {lastName ? (lastName.power?.title || POWER_TABLE_FALLBACK[lastName.number]?.title) : "Heritage Lineage"}
            </div>

            {/* Gujarati / Hindi Script Badge */}
            {lastName && (
              <div className="inline-block px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 text-xs font-medium border border-blue-500/20 mb-3">
                {lastName.power?.gujarati || POWER_TABLE_FALLBACK[lastName.number]?.gujarati}
              </div>
            )}

            {/* Letter addition flow */}
            {lastName?.letters && (
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3 text-[11px] font-mono text-slate-300">
                <span className="text-slate-500">Breakdown: </span>
                {lastName.letters.map((l, idx) => (
                  <span key={idx}>
                    {l.char}({l.value}){idx < (lastName.letters?.length || 0) - 1 ? " + " : ""}
                  </span>
                ))}
                <span className="text-blue-400 font-bold"> = {lastName.rawSum} → {lastName.number}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {lastName ? (lastName.power?.vibration || POWER_TABLE_FALLBACK[lastName.number]?.vibration) : "Represents the family legacy and institutional standing."}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ancestral Carrier:</span>
            <span className="text-white font-semibold">{lastName ? (lastName.power?.planet || "Sun (Surya)") : "Sun (Surya)"}</span>
          </div>
        </motion.div>

        {/* Combined Full Name Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 hover:border-amber-400/60 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Total Manifested Vibration
              </span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-extrabold flex items-center justify-center text-lg shadow-md shadow-amber-500/20">
                {combined.number}
              </div>
            </div>

            <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-0.5">
              Full Composite Power
            </h4>
            <div className="text-xs font-serif text-amber-300 font-semibold mb-2">
              {combined.power?.title || POWER_TABLE_FALLBACK[combined.number]?.title}
            </div>

            {/* Gujarati / Hindi Script Badge */}
            <div className="inline-block px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-200 text-xs font-medium border border-amber-500/40 mb-3">
              {combined.power?.gujarati || POWER_TABLE_FALLBACK[combined.number]?.gujarati}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3 text-[11px] font-mono text-slate-300">
              <span className="text-slate-500">Synthesis: </span>
              {firstName.number} + {lastName ? lastName.number : 0} = <span className="text-amber-400 font-bold">{combined.number}</span>
              <span className="text-slate-500"> (Raw: {combined.rawSum})</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {combined.power?.vibration || POWER_TABLE_FALLBACK[combined.number]?.vibration}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Force:</span>
            <span className="text-amber-300 font-semibold">{combined.power?.planet || "Ketu"}</span>
          </div>
        </motion.div>
      </div>

      {/* Sacred Number Power Table — Displaying Exclusively Active Triad Numbers */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" /> Active Sacred Triad Vibrations (Your Blueprint)
          </h4>
          <span className="text-[11px] text-amber-400/80 font-mono">
            Filtered to Your Energy Keys: {Array.from(new Set([firstName.number, lastName?.number, combined.number].filter(Boolean))).join(", ")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(POWER_TABLE_FALLBACK)
            .filter(([num]) => {
              const n = Number(num);
              return n === firstName.number || (lastName && n === lastName.number) || n === combined.number;
            })
            .map(([num, data]) => {
              const isFirst = Number(num) === firstName.number;
              const isLast = lastName && Number(num) === lastName.number;
              const isCombined = Number(num) === combined.number;
              
              const roles = [];
              if (isFirst) roles.push("1st Name");
              if (isLast) roles.push("Last Name");
              if (isCombined) roles.push("Combined");

              return (
                <div
                  key={num}
                  className="p-4 rounded-xl border bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-slate-950 border-amber-500/40 text-white shadow-xl relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-amber-400 font-mono text-base">Number {num}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      {roles.join(" + ")}
                    </span>
                  </div>
                  <div className="font-bold text-slate-100 text-sm">{data.title}</div>
                  <div className="text-xs text-amber-300 font-medium mt-0.5">{data.gujarati}</div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{data.vibration}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
