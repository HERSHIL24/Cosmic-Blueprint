"use client";

import { motion } from "framer-motion";

interface CosmicScoreboardProps {
  scores: Record<string, number>;
}

export function CosmicScoreboard({ scores }: CosmicScoreboardProps) {
  return (
    <div className="bg-card/30 backdrop-blur-md p-8 rounded-2xl border border-border/50">
      <div className="text-center mb-8">
        <h3 className="font-serif text-3xl text-primary">Interpretive Alignment Score</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Traditional Symbolic Profile (Not a scientifically measured score)
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(scores).map(([domain, score], index) => (
          <div key={domain}>
            <div className="flex justify-between items-center mb-2">
              <span className="uppercase text-xs tracking-widest text-foreground font-medium">
                {domain} Alignment
              </span>
              <span className="text-primary font-bold">{score}%</span>
            </div>
            <div className="w-full h-2 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
