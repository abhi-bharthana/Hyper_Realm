import React from 'react';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ThemeOption } from './Shared';

export function AppearanceSection() {
  const { theme, setTheme } = useAppStore();

  return (
    <div className="bg-white/70 dark:bg-zinc-900/80 p-[1.5rem] md:p-[2rem] rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-[1.1em] font-bold text-slate-900 dark:text-zinc-100 mb-[0.25rem] flex items-center gap-[0.5rem]">
        <Palette className="text-zinc-500 w-[1.2rem] h-[1.2rem]" /> Appearance & Theme
      </h4>
      <p className="text-[0.85em] text-slate-500 dark:text-zinc-400 mb-[1.5rem]">
        Choose your interface aesthetic or sync directly with OS appearance.
      </p>

      {/* Theme Selector */}
      <div className="grid grid-cols-3 gap-[1rem] mb-[1.5rem]">
        <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun className="w-[1.2rem] h-[1.2rem]" />} label="Light" />
        <ThemeOption active={theme === 'system'} onClick={() => setTheme('system')} icon={<Monitor className="w-[1.2rem] h-[1.2rem]" />} label="Auto (OS)" />
        <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon className="w-[1.2rem] h-[1.2rem]" />} label="Matte Dark" />
      </div>

      {/* Live Preview of Theme */}
      <div className="w-full p-[1.5rem] rounded-[1.25rem] bg-slate-100/50 dark:bg-[#111111] border border-slate-200/50 dark:border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
        <span className="absolute top-[1rem] left-[1rem] text-[0.65em] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-600">
          Theme Preview
        </span>
        
        {/* Fake Mini Window mimicking the app */}
        <div className="w-[80%] mt-[1rem] h-[8rem] bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-[1rem] shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
          <div className="h-[2rem] border-b border-slate-100 dark:border-white/5 flex items-center px-[0.75rem] gap-[0.4rem]">
            <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-red-400"></div>
            <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-yellow-400"></div>
            <div className="w-[0.5rem] h-[0.5em] rounded-full bg-green-400"></div>
          </div>
          <div className="flex-1 p-[1rem] flex flex-col gap-[0.5rem]">
            <div className="w-1/2 h-[0.5rem] bg-slate-200 dark:bg-white/10 rounded-full"></div>
            <div className="w-3/4 h-[0.5rem] bg-slate-200 dark:bg-white/10 rounded-full"></div>
            <div className="w-1/3 h-[0.5rem] bg-blue-500/50 rounded-full mt-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}