import React from "react";
import { motion } from "motion/react";
import { Avatar } from "./Avatar";
import { Diagnostics } from "./Diagnostics";
import { Council } from "./Council";
import { Swarm } from "./Swarm";
import { Progression } from "./Progression";
import { CodebaseExplorer } from "./CodebaseExplorer";
import { SystemPorts } from "./SystemPorts";
import { SixHats } from "./SixHats";
import { cn } from "@/src/lib/utils";

interface ExecutiveModeProps {
  children?: React.ReactNode;
  activeHat: string | null;
  onSelectHat: (hat: string | null) => void;
  mode: 'builder' | 'executive';
}

export function ExecutiveMode({ children, activeHat, onSelectHat, mode }: ExecutiveModeProps) {
  return (
    <div className="relative min-h-screen bg-executive-navy pinstripe overflow-hidden selection:bg-executive-gold selection:text-executive-navy">
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar: Boardroom Controls */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <Avatar mode="executive" />
              <div className="mt-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-executive-silver">
                  SOVEREIGN<span className="text-executive-gold">.OS</span>
                </h1>
                <div className="h-[1px] w-12 bg-executive-gold/30 mx-auto my-3" />
                <p className="text-[10px] font-mono text-executive-gold tracking-[0.5em] uppercase opacity-60">
                  Executive Proxy
                </p>
              </div>
            </motion.div>

            <Progression mode="executive" />
            
            <SixHats activeHat={activeHat} onSelect={onSelectHat} mode={mode} />

            <SystemPorts mode="executive" />
            
            <Diagnostics mode="executive" />
            
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono text-executive-silver/40 uppercase tracking-widest">System Status</h4>
              <div className="p-4 rounded-lg bg-black/20 border border-white/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-executive-silver/60">AUTHORITY</span>
                  <span className="text-[10px] text-executive-gold font-bold">SOVEREIGN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-executive-silver/60">UPTIME</span>
                  <span className="text-[10px] text-executive-silver">99.999%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content: The Boardroom */}
          <div className="lg:col-span-9 space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass border-white/5 rounded-sm p-12 min-h-[500px] shadow-2xl relative"
                >
                  {/* Gold accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-executive-gold/50 to-transparent" />
                  
                  <div className="prose prose-invert max-w-none">
                    {children}
                  </div>
                </motion.div>

                <Council mode="executive" />
              </div>

              <div className="space-y-8">
                <Swarm mode="executive" />
                <div className="h-[400px]">
                  <CodebaseExplorer mode="executive" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

