"use client";

import { motion } from "framer-motion";

interface ConvergenceMapProps {
  rashi: string;
  mulank: number;
  bhagyank: number;
  namank: number;
  dominantPlanets: string[];
}

export function ConvergenceMap({ rashi, mulank, bhagyank, namank, dominantPlanets }: ConvergenceMapProps) {
  // Hexagonal layout: radius = 35 from center (50,50)
  const nodes = [
    { id: 'user', label: 'YOU', x: 50, y: 50, main: true },
    { id: 'planet-0', label: dominantPlanets[0] || 'Sun', x: 50, y: 15 },
    { id: 'mulank', label: `Mulank: ${mulank}`, x: 80, y: 32 },
    { id: 'namank', label: `Namank: ${namank}`, x: 80, y: 68 },
    { id: 'planet-1', label: dominantPlanets[1] || 'Moon', x: 50, y: 85 },
    { id: 'bhagyank', label: `Bhagyank: ${bhagyank}`, x: 20, y: 68 },
    { id: 'rashi', label: `Rashi: ${rashi}`, x: 20, y: 32 },
  ];

  return (
    <div className="w-full aspect-[16/10] max-w-4xl mx-auto relative bg-slate-950/40 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Background Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-[30%] h-[30%] sm:w-64 sm:h-64 border border-primary/40 rounded-full" />
        <div className="absolute w-[45%] h-[45%] sm:w-96 sm:h-96 border border-primary/20 rounded-full" />
        <div className="absolute w-[60%] h-[60%] sm:w-[500px] sm:h-[500px] border border-primary/10 rounded-full" />
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map(node => (
          node.id !== 'user' && (
            <motion.line
              key={`line-${node.id}`}
              x1="50" y1="50"
              x2={node.x} y2={node.y}
              stroke="currentColor"
              className="text-primary/60"
              strokeWidth="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          )
        ))}
      </svg>

      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 + 1 }}
          className={`absolute flex items-center justify-center text-center p-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 
            ${node.main 
              ? 'bg-primary text-slate-900 font-bold shadow-[0_0_40px_rgba(200,150,50,0.6)] w-20 h-20 sm:w-24 sm:h-24 z-10 text-lg' 
              : 'bg-slate-950/80 text-slate-200 border border-primary/40 text-xs sm:text-sm w-20 h-20 sm:w-28 sm:h-28 hover:bg-primary/10 transition-colors backdrop-blur-md'
            }
          `}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.label}
        </motion.div>
      ))}
    </div>
  );
}
