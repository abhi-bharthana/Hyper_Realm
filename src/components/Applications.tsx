import React from 'react';
import { AppCard } from './AppCard';
import { Globe, Music, Video } from 'lucide-react';
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
  ];

  // Dynamic grid mapping
  const gridGaps = {
    tight: 'gap-x-4 sm:gap-x-6 gap-y-6',
    normal: 'gap-x-8 sm:gap-x-12 gap-y-12',
    relaxed: 'gap-x-12 sm:gap-x-20 gap-y-16',
  };

  return (
    <div className="w-full h-full flex flex-col items-start justify-start pt-4 sm:pt-6">
      <div className="w-full max-w-5xl flex overflow-x-auto hide-scrollbar pb-8">
        <div className="min-w-full h-auto flex justify-start px-4 pt-6">
          
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