import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import HomeSettings from './HomeSettings';
import { useAppStore } from '../../store/useAppStore';

export default function Home() {
  const [time, setTime] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Naya Tarika: Individual states fetch karo taaki UI hamesha render ho
  const homeShowClock = useAppStore(state => state.homeShowClock);
  const homeBackgroundType = useAppStore(state => state.homeBackgroundType);
  const homeBackgroundValue = useAppStore(state => state.homeBackgroundValue);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Background style generator
  const getBgStyle = () => {
    if (homeBackgroundType === 'solid') return { backgroundColor: homeBackgroundValue };
    if (homeBackgroundType === 'gradient') return { backgroundImage: homeBackgroundValue };
    if (homeBackgroundType === 'image') return { backgroundImage: `url(${homeBackgroundValue})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    return {}; // default
  };

  return (
    <div 
      className="relative h-full w-full overflow-hidden flex flex-col items-center p-8 select-none transition-all duration-500 rounded-3xl"
      style={getBgStyle()}
    >
      
      {/* Default Background sirf tab jab 'default' selected ho */}
      {homeBackgroundType === 'default' && (
        <>
          <div className="absolute inset-0 bg-slate-50 dark:bg-[#0a0a0c] -z-20 transition-colors" />
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 -z-10">
            <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] bg-gradient-to-br from-slate-300/50 dark:from-zinc-700/20 to-transparent blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-slate-300/50 dark:from-zinc-600/20 to-transparent blur-[140px] rounded-full" />
          </div>
        </>
      )}

      {/* Settings Icon - Extreme Top Right */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 z-20 p-3 rounded-2xl text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-white/30 dark:bg-black/30 hover:bg-white/60 dark:hover:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all shadow-sm"
        title="Settings"
      >
        <Settings size={20} />
      </button>
      
      {/* Clock Toggle Logic */}
      {homeShowClock && (
        <div className="mt-20 z-10">
          <h1 className="text-7xl md:text-9xl font-light tracking-tight text-slate-800 dark:text-white font-mono drop-shadow-xl transition-all">
            {time || '14:59'}
          </h1>
        </div>
      )}

      <HomeSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}