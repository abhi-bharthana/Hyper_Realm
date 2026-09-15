import React from 'react';
import { Globe, Music, Video } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OptionButton } from './Shared';
import { AppCard } from "../APP/launcher/AppCard";

export function AppDrawerSection({ searchQuery = "" }: { searchQuery?: string }) {
  const { 
    appIconSize, setAppIconSize,
    appGridSpacing, setAppGridSpacing,
    showAppNames, setShowAppNames
  } = useAppStore();

  const isMatch = (keywords: string) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return keywords.toLowerCase().includes(query);
  };

  const highlightClass = "bg-blue-500/10 dark:bg-blue-500/20 ring-2 ring-blue-500/50 shadow-md scale-[1.01]";

  const previewGaps = {
    tight: 'gap-x-[1rem] gap-y-[1rem]',
    normal: 'gap-x-[2rem] gap-y-[2rem]',
    relaxed: 'gap-x-[3rem] gap-y-[3rem]',
  };

  return (
    <div className="flex flex-col gap-[1.5rem] pt-2">

      {/* LIVE PREVIEW BOX */}
      <div className={`w-full p-[2rem] rounded-[1.25rem] bg-slate-100/50 dark:bg-[#111111] border border-slate-200/50 dark:border-white/5 flex items-center justify-center min-h-[12rem] overflow-hidden relative transition-all duration-300 ${isMatch('preview') ? highlightClass : ''}`}>
        <span className="absolute top-[1rem] left-[1rem] text-[0.65em] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-600">
          Live Preview
        </span>
        <div className={`flex flex-wrap justify-center items-start w-full ${previewGaps[appGridSpacing]}`}>
          <AppCard name="Browser" icon={<Globe />} size={appIconSize} showName={showAppNames} onClick={() => {}} />
          <AppCard name="Music" icon={<Music />} size={appIconSize} showName={showAppNames} onClick={() => {}} />
          <AppCard name="Video" icon={<Video />} size={appIconSize} showName={showAppNames} onClick={() => {}} />
        </div>
      </div>

      {/* Icon Size */}
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('icon size big small large medium') ? highlightClass : 'bg-transparent'}`}>
        <span className="text-[0.75em] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-[0.75rem] block">Icon Size</span>
        <div className="grid grid-cols-3 gap-[0.75rem]">
          <OptionButton active={appIconSize === 'small'} onClick={() => setAppIconSize('small')} label="Small" />
          <OptionButton active={appIconSize === 'medium'} onClick={() => setAppIconSize('medium')} label="Medium" />
          <OptionButton active={appIconSize === 'large'} onClick={() => setAppIconSize('large')} label="Large" />
        </div>
      </div>

      {/* Grid Density */}
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('grid density spacing tight relaxed normal') ? highlightClass : 'bg-transparent'}`}>
        <span className="text-[0.75em] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-[0.75rem] block">Grid Density</span>
        <div className="grid grid-cols-3 gap-[0.75rem]">
          <OptionButton active={appGridSpacing === 'tight'} onClick={() => setAppGridSpacing('tight')} label="Tight" />
          <OptionButton active={appGridSpacing === 'normal'} onClick={() => setAppGridSpacing('normal')} label="Normal" />
          <OptionButton active={appGridSpacing === 'relaxed'} onClick={() => setAppGridSpacing('relaxed')} label="Relaxed" />
        </div>
      </div>

      {/* Show App Names Toggle */}
      <div className={`flex items-center justify-between p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('show app names label text hide visibility') ? highlightClass : 'bg-slate-100 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50'}`}>
        <div className="flex flex-col gap-[0.25rem]">
          <span className="text-[0.9em] font-bold text-slate-900 dark:text-zinc-100 block">Show App Names</span>
          <span className="text-[0.75em] text-slate-500 dark:text-zinc-400">Display labels under the app icons</span>
        </div>
        <button 
          onClick={() => setShowAppNames(!showAppNames)}
          className={`w-[3rem] h-[1.6rem] rounded-full transition-colors duration-300 relative shrink-0 ${
            showAppNames ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-slate-300 dark:bg-zinc-600'
          }`}
        >
          <div 
            className={`w-[1.2rem] h-[1.2rem] rounded-full bg-white dark:bg-zinc-900 absolute top-[0.2rem] transition-transform duration-300 ${
              showAppNames ? 'translate-x-[1.6rem]' : 'translate-x-[0.2rem]'
            }`} 
          />
        </button>
      </div>

    </div>
  );
}