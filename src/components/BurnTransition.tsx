import React from "react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export function BurnTransition({ isChanging }: { isChanging: boolean }) {
  return (
    <div className={cn(
      "fixed inset-0 z-[200] pointer-events-none overflow-hidden",
      !isChanging && "hidden"
    )}>
      {/* SVG Filter for the burn effect */}
      <svg className="absolute w-0 h-0">
        <filter id="acid-burn">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="5" seed="1" result="noise">
            <animate attributeName="seed" from="1" to="100" dur="0.5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="100" />
        </filter>
      </svg>

      {/* Burn layers */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={isChanging ? { 
          opacity: [0, 1, 1, 0],
          scale: [1.2, 1, 1, 1.5],
          filter: ["hue-rotate(0deg) brightness(1)", "hue-rotate(90deg) brightness(3)", "hue-rotate(180deg) brightness(5)", "hue-rotate(270deg) brightness(1)"]
        } : {}}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 bg-white mix-blend-difference"
        style={{ filter: "url(#acid-burn)" }}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={isChanging ? { 
          opacity: [0, 0.8, 0],
          backgroundColor: ["#ff0000", "#ffaa00", "#ffffff"]
        } : {}}
        transition={{ duration: 0.6, ease: "linear" }}
        className="absolute inset-0 mix-blend-overlay"
      />

      {/* Film grain/noise overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150 contrast-150" />
    </div>
  );
}
