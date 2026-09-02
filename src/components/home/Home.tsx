import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import HomeSettings from './HomeSettings';
import MusicWidget from '../widgets/MusicWidget';
import { useAppStore } from '../../store/useAppStore';

export default function Home() {
  const { homeShowClock, homeClockSize, homeClockPosition } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getClockContainerClass = () => {
    switch (homeClockPosition) {
      case 'top': return 'justify-start pt-[12vh]';
      case 'bottom': return 'justify-end pb-[12vh]';
      default: return 'justify-center'; 
    }
  };

  const getClockTextClass = () => {
    // Ab text size em mein scale hoga
    switch (homeClockSize) {
      case 'small': return 'text-[5em] md:text-[7em]';
      case 'large': return 'text-[8em] md:text-[10em]';
      default: return 'text-[6em] md:text-[8em]'; 
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col transition-all duration-500">
      
      {/* Scrollbar ko bhi em scale pe lagaya gaya hai */}
      <style>{`
        .modern-scroll::-webkit-scrollbar { width: 0.6em; }
        .modern-scroll::-webkit-scrollbar-track { background: transparent; margin-block: 1em; }
        .modern-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(150, 150, 150, 0.2);
          border-radius: 1em;
          border: 0.2em solid transparent; 
          background-clip: padding-box; 
        }
        .modern-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(150, 150, 150, 0.4); }
      `}</style>

      {/* Floating Settings Button with dynamic scaling */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-[1.5em] right-[1.5em] p-[0.75em] bg-neutral-200/50 hover:bg-neutral-300/80 dark:bg-black/40 dark:hover:bg-white/10 backdrop-blur-md rounded-[1em] shadow-[0_0.5em_1em_rgba(0,0,0,0.1)] transition-all z-10 hover:scale-105 active:scale-95 border border-white/20 dark:border-white/5"
      >
        <Settings className="w-[1.2em] h-[1.2em] text-neutral-800 dark:text-neutral-200" />
      </button>

      {homeShowClock && (
        <div className={`flex flex-col items-center flex-1 p-[2em] transition-all duration-500 ${getClockContainerClass()}`}>
          <h1 className={`font-bold text-neutral-900 dark:text-white tracking-tighter drop-shadow-2xl transition-all duration-500 ${getClockTextClass()}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
        </div>
      )}

      {/* Floating Music Widget */}
      <MusicWidget />

      {/* TIGHT OVERLAY MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/40 dark:bg-black/60 backdrop-blur-md p-[1.5em] animate-in fade-in duration-300">
          
          <div className="relative w-full max-w-[45em] max-h-[85vh] overflow-y-auto rounded-[2em] modern-scroll shadow-[0_1em_3em_rgba(0,0,0,0.3)] bg-white/95 dark:bg-[#0a0a0a]/95 border border-neutral-200/50 dark:border-white/10 backdrop-blur-2xl transition-all">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-[1.5em] right-[1.5em] z-10 p-[0.5em] bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-[0.75em] transition-all hover:scale-105 active:scale-95"
            >
              <X className="w-[1.2em] h-[1.2em] text-neutral-600 dark:text-neutral-300" />
            </button>
            <HomeSettings onClose={() => setIsSettingsOpen(false)} />
          </div>

        </div>
      )}
    </div>
  );
}