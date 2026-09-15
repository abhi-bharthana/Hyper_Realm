import React from 'react';
import { Maximize2, Type, Eye } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// 🔥 Naya prop: searchQuery
export function InterfaceSection({ searchQuery = "" }: { searchQuery?: string }) {
  const { 
    uiScale, setUiScale,
    textScale, setTextScale,
    globalFontFamily, setGlobalFontFamily,
    isEyeCareEnabled, toggleEyeCare, eyeCareIntensity, setEyeCareIntensity
  } = useAppStore();

  // Highlight check logic
  const isMatch = (keywords: string) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return keywords.toLowerCase().includes(query);
  };

  const highlightClass = "bg-blue-500/10 dark:bg-blue-500/20 ring-2 ring-blue-500/50 shadow-md scale-[1.01]";

  return (
    <div className="flex flex-col gap-[1.5rem] pt-2">
      
      {/* Font Family Setting */}
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('font family text typography format') ? highlightClass : 'bg-transparent'}`}>
        <div className="flex items-center justify-between mb-[0.75rem]">
          <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-[0.5rem]">
            <Type className="w-[1.1rem] h-[1.1rem]" /> Font Family
          </span>
        </div>
        <select 
          value={globalFontFamily} 
          onChange={(e) => setGlobalFontFamily(e.target.value)}
          className="w-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-white/10 rounded-[0.75rem] px-[1rem] py-[0.75rem] text-[0.85em] font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow cursor-pointer"
        >
          <option value="system-ui, sans-serif">System Default</option>
          <option value="'Inter', sans-serif">Inter (Modern)</option>
          <option value="'Roboto', sans-serif">Roboto (Clean)</option>
          <option value="'Courier New', monospace">Courier (Hacker/Mono)</option>
          <option value="Georgia, serif">Georgia (Serif)</option>
        </select>
      </div>

      {/* Global Text Scale Slider */}
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('text size scale typography zoom font') ? highlightClass : 'bg-transparent'}`}>
        <div className="flex items-center justify-between mb-[0.75rem]">
          <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300">Text Size (Typography)</span>
          <span className="text-[0.7em] font-mono text-slate-500 bg-slate-100 dark:bg-white/5 px-[0.5rem] py-[0.25rem] rounded-[0.4rem]">
            {Math.round(textScale * 100)}%
          </span>
        </div>
        <input 
          type="range" min="0.7" max="1.5" step="0.05" 
          value={textScale} onChange={(e) => setTextScale(Number(e.target.value))}
          className="w-full h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" 
        />
      </div>

      {/* Global UI Scale Slider */}
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('ui size scale zoom padding boxes layout interface') ? highlightClass : 'bg-transparent'}`}>
        <div className="flex items-center justify-between mb-[0.75rem]">
          <span className="text-[0.85em] font-bold text-slate-700 dark:text-zinc-300">UI Size (Boxes & Padding)</span>
          <span className="text-[0.7em] font-mono text-slate-500 bg-slate-100 dark:bg-white/5 px-[0.5rem] py-[0.25rem] rounded-[0.4rem]">
            {Math.round(uiScale * 100)}%
          </span>
        </div>
        <input 
          type="range" min="0.7" max="1.3" step="0.05" 
          value={uiScale} onChange={(e) => setUiScale(Number(e.target.value))}
          className="w-full h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500" 
        />
      </div>

      {/* Eye Care Filter */}
      <div className={`p-4 rounded-[1.25rem] transition-all duration-300 ${isMatch('eye care filter strain yellow night mode intensity') ? highlightClass : 'bg-transparent'}`}>
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
  );
}