import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ThemeOption } from './Shared';

export function AppearanceSection({ searchQuery = "" }: { searchQuery?: string }) {
  const { theme, setTheme } = useAppStore();

  // 🔥 PERFECT MATCH LOGIC
  const isMatch = (keywords: string) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return keywords.toLowerCase().includes(query);
  };

  // Agar user strictly "theme" search kare toh hi parent highlight ho, warna na ho.
  const parentHighlightClass = "bg-blue-500/5 dark:bg-blue-500/10 ring-1 ring-blue-500/30 rounded-[1.25rem]";

  return (
    <div className="flex flex-col gap-[1.5rem] pt-2">
      
      {/* Theme Selector Container */}
      <div className={`p-4 transition-all duration-300 ${isMatch('theme interface colors') ? parentHighlightClass : 'bg-transparent'}`}>
        <span className="text-[0.75em] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-[0.75rem] block">Interface Theme</span>
        
        <div className="grid grid-cols-3 gap-[1rem]">
          {/* 🔥 GRANULAR TARGETING: Sirf "light" type karne par yahi button pop hoga */}
          <ThemeOption 
            active={theme === 'light'} 
            onClick={() => setTheme('light')} 
            icon={<Sun className="w-[1.2rem] h-[1.2rem]" />} 
            label="Light" 
            isHighlighted={isMatch('light white bright day')}
          />
          <ThemeOption 
            active={theme === 'system'} 
            onClick={() => setTheme('system')} 
            icon={<Monitor className="w-[1.2rem] h-[1.2rem]" />} 
            label="Auto (OS)" 
            isHighlighted={isMatch('auto system os default match')}
          />
          <ThemeOption 
            active={theme === 'dark'} 
            onClick={() => setTheme('dark')} 
            icon={<Moon className="w-[1.2rem] h-[1.2rem]" />} 
            label="Matte Dark" 
            isHighlighted={isMatch('dark matte black night')}
          />
        </div>
      </div>

      {/* Live Preview of Theme */}
      <div className={`w-full p-[1.5rem] rounded-[1.25rem] bg-slate-100/50 dark:bg-[#111111] border border-slate-200/50 dark:border-white/5 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${isMatch('preview live window show') ? parentHighlightClass : ''}`}>
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