import React, { useState } from 'react';
import { Library, ChevronDown } from 'lucide-react';
import MusicPlayerUI from './MusicPlayerUI';
import MusicCollection from './MusicCollection';
import SleepTimerEngine from './SleepTimerEngine';
import { useMusicStore } from '../../../store/useMusicStore';

export default function MusicApp() {
  const { playlist, currentTrackIndex } = useMusicStore();
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;
  
  // 🔥 Mobile ke liye Native Bottom Sheet Drawer State
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div className="w-full h-full flex relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 dark:bg-[#0a0a0c]">
      
      {/* Invisible Audio Engine */}
      <SleepTimerEngine />

      {/* Background Ambient Glow */}
      {currentTrack?.coverUrl && (
        <div
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.12] bg-cover bg-center transition-all duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})`, filter: 'blur(4rem)' }}
        />
      )}

      {/* 🟢 MAIN PLAYER AREA (Takes Full Screen on Mobile) */}
      <div className="flex-1 flex flex-col h-full relative z-10 w-full">
        {/* Mobile Top Navigation Bar */}
        <div className="md:hidden flex items-center justify-between p-[1.5rem] pb-0 z-50">
           <span className="text-[0.7rem] font-bold text-slate-500 uppercase tracking-widest">Now Playing</span>
           <button 
             onClick={() => setIsLibraryOpen(true)} 
             className="p-[0.6rem] bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-full transition-all active:scale-95"
           >
             <Library className="w-[1.2rem] h-[1.2rem] text-slate-800 dark:text-white" />
           </button>
        </div>

        <MusicPlayerUI />
      </div>

      {/* 🔵 LIBRARY AREA (Sidebar on PC, Bottom Sheet Drawer on Mobile) */}
      <div className={`
        absolute md:relative z-50 md:z-10
        bottom-0 md:bottom-auto right-0
        w-full md:w-[24rem] shrink-0
        h-[85vh] md:h-full
        bg-slate-100/95 dark:bg-[#0f0f13]/95 backdrop-blur-3xl md:bg-transparent md:backdrop-blur-none
        border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10
        transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isLibraryOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
        rounded-t-[2rem] md:rounded-none shadow-[0_-1rem_4rem_rgba(0,0,0,0.5)] md:shadow-none
        flex flex-col
      `}>
         {/* Mobile Drag Handle & Close Button */}
         <div 
           className="md:hidden flex items-center justify-center p-[1rem] cursor-pointer relative" 
           onClick={() => setIsLibraryOpen(false)}
         >
            <div className="w-[3rem] h-[0.35rem] bg-slate-300 dark:bg-white/20 rounded-full" />
            <button className="absolute right-[1.5rem] top-[1rem] p-[0.4rem] bg-slate-200/50 dark:bg-white/10 rounded-full text-slate-500 dark:text-white/50">
              <ChevronDown className="w-[1.2rem] h-[1.2rem]" />
            </button>
         </div>

         {/* Wrapper taaki collection scrollable rahe */}
         <div className="flex-1 overflow-hidden flex flex-col">
           <MusicCollection />
         </div>
      </div>

      {/* 🌑 Mobile Overlay Background (Dim effect when Library is open) */}
      {isLibraryOpen && (
        <div
          className="md:hidden absolute inset-0 bg-black/60 z-40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsLibraryOpen(false)}
        />
      )}

    </div>
  );
}