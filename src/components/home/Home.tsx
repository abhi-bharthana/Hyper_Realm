import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import HomeSettings from './HomeSettings';
import { useAppStore } from '../../store/useAppStore';

export default function Home() {
  const { homeShowClock, homeClockSize, homeClockPosition } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getClockContainerClass = () => {
    switch (homeClockPosition) {
      case 'top': return 'justify-start pt-12 md:pt-20';
      case 'bottom': return 'justify-end pb-12 md:pb-20';
      default: return 'justify-center'; 
    }
  };

  const getClockTextClass = () => {
    switch (homeClockSize) {
      case 'small': return 'text-5xl md:text-7xl';
      case 'large': return 'text-8xl md:text-[10rem]';
      default: return 'text-6xl md:text-8xl'; 
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col transition-all duration-500">
      
      <style>{`
        .modern-scroll::-webkit-scrollbar { width: 14px; }
        .modern-scroll::-webkit-scrollbar-track { background: transparent; margin-block: 24px; }
        .modern-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(150, 150, 150, 0.25);
          border-radius: 10px;
          border: 4px solid transparent; 
          background-clip: padding-box; 
        }
        .modern-scroll::-webkit-scrollbar-thumb:hover { background-color: rgba(150, 150, 150, 0.5); }
      `}</style>

      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 right-6 p-3 bg-neutral-200/50 hover:bg-neutral-300/80 dark:bg-black/40 dark:hover:bg-black/70 backdrop-blur-md rounded-full shadow-lg transition-all z-10"
      >
        <Settings className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
      </button>

      {homeShowClock && (
        <div className={`flex flex-col items-center flex-1 p-6 ${getClockContainerClass()}`}>
          <h1 className={`font-bold text-neutral-900 dark:text-white tracking-tighter drop-shadow-xl ${getClockTextClass()}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
        </div>
      )}

      {isSettingsOpen && (
        // FIX: Changed 'absolute' to 'fixed' and increased z-index to 'z-[100]'
        // Ab ye overlay bounding box se nikal kar poori screen ko cleanly dim karega
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/40 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] modern-scroll shadow-2xl bg-white/95 dark:bg-[#111111]/95 border border-neutral-200 dark:border-neutral-800 backdrop-blur-2xl">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-5 right-5 z-10 p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>
            <HomeSettings onClose={() => setIsSettingsOpen(false)} />
          </div>

        </div>
      )}
    </div>
  );
}