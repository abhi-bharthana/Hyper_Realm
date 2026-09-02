import React, { useState, useEffect } from 'react';
import { Moon, Clock, X, Zap, ShieldAlert } from 'lucide-react';
import { useMusicStore } from '../../../store/useMusicStore';

export default function SleepTimerMenu() {
  const { sleepTimer, setSleepTimer, cancelSleepTimer } = useMusicStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mins, setMins] = useState(20);
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

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-[0.5rem] rounded-full transition-all duration-300 ${
          sleepTimer.active || isOpen 
            ? 'bg-indigo-500/20 text-indigo-500' 
            : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
        }`}
        title="Sleep Timer"
      >
        <Moon className={`w-[1.2rem] h-[1.2rem] ${sleepTimer.active ? 'fill-indigo-500 animate-pulse' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-[1rem] right-0 w-[18rem] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.25rem] p-[1rem] shadow-[0_1rem_3rem_rgba(0,0,0,0.3)] z-50 animate-in fade-in slide-in-from-bottom-2">
          
          <div className="flex items-center justify-between mb-[1rem]">
            <h4 className="text-[0.85em] font-bold text-slate-800 dark:text-white flex items-center gap-[0.5rem]">
              <Clock className="w-[1rem] h-[1rem] text-indigo-500" /> Sleep Timer
            </h4>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
              <X className="w-[1rem] h-[1rem]" />
            </button>
          </div>

          {sleepTimer.active ? (
            <div className="flex flex-col items-center justify-center p-[1.5rem] bg-indigo-500/10 rounded-[1rem] border border-indigo-500/20 gap-[0.75rem]">
              <span className="text-[0.75em] font-bold uppercase tracking-wider text-indigo-500">Timer Active</span>
              <span className="text-[2em] font-mono font-black text-slate-900 dark:text-white leading-none">{timeLeftStr}</span>
              <span className="text-[0.7em] text-slate-500">
                {sleepTimer.mode === 'strict' ? 'Will stop exactly at 0:00' : 'Will stop after current track ends'}
              </span>
              <button 
                onClick={cancelSleepTimer}
                className="mt-[0.5rem] px-[1rem] py-[0.4rem] bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[0.75em] font-bold rounded-[0.5rem] transition-colors"
              >
                Cancel Timer
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[1rem]">
              
              {/* Time Selector */}
              <div>
                <span className="text-[0.65em] font-bold text-slate-500 uppercase tracking-wider mb-[0.5rem] block">Duration (Minutes)</span>
                <div className="flex items-center gap-[0.5rem]">
                  {[15, 20, 30, 60].map(m => (
                    <button 
                      key={m} onClick={() => setMins(m)}
                      className={`flex-1 py-[0.4rem] text-[0.8em] font-bold rounded-[0.5rem] transition-colors ${mins === m ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selector */}
              <div>
                <span className="text-[0.65em] font-bold text-slate-500 uppercase tracking-wider mb-[0.5rem] block">Stop Behavior</span>
                <div className="grid grid-cols-2 gap-[0.5rem]">
                  <button 
                    onClick={() => setMode('strict')}
                    className={`flex flex-col p-[0.75rem] rounded-[0.75rem] border transition-all ${mode === 'strict' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-500'}`}
                  >
                    <ShieldAlert className="w-[1.2rem] h-[1.2rem] mb-[0.25rem]" />
                    <span className="text-[0.75em] font-bold">Strict</span>
                    <span className="text-[0.6em] mt-[0.2rem] leading-tight opacity-80">Stop exactly on time</span>
                  </button>
                  <button 
                    onClick={() => setMode('dynamic')}
                    className={`flex flex-col p-[0.75rem] rounded-[0.75rem] border transition-all ${mode === 'dynamic' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-500'}`}
                  >
                    <Zap className="w-[1.2rem] h-[1.2rem] mb-[0.25rem]" />
                    <span className="text-[0.75em] font-bold">Dynamic</span>
                    <span className="text-[0.6em] mt-[0.2rem] leading-tight opacity-80">Finish playing track</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setSleepTimer(mins, mode)}
                className="w-full py-[0.75rem] bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-[0.85em] rounded-[0.75rem] hover:scale-[1.02] active:scale-95 transition-transform shadow-lg mt-[0.5rem]"
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