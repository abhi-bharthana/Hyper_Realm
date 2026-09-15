import React from 'react';
import { LayoutGrid, RotateCcw } from 'lucide-react';
import { useSidebarStore } from '../../store/useSidebarStore';

// 🔥 Naya prop: searchQuery
export function SidebarSection({ searchQuery = "" }: { searchQuery?: string }) {
  const { 
    items, 
    isSidebarAutoHide, 
    setSidebarAutoHide, 
    toggleVisibility, 
    resetToDefault 
  } = useSidebarStore();

  // 🔥 PERFECT MATCH LOGIC
  const isMatch = (keywords: string) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return keywords.toLowerCase().includes(query);
  };

  const highlightClass = "bg-blue-500/10 dark:bg-blue-500/20 ring-2 ring-blue-500/50 shadow-md scale-[1.01]";

  return (
    <div className="flex flex-col gap-[1.5rem] pt-2">
      
      {/* ======================================= */}
      {/* 1. AUTO-HIDE TOGGLE SECTION            */}
      {/* ======================================= */}
      <div className={`flex items-center justify-between p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('auto hide sidebar collapse invisible minimize') ? highlightClass : 'bg-slate-100 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50'}`}>
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
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('pinned shortcuts icons visibility hide show apps link surf battery processes music media recorder') ? highlightClass : 'bg-slate-100 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50'}`}>
        
        <div className="flex items-center gap-[0.5rem] mb-[1rem]">
          <LayoutGrid className="text-zinc-500 w-[1rem] h-[1rem]" />
          <span className="text-[0.9em] font-bold text-slate-900 dark:text-zinc-100 block">Pinned Shortcuts</span>
        </div>
        
        <div className="flex flex-col gap-[1rem]">
          {items.map((item) => {
            // 🔥 Item-level highlighting (if searching for a specific shortcut)
            const isItemMatch = isMatch(item.label.toLowerCase() + " " + item.id.toLowerCase());
            
            return (
              <div key={item.id} className={`flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-[1rem] last:border-0 last:pb-0 transition-colors duration-300 ${isItemMatch ? 'bg-blue-500/10 px-2 rounded-lg -mx-2' : ''}`}>
                <span className={`text-[0.85em] font-medium ${isItemMatch ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-zinc-300'}`}>
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
            );
          })}
        </div>
      </div>

      {/* ======================================= */}
      {/* 3. RESET BUTTON                        */}
      {/* ======================================= */}
      <button 
        type="button"
        onClick={resetToDefault}
        className={`mt-[0.5rem] p-[0.75rem] flex items-center justify-center gap-[0.5rem] w-full text-[0.85em] font-bold rounded-[1rem] transition-all duration-300 focus:outline-none ${isMatch('reset default restore') ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-[1.02]' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
      >
        <RotateCcw className={`w-[1rem] h-[1rem] ${isMatch('reset default restore') ? 'animate-spin-slow' : ''}`} /> Reset Defaults
      </button>

    </div>
  );
}