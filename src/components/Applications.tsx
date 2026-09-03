import React from 'react';
import { AppCard } from './AppCard';
import { Globe, Music, Video, Mic } from 'lucide-react'; // 🎙️ Mic icon imported
import { useAppStore } from '../store/useAppStore'; 

export const Applications = () => {
  const launchApp = useAppStore((state) => state.launchApp); 
  
  // Store se settings fetch kar rahe hain
  const appIconSize = useAppStore((state) => state.appIconSize);
  const appGridSpacing = useAppStore((state) => state.appGridSpacing);
  const showAppNames = useAppStore((state) => state.showAppNames);

  const activeApps = [
    { id: 'hyper-surf', name: 'Browser', icon: <Globe /> },
    { id: 'hyper-music', name: 'Music', icon: <Music /> },
    { id: 'hyper-media', name: 'Video', icon: <Video /> },
    { id: 'hyper-recorder', name: 'AI Recorder', icon: <Mic /> }, // 🚀 Added here!
  ];

  // Dynamic grid mapping scaled with 'rem' for UI synchronization
  const gridGaps = {
    tight: 'gap-x-[1rem] sm:gap-x-[1.5rem] gap-y-[1.5rem]',
    normal: 'gap-x-[2rem] sm:gap-x-[3rem] gap-y-[3rem]',
    relaxed: 'gap-x-[3rem] sm:gap-x-[5rem] gap-y-[4rem]',
  };

  return (
    <div className="w-full h-full flex flex-col items-start justify-start pt-[1rem] sm:pt-[1.5rem]">
      <div className="w-full max-w-[64rem] flex overflow-x-auto hide-scrollbar pb-[2rem]">
        <div className="min-w-full h-auto flex justify-start px-[1rem] pt-[1.5rem]">
          
          {/* Grid setup mapped with appGridSpacing state */}
          <div className={`flex flex-wrap justify-start h-max w-full ${gridGaps[appGridSpacing]}`}>
            {activeApps.map((app) => (
              <AppCard 
                key={app.id} 
                name={app.name} 
                icon={app.icon} 
                size={appIconSize}
                showName={showAppNames}
                onClick={() => launchApp(app.id)} 
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};