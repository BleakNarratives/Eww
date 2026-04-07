import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Folder, File, ChevronRight, ChevronDown, Cpu, Terminal } from "lucide-react";
import { cn } from "@/src/lib/utils";

const FILE_TREE = [
  { name: "src", type: "folder", children: [
    { name: "components", type: "folder", children: [
      { name: "Avatar.tsx", type: "file" },
      { name: "BuilderMode.tsx", type: "file" },
      { name: "ExecutiveMode.tsx", type: "file" },
      { name: "Council.tsx", type: "file" },
      { name: "Swarm.tsx", type: "file" },
      { name: "Progression.tsx", type: "file" },
      { name: "CodebaseExplorer.tsx", type: "file" },
    ]},
    { name: "lib", type: "folder", children: [
      { name: "gemini.ts", type: "file" },
      { name: "utils.ts", type: "file" },
    ]},
    { name: "App.tsx", type: "file" },
    { name: "main.tsx", type: "file" },
    { name: "index.css", type: "file" },
  ]},
  { name: "package.json", type: "file" },
  { name: "metadata.json", type: "file" },
  { name: "vite.config.ts", type: "file" },
];

function FileNode({ node, depth = 0, mode }: { node: any, depth?: number, mode: 'builder' | 'executive', key?: string | number }) {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const isFolder = node.type === "folder";

  return (
    <div className="space-y-1">
      <motion.div
        whileHover={{ x: 4 }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors",
          isFolder ? "hover:bg-white/5" : "hover:bg-white/10",
          mode === 'builder' ? "text-slime/80 hover:text-slime" : "text-executive-silver/80 hover:text-executive-gold"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
        ) : (
          <File className="w-3 h-3 opacity-40" />
        )}
        {isFolder ? <Folder className="w-3 h-3 opacity-60" /> : null}
        <span className="text-[10px] font-mono tracking-tight">{node.name}</span>
      </motion.div>

      <AnimatePresence>
        {isFolder && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((child: any) => (
              <FileNode key={child.name} node={child} depth={depth + 1} mode={mode} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CodebaseExplorer({ mode }: { mode: 'builder' | 'executive' }) {
  return (
    <div className={cn(
      "p-6 rounded-xl glass border h-full flex flex-col",
      mode === 'builder' ? "border-slime/20" : "border-executive-gold/10"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            mode === 'builder' ? "bg-slime/10 text-slime" : "bg-executive-gold/10 text-executive-gold"
          )}>
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className={cn(
              "text-xs font-mono uppercase tracking-[0.3em] opacity-50",
              mode === 'builder' ? "text-slime" : "text-executive-gold"
            )}>
              Codebase Visualizer
            </h3>
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Molt Orchestrator v1.0.4</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 opacity-30" />
          <span className="text-[8px] font-mono opacity-30">ZC_HEADLESS_OLLAMA</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-1">
        {FILE_TREE.map((node) => (
          <FileNode key={node.name} node={node} mode={mode} />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-mono opacity-40 uppercase">Syncing with Mainframe</span>
        </div>
        <div className="text-[8px] font-mono opacity-20">BUILD_HASH: 0x8F2E...</div>
      </div>
    </div>
  );
}
