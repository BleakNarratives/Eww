import React from "react";
import { motion } from "motion/react";
import { Avatar } from "./Avatar";
import { Diagnostics } from "./Diagnostics";
import { cn } from "@/src/lib/utils";

export function BuilderMode({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-slime selection:text-black">
      {/* Background excitation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-slime/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-canary/10 rounded-full blur-[150px]"
        />
        
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(to right, #CCFF00 1px, transparent 1px), linear-gradient(to bottom, #CCFF00 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Identity */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex flex-col items-center lg:items-start"
            >
              <Avatar mode="builder" />
              <div className="mt-6 text-center lg:text-left">
                <h1 className="text-5xl font-bold tracking-tighter text-slime glitch-text">
                  SOVEREIGN<span className="text-canary">.OS</span>
                </h1>
                <p className="text-xs font-mono text-canary/50 mt-2 tracking-[0.4em] uppercase">
                  Field Excitation Active
                </p>
              </div>
            </motion.div>
            
            <Diagnostics mode="builder" />
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass border-slime/20 rounded-3xl p-8 min-h-[500px] relative overflow-hidden"
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slime/5 -rotate-45 translate-x-16 -translate-y-16" />
              
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
