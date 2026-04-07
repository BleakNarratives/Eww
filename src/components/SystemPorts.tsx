import React from "react";
import { motion } from "motion/react";
import { Send, LayoutGrid, Flame, Users, Target, Zap } from "lucide-react";
import { cn } from "@/src/lib/utils";

const PORTS = [
  { id: "telegram", name: "Telegram", icon: Send, status: "Standby", color: "text-sky-400" },
  { id: "codecity", name: "Code City", icon: LayoutGrid, status: "Standby", color: "text-emerald-400" },
  { id: "firingsquad", name: "Firing Squad", icon: Flame, status: "Locked", color: "text-orange-500" },
  { id: "hotseat", name: "Hotseat", icon: Users, status: "Locked", color: "text-rose-400" },
  { id: "harvest", name: "Harvest Swarm", icon: Target, status: "Standby", color: "text-amber-400" },
  { id: "vertical", name: "Vertical AI", icon: Zap, status: "Standby", color: "text-indigo-400" },
];

export function SystemPorts({ mode }: { mode: 'builder' | 'executive' }) {
  return (
    <div className={cn(
      "p-6 rounded-xl glass border",
      mode === 'builder' ? "border-slime/20" : "border-executive-gold/10"
    )}>
      <h3 className={cn(
        "text-xs font-mono uppercase tracking-[0.3em] opacity-50 mb-6",
        mode === 'builder' ? "text-slime" : "text-executive-gold"
      )}>
        Automation DNA Ports
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {PORTS.map((port, i) => (
          <motion.div
            key={port.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-lg bg-black/20 border border-white/5 group hover:border-white/20 transition-all cursor-help"
          >
            <div className="flex items-center gap-3 mb-2">
              <port.icon className={cn("w-4 h-4", port.color)} />
              <span className="text-[10px] font-bold tracking-tight text-white/80">{port.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-[8px] font-mono uppercase tracking-widest",
                port.status === "Standby" ? "text-green-500/50" : "text-red-500/50"
              )}>
                {port.status}
              </span>
              <div className={cn(
                "w-1 h-1 rounded-full",
                port.status === "Standby" ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-red-500"
              )} />
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between text-[8px] font-mono opacity-20 uppercase tracking-[0.2em]">
          <span>Socket: 0.0.0.0:3000</span>
          <span>Protocol: SOV/1.0</span>
        </div>
      </div>
    </div>
  );
}
