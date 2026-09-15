import React from 'react';

// 🔥 ADDED 'isHighlighted' prop for targeted search glow
export function ThemeOption({ active, onClick, icon, label, isHighlighted }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-[1rem] rounded-[1rem] border transition-all duration-300 active:scale-95 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)]' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      } ${
        isHighlighted ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.05] z-10' : ''
      }`}
    >
      <div className="mb-[0.5rem]">{icon}</div>
      <span className="text-[0.8em] font-semibold tracking-wide">{label}</span>
    </button>
  );
}

export function DensityOption({ active, onClick, label, desc, isHighlighted }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-[1rem] rounded-[1rem] border transition-all duration-300 active:scale-95 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)]' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      } ${
        isHighlighted ? 'ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.05] z-10' : ''
      }`}
    >
      <span className="text-[0.9em] font-bold tracking-wide">{label}</span>
      <span className="text-[0.7em] opacity-70 mt-[0.25rem] font-mono">{desc}</span>
    </button>
  );
}

export function OptionButton({ active, onClick, label, isHighlighted }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center justify-center p-[0.75rem] rounded-[0.75rem] border transition-all duration-300 active:scale-95 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      } ${
        isHighlighted ? 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-[1.05] z-10' : ''
      }`}
    >
      <span className="text-[0.8em] font-bold tracking-wide">{label}</span>
    </button>
  );
}