import React, { useState, useEffect, useRef } from "react";
import { motion, useDragControls, PanInfo } from "motion/react";
import { Settings, Sliders, Activity, Zap, Cpu, Terminal } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BoomerangPanelProps {
  mode: 'builder' | 'executive';
}

export function BoomerangPanel({ mode }: BoomerangPanelProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [corner, setCorner] = useState<'tl' | 'tr' | 'bl' | 'br'>('tr');
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { x, y } = info.point;
    const { innerWidth, innerHeight } = window;
    
    const isLeft = x < innerWidth / 2;
    const isTop = y < innerHeight / 2;
    
    if (isLeft && isTop) setCorner('tl');
    else if (!isLeft && isTop) setCorner('tr');
    else if (isLeft && !isTop) setCorner('bl');
    else setCorner('br');
  };

  const getRotation = () => {
    switch (corner) {
      case 'tl': return 135;
      case 'tr': return 45;
      case 'bl': return 225;
      case 'br': return 315;
      default: return 0;
    }
  };

  const getPositionStyles = () => {
    switch (corner) {
      case 'tl': return { top: 20, left: 20 };
      case 'tr': return { top: 20, right: 20 };
      case 'bl': return { bottom: 20, left: 20 };
      case 'br': return { bottom: 20, right: 20 };
      default: return {};
    }
  };

  return (
    <motion.div
      ref={panelRef}
      drag
      dragControls={dragControls}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={getPositionStyles()}
      className="fixed z-[100] cursor-grab active:cursor-grabbing"
    >
      {/* Boomerang Shape Container */}
      <motion.div
        animate={{ rotate: isOpen ? 0 : getRotation() }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          "relative w-64 h-64 transition-all duration-500",
          isOpen ? "w-80 h-96" : "w-64 h-64"
        )}
      >
        {/* The Boomerang SVG Background */}
        <svg
          viewBox="0 0 200 200"
          className={cn(
            "absolute inset-0 w-full h-full drop-shadow-2xl transition-colors duration-500",
            mode === 'builder' ? "fill-zinc-900 stroke-slime/30" : "fill-executive-navy stroke-executive-gold/30"
          )}
          style={{ strokeWidth: 1 }}
        >
          <path
            d="M 20,100 C 20,40 80,20 100,20 C 120,20 180,40 180,100 C 180,160 120,180 100,180 C 80,180 20,160 20,100 Z"
            className="opacity-95"
          />
          {/* Inner details for VST look */}
          <path d="M 40,100 C 40,60 80,45 100,45 C 120,45 160,60 160,100" fill="none" className="stroke-white/5" />
        </svg>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {!isOpen ? (
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              className={cn(
                "p-4 rounded-full glass border shadow-lg",
                mode === 'builder' ? "border-slime/40 text-slime" : "border-executive-gold/40 text-executive-gold"
              )}
            >
              <Settings className="w-8 h-8 animate-spin-slow" />
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex flex-col space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className={cn(
                  "text-xs font-mono uppercase tracking-[0.3em]",
                  mode === 'builder' ? "text-slime" : "text-executive-gold"
                )}>
                  Swarm VST-1
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white">×</button>
              </div>

              {/* Analog Knobs Simulation */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "GAIN", icon: Sliders },
                  { label: "FREQ", icon: Activity },
                  { label: "RESO", icon: Zap },
                ].map((knob) => (
                  <div key={knob.label} className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full border-4 border-zinc-800 bg-zinc-900 shadow-inner flex items-center justify-center relative group">
                      <motion.div
                        animate={{ rotate: [0, 180, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-1 h-4 bg-white/20 absolute top-1 rounded-full origin-bottom"
                      />
                      <knob.icon className="w-4 h-4 text-white/20" />
                    </div>
                    <span className="text-[8px] font-mono opacity-40">{knob.label}</span>
                  </div>
                ))}
              </div>

              {/* Small VST Screen */}
              <div className="flex-1 bg-black/40 rounded-lg border border-white/5 p-3 font-mono text-[10px] space-y-2 overflow-hidden">
                <div className="flex justify-between text-green-500/50">
                  <span>OSC_1: SAW</span>
                  <span className="animate-pulse">●</span>
                </div>
                <div className="h-8 flex items-end gap-1">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                      className="flex-1 bg-slime/40 rounded-t-sm"
                    />
                  ))}
                </div>
                <div className="text-[8px] opacity-20 uppercase tracking-widest">
                  Molt_Orchestrator_v1.0.4
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className={cn(
                  "py-2 rounded border text-[10px] font-bold uppercase tracking-tighter transition-all",
                  mode === 'builder' ? "border-slime/20 text-slime hover:bg-slime/10" : "border-executive-gold/20 text-executive-gold hover:bg-executive-gold/10"
                )}>
                  Harvest
                </button>
                <button className={cn(
                  "py-2 rounded border text-[10px] font-bold uppercase tracking-tighter transition-all",
                  mode === 'builder' ? "border-canary/20 text-canary hover:bg-canary/10" : "border-executive-silver/20 text-executive-silver hover:bg-executive-silver/10"
                )}>
                  Scape
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
