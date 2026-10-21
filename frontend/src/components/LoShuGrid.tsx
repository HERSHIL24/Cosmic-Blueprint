"use client";

import { motion } from "framer-motion";

interface LoShuGridProps {
  counts: Record<string, number>;
}

export function LoShuGrid({ counts }: LoShuGridProps) {
  // Standard Lo Shu grid arrangement
  const gridPositions = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-6">
        <h3 className="font-serif text-3xl text-primary">Lo Shu Grid</h3>
        <p className="text-muted-foreground text-sm">Your numerological energy map</p>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50">
        {gridPositions.map((row, rowIndex) =>
          row.map((num, colIndex) => {
            const count = counts[num.toString()] || 0;
            const displayValue = count > 0 ? num.toString().repeat(count) : "";
            
            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (rowIndex * 3 + colIndex) * 0.1 }}
                className={`
                  aspect-square flex items-center justify-center text-2xl font-serif rounded-xl
                  transition-all duration-300
                  ${count > 0 
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
                    : "bg-background/20 text-muted-foreground/30 border border-border/20"}
                `}
              >
                {displayValue || num}
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        Bright numbers are present in your chart. Faded numbers are missing, indicating areas for growth.
      </div>
    </div>
  );
}
