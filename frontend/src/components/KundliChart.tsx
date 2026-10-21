"use client";

import { motion } from "framer-motion";

interface Planet {
  name: string;
  degree: number;
  rashi: string;
  house?: number;
  retrograde?: boolean;
}

interface KundliChartProps {
  houses?: number[];
  planets: any;
  ascendant?: number;
  lagnaRashi?: string;
}

export function KundliChart({ houses, planets, ascendant, lagnaRashi = "Mesha" }: KundliChartProps) {
  // A standard North Indian Kundli is a square with diagonals.
  // House positions mapped to SVG regions.
  // Center top = House 1, Left top = House 2, Left bottom = House 3, etc.
  
  // Define coordinate centers for each house for drawing text (1-12)
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

  const planetArray = Array.isArray(planets) 
    ? planets 
    : Object.entries(planets || {}).map(([name, data]: any) => {
        const lagnaNum = rashiMap[lagnaRashi] || 1;
        const planetNum = rashiMap[data.rashi] || 1;
        const calculatedHouse = (planetNum - lagnaNum + 12) % 12 + 1;
        return { name, ...data, house: data.house || calculatedHouse };
      });

  const renderPlanetsInHouse = (houseNum: number) => {
    const housePlanets = planetArray.filter((p: any) => p.house === houseNum);
    return housePlanets.map((p: any) => p.name.substring(0, 2).toUpperCase()).join(", ");
  };

  return (
    <div className="w-full max-w-md mx-auto aspect-square relative p-4 bg-card/30 backdrop-blur-md rounded-xl border border-border/50">
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
          const lagnaNum = rashiMap[lagnaRashi] || 1;
          const houseRashiNumber = ((lagnaNum + index - 1) % 12) + 1;
          return (
            <g key={index} className="text-center">
              {/* Actual Vedic Rashi Number for this house (Lagna progression) */}
              <text x={pos.x} y={pos.y + 6} fontSize="4.5" fill="currentColor" className="text-amber-400/80 font-bold" textAnchor="middle">
                {houseRashiNumber}
              </text>
              {/* Planets positioned in this house */}
              <text x={pos.x} y={pos.y - 1} fontSize="5" fill="currentColor" className="text-primary font-extrabold" textAnchor="middle">
                {renderPlanetsInHouse(index + 1)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
