import React, { useState, useEffect } from 'react';
import { Library, ChevronDown, ShieldAlert } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { type } from '@tauri-apps/plugin-os';

import MusicPlayerUI from './MusicPlayerUI';
import MusicCollection from './MusicCollection';
import SleepTimerEngine from './SleepTimerEngine';
import { useMusicStore } from '../../../store/useMusicStore';
import { SourceToggle } from '../../Shared/SourceToggle';
import { GlobalProfileModal } from '../../Shared/GlobalProfileModal'; 

export default function MusicApp() {
  const { playlist, currentTrackIndex } = useMusicStore();
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;
  
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [syncMode, setSyncMode] = useState<'local' | 'cloud'>('local');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // 🔥 ANDROID SPECIFIC STATES
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      try {
        const osType = await type(); // Detect OS at runtime
        
        if (osType === 'android') {
          // Tauri backend se permission status check ya request karo
          const granted = await invoke<boolean>('request_audio_permissions');
          setHasPermission(granted);
          
          if (granted) {
            console.log("📱 Android Media Permission Granted! Ready to scan.");
            // Yahan agar chaho toh auto-scan trigger kar sakte ho
          } else {
            console.warn("📱 Android Media Permission Denied.");
          }
        } else {
          // Windows/Linux/macOS par permissions automatically granted hoti hain
          setHasPermission(true);
        }
      } catch (error) {
        console.error("OS detection or Permission check failed:", error);
        setHasPermission(true); // Fallback to true so UI doesn't break on errors
      }
    };

    checkAndRequestPermissions();
  }, []);

  return (
    <div className="w-full h-full flex relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 dark:bg-[#0a0a0c]">
      
      {/* Invisible Audio Engine */}
      <SleepTimerEngine />

      {/* 🔥 GLOBAL PROFILE FLOATING WINDOW */}
      <GlobalProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Background Ambient Glow */}
      {currentTrack?.coverUrl && hasPermission && (
        <div
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.12] bg-cover bg-center transition-all duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})`, filter: 'blur(4rem)' }}
        />
      )}

      {/* 🔴 PERMISSION DENIED OVERLAY (Only for Android) */}
      {hasPermission === false && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-[#0a0a0c]/90 backdrop-blur-md p-6 text-center">
          <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 drop-shadow-[0_0_1rem_rgba(244,63,94,0.5)]" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Storage Access Needed</h2>
          <p className="text-slate-500 dark:text-white/60 mb-6 max-w-sm">
            Hyper_Realm needs permission to access your audio files to play local music on Android.
          </p>
          <button 
            onClick={() => window.location.reload()} // Reloading will re-trigger the prompt
            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Grant Permission
          </button>
        </div>
      )}

      {/* 🟢 MAIN PLAYER AREA */}
      <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
        
        {/* 🔥 FLOATING PILL & MOBILE LIBRARY BUTTON */}
        <div className="absolute top-4 right-6 z-40 flex items-center gap-2">
          <SourceToggle 
            currentMode={syncMode} 
            onModeChange={setSyncMode} 
            onOpenProfile={() => setIsProfileModalOpen(true)} 
          />

          {/* Mobile Library Toggle Button */}
          <button 
            onClick={() => setIsLibraryOpen(true)} 
            className="md:hidden p-2.5 bg-black/30 dark:bg-white/10 backdrop-blur-md hover:bg-black/50 dark:hover:bg-white/20 rounded-full text-white transition-all active:scale-95 border border-white/10 shadow-lg"
          >
            <Library className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <MusicPlayerUI />
        </div>
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
         <div 
           className="md:hidden flex items-center justify-center p-[1rem] cursor-pointer relative" 
           onClick={() => setIsLibraryOpen(false)}
         >
            <div className="w-[3rem] h-[0.35rem] bg-slate-300 dark:bg-white/20 rounded-full" />
            <button className="absolute right-[1.5rem] top-[1rem] p-[0.4rem] bg-slate-200/50 dark:bg-white/10 rounded-full text-slate-500 dark:text-white/50">
              <ChevronDown className="w-[1.2rem] h-[1.2rem]" />
            </button>
         </div>

         <div className="flex-1 overflow-hidden flex flex-col">
           <MusicCollection />
         </div>
      </div>

      {/* 🌑 Mobile Overlay Background */}
      {isLibraryOpen && (
        <div
          className="md:hidden absolute inset-0 bg-black/60 z-40 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
          onClick={() => setIsLibraryOpen(false)}
        />
      )}

    </div>
  );
}