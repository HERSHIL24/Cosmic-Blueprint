"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KundliChartProps {
  houses?: number[];
  planets: any;
  ascendant?: number;
  lagnaRashi?: string;
  divisionalCharts?: {
    D1?: any;
    D9?: any;
    D10?: any;
    D7?: any;
  };
}

export function KundliChart({ houses, planets, ascendant, lagnaRashi = "Mesha", divisionalCharts }: KundliChartProps) {
  const [selectedChart, setSelectedChart] = useState<"D1" | "D9" | "D10" | "D7">("D1");

  // Determine current chart data
  const currentChart = divisionalCharts?.[selectedChart];
  const activeLagnaRashi = currentChart?.lagnaRashi || lagnaRashi;
  const activePlanets = currentChart?.planets || planets;

  const houseCenters = [
    { x: 50, y: 25 },  // House 1
    { x: 25, y: 15 },  // House 2
    { x: 15, y: 25 },  // House 3
    { x: 25, y: 50 },  // House 4
    { x: 15, y: 75 },  // House 5
    { x: 25, y: 85 },  // House 6
    { x: 50, y: 75 },  // House 7
    { x: 75, y: 85 },  // House 8
    { x: 85, y: 75 },  // House 9
    { x: 75, y: 50 },  // House 10
    { x: 85, y: 25 },  // House 11
    { x: 75, y: 15 },  // House 12
  ];

  const rashiMap: Record<string, number> = {
    "Mesha": 1, "Vrishabha": 2, "Mithuna": 3, "Karka": 4, 
    "Simha": 5, "Kanya": 6, "Tula": 7, "Vrischika": 8, 
    "Dhanu": 9, "Makara": 10, "Kumbha": 11, "Meena": 12
  };

  const planetArray = Array.isArray(activePlanets) 
    ? activePlanets 
    : Object.entries(activePlanets || {}).map(([name, data]: any) => {
        const lagnaNum = rashiMap[activeLagnaRashi] || 1;
        const planetNum = rashiMap[data.rashi] || 1;
        const calculatedHouse = (planetNum - lagnaNum + 12) % 12 + 1;
        return { 
          name, 
          ...data, 
          house: data.house || calculatedHouse,
          isVargottama: data.isVargottama 
        };
      });

  const renderPlanetsInHouse = (houseNum: number) => {
    const housePlanets = planetArray.filter((p: any) => p.house === houseNum);
    return housePlanets.map((p: any) => {
      const code = p.name.substring(0, 2).toUpperCase();
      return p.isVargottama ? `${code}★` : code;
    }).join(", ");
  };

  const chartMeta = {
    D1: { title: "D1: Rashi (Lagna)", desc: "Physical constitution, life foundation, visible reality" },
    D9: { title: "D9: Navamsha", desc: "Soul purpose, marriage compatibility, destiny post-age 30" },
    D10: { title: "D10: Dashamsha", desc: "Executive power, career prominence, business status" },
    D7: { title: "D7: Saptamsha", desc: "Progeny, creative legacy, ancestral gifts" }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Divisional Chart Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-border/50 mb-4 overflow-x-auto max-w-full">
        {(["D1", "D9", "D10", "D7"] as const).map((chartKey) => (
          <button
            key={chartKey}
            onClick={() => setSelectedChart(chartKey)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedChart === chartKey
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {chartKey} {chartKey === "D1" ? "Rashi" : chartKey === "D9" ? "Navamsha" : chartKey === "D10" ? "Dashamsha" : "Saptamsha"}
          </button>
        ))}
      </div>

      {/* Purpose Banner */}
      <div className="text-center mb-3">
        <span className="text-xs font-bold text-amber-400">{chartMeta[selectedChart].title}:</span>{" "}
        <span className="text-xs text-slate-300">{chartMeta[selectedChart].desc}</span>
        {selectedChart === "D9" && (
          <div className="text-[11px] text-emerald-400 mt-1">★ indicates Vargottama planets (Same sign in D1 & D9 = High potency)</div>
        )}
      </div>

      {/* Vedic Diamond Chart SVG */}
      <div className="w-full max-w-md aspect-square relative p-4 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary/80" fill="none" strokeWidth="0.5">
          {/* Outer Square */}
          <rect x="5" y="5" width="90" height="90" />
          {/* Inner Diagonals */}
          <line x1="5" y1="5" x2="95" y2="95" />
          <line x1="95" y1="5" x2="5" y2="95" />
          {/* Inner Diamond */}
          <line x1="50" y1="5" x2="95" y2="50" />
          <line x1="95" y1="50" x2="50" y2="95" />
          <line x1="50" y1="95" x2="5" y2="50" />
          <line x1="5" y1="50" x2="50" y2="5" />

          {houseCenters.map((pos, index) => {
            const lagnaNum = rashiMap[activeLagnaRashi] || 1;
            const houseRashiNumber = ((lagnaNum + index - 1) % 12) + 1;
            return (
              <g key={index} className="text-center">
                {/* Actual Vedic Rashi Number for this house */}
                <text x={pos.x} y={pos.y + 6} fontSize="4.5" fill="currentColor" className="text-amber-400/80 font-bold" textAnchor="middle">
                  {houseRashiNumber}
                </text>
                {/* Planets positioned in this house */}
                <text x={pos.x} y={pos.y - 1} fontSize="4.8" fill="currentColor" className="text-primary font-extrabold" textAnchor="middle">
                  {renderPlanetsInHouse(index + 1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
