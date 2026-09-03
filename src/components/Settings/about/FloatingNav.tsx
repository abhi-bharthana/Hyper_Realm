// src/components/Settings/about/FloatingNav.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Cpu, Mic, Link as LinkIcon, Map } from 'lucide-react';

const navItems = [
  { id: 'hero', icon: Zap, label: 'Vision' },
  { id: 'core', icon: Cpu, label: 'Core Engine' },
  { id: 'ai', icon: Mic, label: 'Cognitive AI' },
  { id: 'network', icon: LinkIcon, label: 'Hyper-Network' },
  { id: 'roadmap', icon: Map, label: 'Roadmap' },
];

export const FloatingNav = ({ activeSection }: { activeSection: string }) => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
      className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 hidden xl:flex"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`group relative flex items-center p-3 rounded-full transition-all duration-500 ${
            activeSection === item.id 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg shadow-purple-500/30' 
              : 'bg-white/50 dark:bg-zinc-900/50 text-slate-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 border border-slate-200/50 dark:border-zinc-700/50'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
            {item.label}
          </span>
        </button>
      ))}
    </motion.div>
  );
};