import { motion } from "motion/react";
import { Activity, Zap, Cpu, Shield } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function Diagnostics({ mode }: { mode: 'builder' | 'executive' }) {
  const stats = [
    { label: "SYNC", value: "98.4%", icon: Activity },
    { label: "NUANCE", value: "HIGH", icon: Zap },
    { label: "HAPTICS", value: "ACTIVE", icon: Cpu },
    { label: "SHIELD", value: "MAX", icon: Shield },
  ];

  return (
    <div className={cn(
      "p-6 rounded-xl glass",
      mode === 'builder' ? "border-slime/20" : "border-executive-silver/10"
    )}>
      <h3 className={cn(
        "text-xs font-mono mb-4 tracking-widest uppercase opacity-50",
        mode === 'builder' ? "text-canary" : "text-executive-silver"
      )}>
        Meatsuit Diagnostics
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <stat.icon className={cn(
              "w-4 h-4",
              mode === 'builder' ? "text-slime" : "text-executive-gold"
            )} />
            <div>
              <div className="text-[10px] font-mono opacity-40">{stat.label}</div>
              <div className="text-sm font-bold tracking-tighter">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Energy bar */}
      <div className="mt-6 space-y-1">
        <div className="flex justify-between text-[10px] font-mono opacity-40">
          <span>FIELD EXCITATION</span>
          <span>84%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "84%" }}
            className={cn(
              "h-full",
              mode === 'builder' ? "bg-slime shadow-[0_0_10px_#CCFF00]" : "bg-executive-gold"
            )}
          />
        </div>
      </div>
    </div>
  );
}
