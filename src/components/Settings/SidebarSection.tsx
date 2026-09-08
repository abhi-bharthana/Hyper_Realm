import React from 'react';
import { PanelLeft, LayoutGrid, RotateCcw } from 'lucide-react';
import { useSidebarStore } from '../../store/useSidebarStore';

export function SidebarSection() {
  const { 
    items, 
    isSidebarAutoHide, 
    setSidebarAutoHide, 
    toggleVisibility, 
    resetToDefault 
  } = useSidebarStore();

  return (
    <div className="bg-white/70 dark:bg-zinc-900/80 p-[1.5rem] md:p-[2rem] rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-shadow">
      
      <h4 className="text-[1.1em] font-bold text-slate-900 dark:text-zinc-100 mb-[0.25rem] flex items-center gap-[0.5rem]">
        <PanelLeft className="text-zinc-500 w-[1.2rem] h-[1.2rem]" /> Sidebar Configuration
      </h4>
      <p className="text-[0.85em] text-slate-500 dark:text-zinc-400 mb-[1.5rem]">
        Customize sidebar behavior and pin/unpin applications.
      </p>

      <div className="flex flex-col gap-[1.5rem]">
        
        {/* ======================================= */}
        {/* 1. AUTO-HIDE TOGGLE SECTION            */}
        {/* ======================================= */}
        <div className="flex items-center justify-between p-[1.25rem] rounded-[1.25rem] bg-white/50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50">
          <div className="flex flex-col gap-[0.25rem]">
            <span className="text-[0.9em] font-bold text-slate-900 dark:text-zinc-100 block">Auto-Hide Sidebar</span>
            <span className="text-[0.75em] text-slate-500 dark:text-zinc-400">Hide sidebar automatically when not in use</span>
          </div>
          <button 
            type="button"
            onClick={() => setSidebarAutoHide(!isSidebarAutoHide)}
            className={`w-[3rem] h-[1.6rem] rounded-full transition-colors duration-300 relative shrink-0 focus:outline-none ${
              isSidebarAutoHide ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-slate-300 dark:bg-zinc-600'
            }`}
          >
            <div 
              className={`w-[1.2rem] h-[1.2rem] rounded-full bg-white dark:bg-zinc-900 absolute top-[0.2rem] transition-transform duration-300 ${
                isSidebarAutoHide ? 'translate-x-[1.6rem]' : 'translate-x-[0.2rem]'
              }`} 
            />
          </button>
        </div>

        {/* ======================================= */}
        {/* 2. ADD / REMOVE ICONS SECTION          */}
        {/* ======================================= */}
        <div className="p-[1.25rem] rounded-[1.25rem] bg-white/50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50">
          
          <div className="flex items-center gap-[0.5rem] mb-[1rem]">
            <LayoutGrid className="text-zinc-500 w-[1rem] h-[1rem]" />
            <span className="text-[0.9em] font-bold text-slate-900 dark:text-zinc-100 block">Pinned Shortcuts</span>
          </div>
          
          <div className="flex flex-col gap-[1rem]">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-[1rem] last:border-0 last:pb-0">
                <span className="text-[0.85em] font-medium text-slate-700 dark:text-zinc-300">
                  {item.label}
                </span>
                
                <button 
                  type="button"
                  onClick={() => toggleVisibility(item.id)}
                  disabled={item.isFixed}
                  className={`w-[3rem] h-[1.6rem] rounded-full transition-colors duration-300 relative shrink-0 focus:outline-none ${
                    item.isVisible ? 'bg-blue-500' : 'bg-slate-300 dark:bg-zinc-600'
                  } ${item.isFixed ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div 
                    className={`w-[1.2rem] h-[1.2rem] rounded-full bg-white absolute top-[0.2rem] transition-transform duration-300 ${
                      item.isVisible ? 'translate-x-[1.6rem]' : 'translate-x-[0.2rem]'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================= */}
        {/* 3. RESET BUTTON                        */}
        {/* ======================================= */}
        <button 
          type="button"
          onClick={resetToDefault}
          className="mt-[0.5rem] p-[0.75rem] flex items-center justify-center gap-[0.5rem] w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-[1rem] text-[0.85em] font-bold transition-colors focus:outline-none"
        >
          <RotateCcw className="w-[1rem] h-[1rem]" /> Reset Defaults
        </button>

      </div>
    </div>
  );
}