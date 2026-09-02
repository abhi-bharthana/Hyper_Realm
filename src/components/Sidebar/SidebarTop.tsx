import React from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function SidebarTop() {
  const { isSidebarCollapsed, toggleSidebar, setActiveTab } = useAppStore();

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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-black flex items-center justify-center shadow-lg border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-[400ms] ease-out">
          <Zap size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </div>
        
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-[400ms] ease-in-out ${isSidebarCollapsed ? 'w-0 opacity-0 ml-0' : 'w-[110px] opacity-100 ml-3'}`}>
          <h1 className="text-[14px] font-bold tracking-wide text-neutral-900 dark:text-white group-hover:text-blue-500 transition-colors leading-tight">
            Hyper_Realm
          </h1>
          <p className="text-[9px] text-neutral-500 font-mono uppercase mt-0.5">Core Env</p>
        </div>
      </div>
    </div>
  );
}