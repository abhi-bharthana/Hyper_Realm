import React from 'react';
import AppCard from './AppCard';
import { useAppStore } from '../store/useAppStore';

export default function Applications() {
  const { apps } = useAppStore();

  return (
    <div className="relative w-full h-full pb-10">
      <style>{`
        @keyframes premiumPop {
          0% { 
            opacity: 0; 
            transform: translateY(20px) scale(0.96); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1);
          }
        }
        .animate-premium-pop {
          opacity: 0;
          will-change: transform, opacity; /* GPU ko pehle se batata hai ki animation aane wali hai */
          animation: premiumPop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Ambient background glow optimized with hardware acceleration */}
      <div className="absolute inset-0 -z-10 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="w-[70%] h-[70%] bg-blue-500/5 dark:bg-blue-400/5 blur-[80px] rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8 pt-4 px-2">
        {apps.map((app, index) => (
          <div 
            key={app.id} 
            className="animate-premium-pop group cursor-pointer"
            // Delay ko kam karke 60ms kar diya hai taaki animation jaldi aur smooth lage
            style={{ animationDelay: `${index * 60}ms` }} 
          >
            <div className="h-full transition-transform duration-300 ease-out group-hover:-translate-y-1.5 rounded-2xl">
              <AppCard app={app} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}