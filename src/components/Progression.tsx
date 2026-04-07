import React from "react";
import { motion } from "motion/react";
import { Award, Star, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

const TIERS = [
  { id: "neophyte", name: "NEOPHYTE", level: 1, icon: Zap, color: "text-blue-400" },
  { id: "architect", name: "ARCHITECT", level: 2, icon: ShieldCheck, color: "text-purple-400" },
  { id: "sovereign", name: "SOVEREIGN", level: 3, icon: Star, color: "text-executive-gold" },
];

const SKILLS = [
  { name: "Field Excitation", progress: 85, icon: Zap },
  { name: "Boardroom Dominance", progress: 62, icon: Award },
  { name: "Molt Orchestration", progress: 45, icon: Star },
];

export function Progression({ mode }: { mode: 'builder' | 'executive' }) {
  const currentTier = mode === 'builder' ? TIERS[0] : TIERS[2];

  return (
    <div className={cn(
      "p-6 rounded-xl glass border",
      mode === 'builder' ? "border-slime/20" : "border-executive-gold/10"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={cn(
          "text-xs font-mono uppercase tracking-[0.3em] opacity-50",
          mode === 'builder' ? "text-slime" : "text-executive-gold"
        )}>
          Progression Tiers
        </h3>
        <div className="flex items-center gap-2">
          <currentTier.icon className={cn("w-4 h-4", currentTier.color)} />
          <span className="text-xs font-bold tracking-tighter">{currentTier.name}</span>
        </div>
      </div>

      <div className="space-y-6">
        {SKILLS.map((skill, i) => (
          <div key={skill.name} className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono opacity-60">
              <div className="flex items-center gap-2">
                <skill.icon className="w-3 h-3" />
                <span>{skill.name.toUpperCase()}</span>
              </div>
              <span>{skill.progress}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.progress}%` }}
                transition={{ delay: i * 0.1, duration: 1 }}
                className={cn(
                  "h-full",
                  mode === 'builder' ? "bg-slime shadow-[0_0_10px_rgba(204,255,0,0.5)]" : "bg-executive-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "p-2 rounded-lg border text-center transition-all",
              tier.id === currentTier.id
                ? (mode === 'builder' ? "border-slime bg-slime/10" : "border-executive-gold bg-executive-gold/10")
                : "border-white/5 opacity-20"
            )}
          >
            <tier.icon className={cn("w-4 h-4 mx-auto mb-1", tier.id === currentTier.id ? tier.color : "text-white")} />
            <div className="text-[8px] font-mono font-bold">{tier.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
