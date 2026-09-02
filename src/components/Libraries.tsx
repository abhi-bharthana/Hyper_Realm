import React from 'react';
import { PackageSearch, Terminal, Sparkles } from 'lucide-react';

export default function Libraries() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[24rem] p-[2rem] rounded-[1.5rem] border-[0.15rem] border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md transition-all duration-500 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-slate-100/50 dark:hover:bg-white/10 group overflow-hidden">
      
      {/* Subtle Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Animated Icon Cluster */}
      <div className="relative mb-[1.5rem]">
        {/* Glow behind icon */}
        <div className="absolute inset-0 bg-blue-500/20 blur-[1.5rem] rounded-full group-hover:bg-blue-500/40 transition-all duration-500" />
        
        {/* Main Box */}
        <div className="relative p-[1.25rem] bg-white dark:bg-zinc-900 rounded-[1.25rem] border border-slate-200 dark:border-white/10 shadow-sm group-hover:shadow-[0_0.75rem_2rem_rgba(59,130,246,0.15)] transition-all duration-500 group-hover:-translate-y-[0.3rem]">
          <PackageSearch className="w-[2.5rem] h-[2.5rem] text-slate-700 dark:text-slate-300 group-hover:text-blue-500 transition-colors duration-500" />
        </div>
        
        {/* Floating Sparkle */}
        <div className="absolute -top-[0.5rem] -right-[0.5rem] p-[0.4rem] bg-blue-500 text-white rounded-[0.5rem] shadow-[0_0.2rem_0.5rem_rgba(59,130,246,0.4)] animate-bounce">
          <Sparkles className="w-[0.8rem] h-[0.8rem]" />
        </div>
        
        {/* Floating Terminal */}
        <div className="absolute -bottom-[0.5rem] -left-[0.5rem] p-[0.4rem] bg-slate-800 dark:bg-white text-white dark:text-slate-900 rounded-[0.5rem] shadow-sm transition-transform duration-500 group-hover:-rotate-12">
          <Terminal className="w-[0.8rem] h-[0.8rem]" />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center z-10 flex flex-col gap-[0.5rem]">
        <h3 className="text-[1.3em] font-bold text-slate-900 dark:text-white tracking-tight">
          Hyper-Package Manager
        </h3>
        <div className="flex items-center justify-center gap-[0.5rem]">
          <span className="w-[0.4rem] h-[0.4rem] rounded-full bg-blue-500 animate-pulse shadow-[0_0_0.5rem_rgba(59,130,246,0.6)]" />
          <p className="text-slate-500 dark:text-slate-400 font-mono text-[0.85em] tracking-widest uppercase">
            Module In Development
          </p>
        </div>
      </div>

      {/* Fake Terminal Progress Decoration */}
      <div className="mt-[2.5rem] flex flex-col gap-[0.5rem] w-full max-w-[15rem] opacity-30 group-hover:opacity-100 transition-opacity duration-700 z-10">
        <div className="flex justify-between items-center mb-[0.25rem]">
          <span className="text-[0.65em] font-mono text-slate-400 dark:text-zinc-500">Building core dependencies...</span>
          <span className="text-[0.65em] font-mono text-blue-500">42%</span>
        </div>
        <div className="h-[0.3rem] w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[42%] rounded-full animate-[pulse_2s_ease-in-out_infinite]" />
        </div>
      </div>

    </div>
  );
}