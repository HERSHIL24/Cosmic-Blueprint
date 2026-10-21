"use client";

import { motion } from "framer-motion";
import { fetchNumberData } from "@/lib/api";
import { useEffect, useState } from "react";

export function NumerologyReport({ number, type }: { number: number, type: 'Mulank' | 'Bhagyank' }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchNumberData(number).then(setData);
  }, [number]);

  if (!data) return <div className="h-64 animate-pulse bg-muted rounded-xl" />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-border/50 text-left"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="text-6xl font-serif text-primary">{number}</div>
        <div>
          <h3 className="text-xl font-bold uppercase tracking-wider text-foreground">{type} Insights</h3>
          <p className="text-primary/80 font-medium">Ruled by {data.planet}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Theme</h4>
          <p className="text-lg font-light leading-relaxed">{data.theme}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Strengths</h4>
            <ul className="list-disc list-inside text-sm font-light text-foreground/80 space-y-1">
              {data.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Challenges</h4>
            <ul className="list-disc list-inside text-sm font-light text-foreground/80 space-y-1">
              {data.challenges.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Career & Business</h4>
          <div className="flex flex-wrap gap-2">
            {data.career.map((c: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-background/50 p-4 rounded-xl border border-border/30">
          <div>
            <div className="text-xs text-muted-foreground uppercase">Colors</div>
            <div className="text-sm">{data.auspicious_colours.join(", ")}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase">Gemstone</div>
            <div className="text-sm">{data.gemstone}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase">Direction</div>
            <div className="text-sm">{data.direction}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase">Days</div>
            <div className="text-sm">{data.favourable_days.join(", ")}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase">Deity</div>
            <div className="text-sm font-medium text-primary">{data.deity}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase">Rashi(s)</div>
            <div className="text-sm">{data.rashis.join(", ")}</div>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Mantra</h4>
          <p className="text-sm font-serif italic text-primary/80 bg-primary/5 p-3 rounded-lg border border-primary/10">
            {data.mantra}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
