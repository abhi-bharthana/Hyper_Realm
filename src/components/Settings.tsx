import React from 'react';
import { Sun, Moon, Monitor, Palette, Maximize2, LayoutGrid, Globe, Music, Video } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { AppCard } from './AppCard'; // Preview render karne ke liye import kiya hai

export default function Settings() {
  const { 
    theme, setTheme, 
    uiDensity, setUiDensity,
    appIconSize, setAppIconSize,
    appGridSpacing, setAppGridSpacing,
    showAppNames, setShowAppNames
  } = useAppStore();

  // Preview box ke liye dynamic spacing
  const previewGaps = {
    tight: 'gap-x-4 gap-y-4',
    normal: 'gap-x-8 gap-y-8',
    relaxed: 'gap-x-12 gap-y-12',
  };

  return (
    // SCROLLBAR FIX: [&::-webkit-scrollbar]:hidden aur baaki hide classes add ki hain
    <div className="flex flex-col gap-6 h-full pb-16 max-w-3xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* Theme Configuration Card */}
      <div className="bg-white/70 dark:bg-zinc-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 flex items-center">
          <Palette className="mr-3 text-zinc-500" size={20} /> Appearance & Theme
        </h4>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
          Choose your interface aesthetic or sync directly with OS appearance.
        </p>

        <div className="grid grid-cols-3 gap-4">
          <ThemeOption active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun size={18} />} label="Light" />
          <ThemeOption active={theme === 'system'} onClick={() => setTheme('system')} icon={<Monitor size={18} />} label="Auto (OS)" />
          <ThemeOption active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon size={18} />} label="Matte Dark" />
        </div>
      </div>

      {/* UI Size / Density Configuration Card */}
      <div className="bg-white/70 dark:bg-zinc-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 flex items-center">
          <Maximize2 className="mr-3 text-zinc-500" size={20} /> Interface Size & Density
        </h4>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
          Adjust workspace spacing and element scaling safely.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DensityOption active={uiDensity === 'ultra'} onClick={() => setUiDensity('ultra')} label="Ultra" desc="Maximum Space" />
          <DensityOption active={uiDensity === 'compact'} onClick={() => setUiDensity('compact')} label="Compact" desc="High Density" />
          <DensityOption active={uiDensity === 'normal'} onClick={() => setUiDensity('normal')} label="Normal" desc="Balanced" />
          <DensityOption active={uiDensity === 'spacious'} onClick={() => setUiDensity('spacious')} label="Spacious" desc="Relaxed View" />
        </div>
      </div>

      {/* App Drawer Preferences Card with LIVE PREVIEW */}
      <div className="bg-white/70 dark:bg-zinc-900/80 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 flex items-center">
          <LayoutGrid className="mr-3 text-zinc-500" size={20} /> App Drawer Setup
        </h4>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
          Customize icon sizes, grid spacing, and label visibility in your apps menu.
        </p>

        {/* --- LIVE PREVIEW BOX --- */}
        <div className="mb-8 w-full p-6 sm:p-8 rounded-2xl bg-slate-100/50 dark:bg-[#111111] border border-slate-200/50 dark:border-white/5 flex items-center justify-center min-h-[180px] overflow-hidden relative">
          <span className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-600">
            Live Preview
          </span>
          
          <div className={`flex flex-wrap justify-center items-start w-full ${previewGaps[appGridSpacing]}`}>
            <AppCard name="Browser" icon={<Globe />} size={appIconSize} showName={showAppNames} onClick={() => {}} />
            <AppCard name="Music" icon={<Music />} size={appIconSize} showName={showAppNames} onClick={() => {}} />
            <AppCard name="Video" icon={<Video />} size={appIconSize} showName={showAppNames} onClick={() => {}} />
          </div>
        </div>
        {/* ------------------------ */}

        <div className="flex flex-col gap-6">
          {/* Icon Size */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3 block">Icon Size</span>
            <div className="grid grid-cols-3 gap-3">
              <OptionButton active={appIconSize === 'small'} onClick={() => setAppIconSize('small')} label="Small" />
              <OptionButton active={appIconSize === 'medium'} onClick={() => setAppIconSize('medium')} label="Medium" />
              <OptionButton active={appIconSize === 'large'} onClick={() => setAppIconSize('large')} label="Large" />
            </div>
          </div>

          {/* Grid Spacing */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-3 block">Grid Density</span>
            <div className="grid grid-cols-3 gap-3">
              <OptionButton active={appGridSpacing === 'tight'} onClick={() => setAppGridSpacing('tight')} label="Tight" />
              <OptionButton active={appGridSpacing === 'normal'} onClick={() => setAppGridSpacing('normal')} label="Normal" />
              <OptionButton active={appGridSpacing === 'relaxed'} onClick={() => setAppGridSpacing('relaxed')} label="Relaxed" />
            </div>
          </div>

          {/* Show App Names Toggle */}
          <div className="flex items-center justify-between p-4 mt-2 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-700/50">
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 block">Show App Names</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Display text labels under the app icons</span>
            </div>
            <button 
              onClick={() => setShowAppNames(!showAppNames)}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                showAppNames ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-slate-300 dark:bg-zinc-600'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white dark:bg-zinc-900 absolute top-1 transition-transform duration-300 ${
                  showAppNames ? 'translate-x-7' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function ThemeOption({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-md' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-semibold tracking-wide">{label}</span>
    </button>
  );
}

function DensityOption({ active, onClick, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-300 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-md' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <span className="text-sm font-bold tracking-wide">{label}</span>
      <span className="text-[10px] opacity-70 mt-0.5 font-mono">{desc}</span>
    </button>
  );
}

function OptionButton({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-md' 
          : 'bg-white/50 dark:bg-zinc-800/40 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700/50 hover:border-zinc-400'
      }`}
    >
      <span className="text-xs font-bold tracking-wide">{label}</span>
    </button>
  );
}