import React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export const HATS = [
  { id: "white", name: "White", color: "bg-white text-black", desc: "Data & Facts" },
  { id: "red", name: "Red", color: "bg-red-500 text-white", desc: "Intuition" },
  { id: "black", name: "Black", color: "bg-zinc-900 text-white border border-white/20", desc: "Risk & Caution" },
  { id: "yellow", name: "Yellow", color: "bg-yellow-400 text-black", desc: "Optimism" },
  { id: "green", name: "Green", color: "bg-green-500 text-white", desc: "Creativity" },
  { id: "blue", name: "Blue", color: "bg-blue-600 text-white", desc: "Process" },
];

interface SixHatsProps {
  activeHat: string | null;
  onSelect: (hat: string | null) => void;
  mode: 'builder' | 'executive';
}

export function SixHats({ activeHat, onSelect, mode }: SixHatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={cn(
          "text-[10px] font-mono uppercase tracking-[0.3em] opacity-50",
          mode === 'builder' ? "text-slime" : "text-executive-gold"
        )}>
          Six Hats Protocol
        </h3>
        {activeHat && (
          <button 
            onClick={() => onSelect(null)}
            className="text-[8px] font-mono opacity-30 hover:opacity-100 transition-opacity uppercase"
          >
            Reset
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {HATS.map((hat) => (
          <motion.button
            key={hat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(hat.id)}
            className={cn(
              "relative p-3 rounded-xl transition-all border-2",
              activeHat === hat.id 
                ? (mode === 'builder' ? "border-slime" : "border-executive-gold") 
                : "border-transparent opacity-40 hover:opacity-100"
            )}
          >
            <div className={cn("w-full h-8 rounded-lg mb-2 shadow-inner", hat.color)} />
            <div className="text-[10px] font-bold tracking-tighter text-center uppercase">
              {hat.name}
            </div>
          </motion.button>
        ))}
      </div>
      
      {activeHat && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-3 rounded-lg bg-black/20 border border-white/5 text-center",
            mode === 'builder' ? "text-slime" : "text-executive-gold"
          )}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest">
            Mode: {HATS.find(h => h.id === activeHat)?.desc}
          </p>
        </motion.div>
      )}
    </div>
  );
}
