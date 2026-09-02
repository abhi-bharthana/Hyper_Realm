import React from 'react';
import { PanelLeft } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function SidebarSection() {
  const { isSidebarAutoHide, setSidebarAutoHide } = useAppStore();

  return (
    <div className="bg-white/70 dark:bg-zinc-900/80 p-[1.5rem] md:p-[2rem] rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-[1.1em] font-bold text-slate-900 dark:text-zinc-100 mb-[0.25rem] flex items-center gap-[0.5rem]">
        <PanelLeft className="text-zinc-500 w-[1.2rem] h-[1.2rem]" /> Sidebar Settings
      </h4>
      <p className="text-[0.85em] text-slate-500 dark:text-zinc-400 mb-[1.5rem]">
        Customize sidebar behavior and visibility.
      </p>

      <div className="flex flex-col gap-[1.5rem]">
        <div className="flex items-center justify-between p-[1.25rem] rounded-[1.25rem] bg-white/50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50">
          <div className="flex flex-col gap-[0.25rem]">
            <span className="text-[0.9em] font-bold text-slate-900 dark:text-zinc-100 block">Auto-Hide Sidebar</span>
            <span className="text-[0.75em] text-slate-500 dark:text-zinc-400">Hide sidebar automatically when not in use</span>
          </div>
          <button 
            onClick={() => setSidebarAutoHide(!isSidebarAutoHide)}
            className={`w-[3rem] h-[1.6rem] rounded-full transition-colors duration-300 relative shrink-0 ${
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
      </div>
    </div>
  );
}