import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Terminal, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

export function MainframeQuery({ mode, onQuery }: { mode: 'builder' | 'executive', onQuery: (q: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuery(query);
      setQuery("");
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "relative group transition-all duration-500",
          "glass rounded-2xl overflow-hidden",
          mode === 'builder' 
            ? "border-slime/30 shadow-[0_0_30px_rgba(204,255,0,0.1)] focus-within:border-slime/60" 
            : "border-executive-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.05)] focus-within:border-executive-gold/40"
        )}
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {mode === 'builder' ? (
            <Terminal className="w-5 h-5 text-slime animate-pulse" />
          ) : (
            <Search className="w-5 h-5 text-executive-gold" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mode === 'builder' ? "EXCITE THE FIELD..." : "QUERY THE BOARDROOM..."}
          className={cn(
            "w-full bg-transparent py-5 pl-12 pr-16 outline-none text-lg font-mono tracking-tight",
            mode === 'builder' ? "placeholder:text-slime/30 text-slime" : "placeholder:text-executive-silver/30 text-executive-silver"
          )}
        />
        
        <button
          type="submit"
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
            mode === 'builder' 
              ? "bg-slime text-black hover:scale-110 active:scale-95" 
              : "bg-executive-gold text-executive-navy hover:scale-110 active:scale-95"
          )}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        
        {/* Decorative scanline */}
        {mode === 'builder' && (
          <motion.div
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[1px] bg-slime/20 pointer-events-none"
          />
        )}
      </motion.form>
    </div>
  );
}
