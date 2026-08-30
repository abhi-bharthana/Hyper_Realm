import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import HomeSettings from './HomeSettings';
import { useAppStore } from '../../store/useAppStore';

export default function Home() {
  const { homeShowClock, homeClockSize, homeClockPosition } = useAppStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Clock ki styling position ke hisaab se
  const getClockContainerClass = () => {
    switch (homeClockPosition) {
      case 'top': return 'justify-start pt-12';
      case 'bottom': return 'justify-end pb-12';
      default: return 'justify-center'; // center
    }
  };

  const getClockTextClass = () => {
    switch (homeClockSize) {
      case 'small': return 'text-4xl md:text-5xl';
      case 'large': return 'text-7xl md:text-9xl';
      default: return 'text-6xl md:text-8xl'; // medium
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col p-6">
      
      {/* Settings Toggle Button - Top Right corner pe hoga */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-6 right-6 p-3 bg-slate-200/50 hover:bg-slate-300/80 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md rounded-full shadow-lg transition-all z-10"
      >
        <Settings className="w-6 h-6 text-slate-800 dark:text-white" />
      </button>

      {/* Main Home Content (e.g., Clock) */}
      {homeShowClock && (
        <div className={`flex flex-col items-center flex-1 ${getClockContainerClass()}`}>
          <h1 className={`font-bold text-slate-900 dark:text-white tracking-tighter drop-shadow-md ${getClockTextClass()}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </h1>
        </div>
      )}

      {/* Settings Modal (Overlay) - Jab button click hoga tabhi ye dikhega */}
      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors shadow-sm"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            
            {/* Tera HomeSettings Component */}
            <HomeSettings />
            
          </div>
        </div>
      )}

    </div>
  );
}