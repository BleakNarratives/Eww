import React from "react";
import { motion } from "motion/react";
import { ShieldAlert, Brain, Scale, Terminal, Cpu, Globe } from "lucide-react";
import { cn } from "@/src/lib/utils";

const EXPERTS = [
  { 
    id: "cso", 
    name: "CSO", 
    role: "Security & Risk", 
    icon: ShieldAlert, 
    color: "text-red-400",
    status: "Hardened",
    detail: "Firewall: Active",
    subIcon: ShieldAlert
  },
  { 
    id: "adversary", 
    name: "ADVERSARY", 
    role: "Critical Analysis", 
    icon: Brain, 
    color: "text-purple-400",
    status: "Skeptical",
    detail: "Logic: Verified",
    subIcon: Terminal
  },
  { 
    id: "architect", 
    name: "ARCHITECT", 
    role: "Structural Integrity", 
    icon: Scale, 
    color: "text-blue-400",
    status: "Optimized",
    detail: "Load: 12%",
    subIcon: Cpu
  },
];

export function Council({ mode }: { mode: 'builder' | 'executive' }) {
  if (mode !== 'executive') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono text-executive-gold tracking-[0.3em] uppercase opacity-50">
          Council of Disagreeing Experts
        </h3>
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-executive-gold/30 animate-spin-slow" />
          <span className="text-[8px] font-mono text-executive-gold/40 uppercase tracking-widest">Global Consensus: 94%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {EXPERTS.map((expert, i) => (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="p-6 rounded-xl glass border border-executive-silver/10 hover:border-executive-gold/30 transition-all cursor-help group relative overflow-hidden"
          >
            {/* Background decorative icon */}
            <expert.icon className={cn("absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03] transition-transform group-hover:scale-110", expert.color)} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-2 rounded-lg bg-black/20 border border-white/5", expert.color)}>
                  <expert.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-executive-gold font-bold">{expert.status}</div>
                  <div className="text-[8px] font-mono opacity-30 uppercase">{expert.detail}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-bold tracking-tighter text-executive-silver group-hover:text-executive-gold transition-colors">
                  {expert.name}
                </div>
                <div className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
                  {expert.role}
                </div>
              </div>
              
              {/* Status light */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                  <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest">Deliberating</span>
                </div>
                <expert.subIcon className="w-3 h-3 opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

