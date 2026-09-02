import React from 'react';
import { Maximize2, Type, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function InterfaceSection() {
  const { 
    uiScale, setUiScale,
    textScale, setTextScale,
    globalFontFamily, setGlobalFontFamily,
    isEyeCareEnabled, toggleEyeCare, eyeCareIntensity, setEyeCareIntensity
  } = useAppStore();

  return (
    <div className="bg-white/70 dark:bg-zinc-900/80 p-[1.5rem] md:p-[2rem] rounded-[1.5rem] border border-slate-200 dark:border-white/[0.08] shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-[1.1em] font-bold text-slate-900 dark:text-zinc-100 mb-[0.25rem] flex items-center gap-[0.5rem]">
        <Maximize2 className="text-zinc-500 w-[1.2rem] h-[1.2rem]" /> Interface & Display
      </h4>
      <p className="text-[0.85em] text-slate-500 dark:text-zinc-400 mb-[2rem]">
        Granular control over layout scaling, typography, and eye strain reduction.
      </p>

      <div className="flex flex-col gap-[1.5rem]">
        
        {/* Typography & Font Family */}
        <div>
          <div className="flex items-center justify-between mb-[0.75rem]">
            <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-[0.5rem]">
              <Type className="w-[1.1rem] h-[1.1rem]" /> Font Family
            </span>
          </div>
          <select 
            value={globalFontFamily} 
            onChange={(e) => setGlobalFontFamily(e.target.value)}
            className="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-[0.75rem] px-[1rem] py-[0.75rem] text-[0.85em] font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow cursor-pointer"
          >
            <option value="system-ui, sans-serif">System Default</option>
            <option value="'Inter', sans-serif">Inter (Modern)</option>
            <option value="'Roboto', sans-serif">Roboto (Clean)</option>
            <option value="'Courier New', monospace">Courier (Hacker/Mono)</option>
            <option value="Georgia, serif">Georgia (Serif)</option>
          </select>
        </div>

        {/* Global Text Scale Slider */}
        <div>
          <div className="flex items-center justify-between mb-[0.75rem]">
            <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300">Text Size (Typography)</span>
            <span className="text-[0.7em] font-mono text-slate-500 bg-slate-100 dark:bg-white/5 px-[0.5rem] py-[0.25rem] rounded-[0.4rem]">
              {Math.round(textScale * 100)}%
            </span>
          </div>
          <input 
            type="range" min="0.7" max="1.5" step="0.05" 
            value={textScale} onChange={(e) => setTextScale(Number(e.target.value))}
            className="w-full h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-white" 
          />
        </div>

        {/* Global UI Scale Slider */}
        <div>
          <div className="flex items-center justify-between mb-[0.75rem]">
            <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300">UI Size (Boxes & Padding)</span>
            <span className="text-[0.7em] font-mono text-slate-500 bg-slate-100 dark:bg-white/5 px-[0.5rem] py-[0.25rem] rounded-[0.4rem]">
              {Math.round(uiScale * 100)}%
            </span>
          </div>
          <input 
            type="range" min="0.7" max="1.3" step="0.05" 
            value={uiScale} onChange={(e) => setUiScale(Number(e.target.value))}
            className="w-full h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-white" 
          />
        </div>

        {/* Eye Care Filter */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-[1.5rem]">
          <div className="flex items-center justify-between">
            <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-[0.5rem]">
              <Eye className={`w-[1.1rem] h-[1.1rem] transition-colors ${isEyeCareEnabled ? "text-orange-500" : ""}`} /> 
              Eye Care Filter
            </span>
            <button 
              onClick={toggleEyeCare}
              className={`w-[3rem] h-[1.6rem] rounded-full transition-colors duration-300 relative shrink-0 ${
                isEyeCareEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-zinc-600'
              }`}
            >
              <div className={`w-[1.2rem] h-[1.2rem] rounded-full bg-white absolute top-[0.2rem] transition-transform duration-300 ${isEyeCareEnabled ? 'translate-x-[1.6rem]' : 'translate-x-[0.2rem]'}`} />
            </button>
          </div>
          
          {/* Intensity Slider */}
          <div className={`transition-all duration-300 overflow-hidden ${isEyeCareEnabled ? 'opacity-100 max-h-[4rem] mt-[1rem]' : 'opacity-0 max-h-0'}`}>
            <div className="flex items-center justify-between mb-[0.75rem]">
              <span className="text-[0.75em] font-semibold text-slate-500">Filter Intensity</span>
              <span className="text-[0.7em] font-mono text-orange-500">{eyeCareIntensity}%</span>
            </div>
            <input 
              type="range" min="10" max="80" step="1" 
              value={eyeCareIntensity} onChange={(e) => setEyeCareIntensity(Number(e.target.value))}
              className="w-full h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}