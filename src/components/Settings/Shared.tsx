import React from 'react';

export function ThemeOption({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-[1rem] rounded-[1rem] border transition-all duration-300 active:scale-95 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-[0_0.5rem_1rem_rgba(0,0,0,0.1)]' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <div className="mb-[0.5rem]">{icon}</div>
      <span className="text-[0.8em] font-semibold tracking-wide">{label}</span>
    </button>
  );
}

export function DensityOption({ active, onClick, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-[1rem] rounded-[1rem] border transition-all duration-300 active:scale-95 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-[0_0.5rem_1rem_rgba(0,0,0,0.1)]' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <span className="text-[0.9em] font-bold tracking-wide">{label}</span>
      <span className="text-[0.7em] opacity-70 mt-[0.25rem] font-mono">{desc}</span>
    </button>
  );
}

export function OptionButton({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center p-[0.75rem] rounded-[0.75rem] border transition-all duration-300 active:scale-95 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <span className="text-[0.8em] font-bold tracking-wide">{label}</span>
    </button>
  );
}