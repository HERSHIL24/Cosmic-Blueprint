"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RashiExplorerProps {
  rashis: any[];
  userRashiId?: number;
}

export function RashiExplorer({ rashis, userRashiId }: RashiExplorerProps) {
  const [activeRashi, setActiveRashi] = useState(rashis.find(r => r.id === userRashiId) || rashis[0]);
  
  // Mouse drag-to-scroll implementation
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5; // Drag sensitivity
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-card/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-border/50 shadow-2xl">
      
      {/* Interactive Drag & Wheel Scrollable Rashi List */}
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full md:w-1/3 space-y-2 max-h-[500px] overflow-y-auto pr-2 cosmic-scrollbar select-none transition-colors ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-2 px-2 flex items-center justify-between">
          <span>12 Vedic Rashis</span>
          <span className="text-[10px] text-primary/70">Scroll or Drag</span>
        </div>

        {rashis.map((rashi) => {
          const isUser = rashi.id === userRashiId;
          const isActive = rashi.id === activeRashi.id;
          return (
            <button
              key={rashi.id}
              onClick={() => setActiveRashi(rashi)}
              className={`
                w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300
                ${isActive ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02] font-semibold' : 'bg-background/40 hover:bg-background/70 text-foreground'}
                ${isUser && !isActive ? 'border border-primary/50' : 'border border-transparent'}
              `}
            >
              <div className="flex justify-between items-center">
                <span className="font-serif text-base">{rashi.rashi}</span>
                {isUser && (
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                    isActive ? "bg-black/20 text-white" : "bg-primary/20 text-primary"
                  }`}>
                    YOU
                  </span>
                )}
              </div>
              <div className={`text-xs uppercase tracking-wider ${isActive ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                {rashi.english}
              </div>
            </button>
          );
        })}
      </div>

      {/* Rashi Detail View */}
      <div className="w-full md:w-2/3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRashi.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="border-b border-border/50 pb-6">
              <h3 className="text-3xl sm:text-4xl font-serif text-primary font-bold">
                {activeRashi.rashi} <span className="text-xl sm:text-2xl text-muted-foreground font-normal">({activeRashi.english})</span>
              </h3>
              <p className="text-sm sm:text-base mt-2 font-light text-slate-300">
                Ruler: <span className="font-semibold text-primary">{activeRashi.ruler}</span> • Element: <span className="text-white">{activeRashi.element}</span> • Nature: <span className="text-white">{activeRashi.nature}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Naming Syllables (Akshar)</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeRashi.syllables.map((s: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-background/60 border border-border/40 rounded text-xs font-mono text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Nakshatras Span</h4>
                <div className="text-xs space-y-1 text-slate-300">
                  {activeRashi.nakshatras.map((n: string, i: number) => <div key={i}>• {n}</div>)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-background/40 border border-border/30">
                <h4 className="text-xs uppercase tracking-widest text-emerald-400 mb-2 font-bold">Core Strengths</h4>
                <ul className="list-disc list-inside text-xs space-y-1 text-slate-200">
                  {activeRashi.traits.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-background/40 border border-border/30">
                <h4 className="text-xs uppercase tracking-widest text-amber-400 mb-2 font-bold">Growth Challenges</h4>
                <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                  {activeRashi.traits.challenges.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Career & Trade Domains</h4>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 bg-background/30 p-3.5 rounded-xl border border-border/30">
                {activeRashi.career.join(", ")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-background/40 rounded-xl border border-border/30 text-center">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground font-semibold">Favourable Colours</div>
                <div className="text-xs text-white font-medium mt-0.5">{activeRashi.colours.join(", ")}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground font-semibold">Traditional Gem</div>
                <div className="text-xs text-amber-300 font-medium mt-0.5">{activeRashi.gemstone}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground font-semibold">Sacred Direction</div>
                <div className="text-xs text-white font-medium mt-0.5">{activeRashi.direction}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
