import React from 'react';
import { Cpu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function SidebarBottom() {
  const { isSidebarCollapsed } = useAppStore();

  return (
    <div className={`mt-3 rounded-2xl bg-white/50 dark:bg-black/50 border border-white/40 dark:border-white/5 flex items-center transition-all duration-[400ms] overflow-hidden ${
      isSidebarCollapsed ? 'justify-center w-10 h-10 self-center p-0 shrink-0' : 'space-x-3 w-full p-3 shrink-0'
    }`}>
      <div className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
      </div>
      
      <div className={`overflow-hidden whitespace-nowrap transition-all duration-[400ms] ease-in-out ${isSidebarCollapsed ? 'w-0 opacity-0 ml-0' : 'w-[120px] opacity-100 ml-1'}`}>
        <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11.5px] tracking-wide">Node Active</p>
        <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-1 mt-0.5 uppercase tracking-wider">
          <Cpu size={10} /> ARM64 Core
        </p>
      </div>
    </div>
  );
}