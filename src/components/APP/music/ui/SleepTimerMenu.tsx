import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Clock, X, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { useMusicStore } from '../../../../store/useMusicStore';

export default function SleepTimerMenu() {
  // Fallback to empty array if timerHistory isn't initialized in old store versions
  const { sleepTimer, setSleepTimer, cancelSleepTimer, timerHistory = [] } = useMusicStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mins, setMins] = useState(30); 
  const [mode, setMode] = useState<'strict' | 'dynamic'>('dynamic');
  const [timeLeftStr, setTimeLeftStr] = useState('');

  // Live Countdown Text
  useEffect(() => {
    if (!sleepTimer.active || !sleepTimer.endTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, sleepTimer.endTime! - Date.now());
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setTimeLeftStr(`${m}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimer]);

  // 🧠 SMART AI SUGGESTION ENGINE
  const smartSuggestions = useMemo(() => {
    // Agar user naya hai (< 3 uses), toh basic defaults do
    if (timerHistory.length < 3) return [5, 15, 30, 60];

    const freq: Record<number, number> = {};
    timerHistory.forEach(t => freq[t] = (freq[t] || 0) + 1);

    // 1. Most Frequent (Jo baar baar lagaya ho)
    const frequent = Object.entries(freq)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => Number(t));

    // 2. Recent Average (Jaise 8 aur 12 ka 10 karna)
    const recent = timerHistory.slice(0, 4);
    const avg = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
    // Round to nearest 5 for cleaner UI (e.g., 9.5 -> 10)
    const roundedAvg = Math.round(avg / 5) * 5 || avg; 

    // Combine them uniquely
    let suggestions = new Set<number>([...frequent, roundedAvg]);
    
    // Fill remaining spots with logical defaults taaki hamesha 4 options rahein
    const defaults = [5, 15, 30, 60];
    let i = 0;
    while (suggestions.size < 4 && i < defaults.length) {
      suggestions.add(defaults[i]);
      i++;
    }

    // Sort ascending for UI (e.g., 10, 15, 30, 45)
    return Array.from(suggestions).slice(0, 4).sort((a, b) => a - b);
  }, [timerHistory]);

  const isSmartActive = timerHistory.length >= 3;

  return (
    <div className="relative">
      
      {/* 🌙 Floating 'Z' Animation Engine */}
      {sleepTimer.active && (
        <div className="absolute -top-[1.5rem] left-1/2 -translate-x-1/2 pointer-events-none z-50">
           <style>{`
             @keyframes floatZ {
               0% { opacity: 0; transform: translateY(0) scale(0.5); }
               20% { opacity: 1; }
               80% { opacity: 1; }
               100% { opacity: 0; transform: translateY(-25px) scale(1.2); }
             }
             .z-float-1 { animation: floatZ 2.5s infinite ease-out; }
             .z-float-2 { animation: floatZ 2.5s infinite ease-out 0.8s; }
             .z-float-3 { animation: floatZ 2.5s infinite ease-out 1.6s; }
           `}</style>
           <span className="absolute z-float-1 text-indigo-500 font-black text-[0.8em] -ml-4">z</span>
           <span className="absolute z-float-2 text-indigo-400 font-black text-[1em] ml-1 -mt-2">Z</span>
           <span className="absolute z-float-3 text-indigo-300 font-black text-[0.6em] -ml-1 -mt-4">z</span>
        </div>
      )}

      {/* Sleep Timer Icon Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-[0.75rem] rounded-full transition-all active:scale-95 ${sleepTimer.active || isOpen ? 'bg-indigo-500/20 text-indigo-500' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
      >
        <Moon className="w-[1.4rem] h-[1.4rem]" />
      </button>

      {/* 🧊 FROSTED GLASS MENU BOX */}
      {isOpen && (
        <div className="absolute bottom-full mb-[1rem] left-1/2 -translate-x-1/2 w-[18rem] bg-white/50 dark:bg-[#0a0a0c]/50 backdrop-blur-3xl border border-white/60 dark:border-white/10 rounded-[1.5rem] p-[1.25rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.4)] z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 text-left">
          
          <div className="flex items-center justify-between mb-[1.25rem]">
            <h4 className="text-[0.85em] font-bold text-slate-800 dark:text-white flex items-center gap-[0.5rem]">
              <Clock className="w-[1.2rem] h-[1.2rem] text-indigo-500" /> Sleep Timer
            </h4>
            <button onClick={() => setIsOpen(false)} className="p-[0.25rem] rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-[1.2rem] h-[1.2rem]" />
            </button>
          </div>

          {sleepTimer.active ? (
             <div className="flex flex-col items-center justify-center p-[1.5rem] bg-indigo-500/10 rounded-[1rem] border border-indigo-500/20 gap-[0.75rem]">
               <span className="text-[0.75em] font-bold uppercase tracking-wider text-indigo-500">Timer Active</span>
               <span className="text-[2em] font-mono font-black text-slate-900 dark:text-white leading-none drop-shadow-md">{timeLeftStr}</span>
               <button onClick={cancelSleepTimer} className="mt-[0.5rem] px-[1rem] py-[0.5rem] bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[0.75em] font-bold rounded-[0.5rem] transition-colors">
                 Cancel Timer
               </button>
             </div>
          ) : (
            <div className="flex flex-col gap-[1.25rem]">
              
              {/* 🎚️ SMOOTH TIME SLIDER UI */}
              <div>
                <div className="flex items-end justify-between mb-[0.75rem]">
                  <span className="text-[0.65em] font-bold text-slate-500 uppercase tracking-wider block">Duration</span>
                  <span className="text-[1.5em] font-black leading-none text-indigo-500 dark:text-indigo-400 drop-shadow-sm">
                    {mins} <span className="text-[0.4em] text-slate-500 font-bold uppercase">min</span>
                  </span>
                </div>
                
                <input 
                  type="range" 
                  min="1" 
                  max="120" 
                  value={mins} 
                  onChange={(e) => setMins(Number(e.target.value))} 
                  className="w-full h-[0.4rem] bg-slate-300/50 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 shadow-inner transition-all hover:h-[0.5rem]" 
                />
                
                {/* 🤖 SMART AI QUICK SELECT BUTTONS */}
                <div className="mt-[0.75rem]">
                  <div className="flex items-center gap-1 mb-[0.4rem]">
                    {isSmartActive && <Sparkles className="w-[0.7rem] h-[0.7rem] text-indigo-500" />}
                    <span className="text-[0.55em] font-bold text-slate-500 uppercase tracking-wider">
                      {isSmartActive ? 'Recommended For You' : 'Quick Select'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-[0.4rem]">
                    {smartSuggestions.map(val => (
                      <button 
                        key={val}
                        onClick={() => setMins(val)}
                        className={`flex-1 py-[0.35rem] text-[0.75em] font-bold rounded-[0.5rem] transition-all duration-300 ${
                          mins === val 
                            ? 'bg-indigo-500 text-white shadow-md scale-105' 
                            : 'bg-white/40 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-white/10 hover:scale-105'
                        }`}
                      >
                        {val}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode Selectors */}
              <div>
                <span className="text-[0.65em] font-bold text-slate-500 uppercase tracking-wider mb-[0.5rem] block">Stop Mode</span>
                <div className="grid grid-cols-2 gap-[0.5rem]">
                  <button 
                    onClick={() => setMode('strict')} 
                    className={`flex flex-col p-[0.75rem] rounded-[1rem] border transition-all ${mode === 'strict' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'bg-white/40 dark:bg-black/20 border-white/30 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/10'}`}
                  >
                    <ShieldAlert className="w-[1.2rem] h-[1.2rem] mb-[0.25rem]" />
                    <span className="text-[0.75em] font-bold">Strict</span>
                  </button>
                  <button 
                    onClick={() => setMode('dynamic')} 
                    className={`flex flex-col p-[0.75rem] rounded-[1rem] border transition-all ${mode === 'dynamic' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'bg-white/40 dark:bg-black/20 border-white/30 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/10'}`}
                  >
                    <Zap className="w-[1.2rem] h-[1.2rem] mb-[0.25rem]" />
                    <span className="text-[0.75em] font-bold">Dynamic</span>
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => { setSleepTimer(mins, mode); setIsOpen(false); }} 
                className="w-full py-[0.8rem] bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black font-bold text-[0.9em] rounded-[1rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-indigo-500/25"
              >
                Start Timer
              </button>

            </div>
          )}
        </div>
      )}
    </div>
  );
}