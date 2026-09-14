import React from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useSidebarStore } from '../../store/useSidebarStore';

export function SidebarTop() {
  const { setActiveTab } = useAppStore();
  const { isSidebarCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <div className="flex flex-col items-center w-full mb-6">
      <button 
        onClick={toggleSidebar}
        className="p-1.5 mb-5 rounded-xl bg-neutral-200/50 hover:bg-neutral-300 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isSidebarCollapsed ? <ChevronRight size={18} strokeWidth={2.5} /> : <ChevronLeft size={18} strokeWidth={2.5} />}
      </button>

      <div 
        onClick={() => setActiveTab('Home')}
        className={`flex items-center overflow-hidden cursor-pointer group w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-start px-2'}`}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-black flex items-center justify-center shadow-lg border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-[400ms] ease-out">
          <Zap size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </div>
        
        {/* 🔥 FIX: absolute on collapse to avoid pushing logo */}
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-[400ms] ease-in-out ${isSidebarCollapsed ? 'absolute opacity-0 w-0 pointer-events-none' : 'relative w-[110px] opacity-100 ml-3'}`}>
          <h1 className="text-[14px] font-bold tracking-wide text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors leading-tight">
            Hyper_Realm
          </h1>
          <p className="text-[9px] text-neutral-500 font-mono uppercase mt-0.5">Core Env</p>
        </div>
      </div>
    </div>
  );
}