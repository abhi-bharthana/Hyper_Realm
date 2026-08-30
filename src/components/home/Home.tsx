import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import HomeSettings from './HomeSettings';
import { useAppStore } from '../../store/useAppStore';

export default function Home() {
  const [time, setTime] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const { homeShowClock, homeClockSize, homeClockPosition } = useAppStore();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getClockPositionClass = () => {
    if (homeClockPosition === 'top') return 'justify-start pt-24 md:pt-32';
    if (homeClockPosition === 'bottom') return 'justify-end pb-24 md:pb-32';
    return 'justify-center';
  };

  const getClockSizeClass = () => {
    if (homeClockSize === 'small') return 'text-6xl md:text-8xl';
    if (homeClockSize === 'large') return 'text-[8rem] md:text-[14rem]';
    return 'text-[6rem] md:text-[10rem]'; // Medium default
  };

  return (
    <div className={`relative h-full w-full flex flex-col items-center p-8 select-none ${getClockPositionClass()}`}>
      
      {/* Settings Icon - Extreme Top Right */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-2 right-2 z-20 p-3 rounded-2xl text-slate-800 hover:text-black dark:text-zinc-200 dark:hover:text-white bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/50 backdrop-blur-md border border-white/20 dark:border-white/10 transition-all shadow-lg"
        title="Settings"
      >
        <Settings size={22} />
      </button>
      
      {/* Live Clock with dynamic classes */}
      {homeShowClock && (
        <div className="z-10 pointer-events-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          <h1 className={`font-light tracking-tight font-mono transition-all duration-500 ${getClockSizeClass()}`}>
            {time || '14:59'}
          </h1>
        </div>
      )}

      {/* Settings Modal */}
      <HomeSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}