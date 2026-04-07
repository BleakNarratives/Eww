import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export function Avatar({ mode }: { mode: 'builder' | 'executive' }) {
  return (
    <div className="relative w-32 h-32 group">
      {/* Glitch layers */}
      <motion.div
        animate={{
          x: mode === 'builder' ? [0, -2, 2, 0] : 0,
          opacity: mode === 'builder' ? [1, 0.8, 0.9, 1] : 1,
        }}
        transition={{ repeat: Infinity, duration: 0.2 }}
        className={cn(
          "absolute inset-0 rounded-full overflow-hidden border-2",
          mode === 'builder' ? "border-slime shadow-[0_0_20px_rgba(204,255,0,0.5)]" : "border-executive-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        )}
      >
        <img
          src={`https://picsum.photos/seed/${mode === 'builder' ? 'cyberpunk' : 'executive'}/200/200`}
          alt="Sovereign Proxy"
          className={cn(
            "w-full h-full object-cover grayscale",
            mode === 'builder' ? "mix-blend-screen opacity-80" : "opacity-90"
          )}
          referrerPolicy="no-referrer"
        />
      </motion.div>
      
      {/* Decorative rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className={cn(
          "absolute -inset-4 border border-dashed rounded-full opacity-20",
          mode === 'builder' ? "border-canary" : "border-executive-silver"
        )}
      />
      
      {/* Status indicator */}
      <div className={cn(
        "absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-black",
        mode === 'builder' ? "bg-slime animate-pulse" : "bg-executive-gold"
      )} />
    </div>
  );
}
