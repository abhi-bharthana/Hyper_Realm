import React, { useState, useEffect, useCallback } from 'react';
import { Library, ChevronDown, ChevronUp, ShieldAlert, Loader2 } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { type } from '@tauri-apps/plugin-os';
import { audioDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import MusicPlayerUI from './MusicPlayerUI';
import MusicCollection from './musicCollection/MusicCollection';
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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [touchStartY, setTouchStartY] = useState(0);

  const handleGlobalTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleGlobalTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;

    if (deltaY > 60 && !isLibraryOpen) {
      setIsLibraryOpen(true);
      setTouchStartY(0);
    }
    else if (deltaY < -60 && isLibraryOpen) {
      setIsLibraryOpen(false);
      setTouchStartY(0);
    }
  };

  const requestPermissions = useCallback(async () => {
    setHasPermission(null);
    try {
      const osType = await type();
      if (osType === 'android') {
        try {
          const granted = await invoke<boolean>('request_audio_permissions');
          if (granted) { setHasPermission(true); return; }
        } catch (e) {}
        try {
          const defaultAudioPath = await audioDir();
          await readDir(defaultAudioPath);
          setHasPermission(true);
        } catch (fsError) {
          setHasPermission(false);
        }
      } else { setHasPermission(true); }
    } catch (error) { setHasPermission(true); }
  }, []);

  useEffect(() => { requestPermissions(); }, [requestPermissions]);

  if (hasPermission === null) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0a0a0c]">
        <Loader2 className="w-10 h-10 text-slate-400 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Initializing Hyper_Audio Engine...</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 dark:bg-[#0a0a0c]"
      onTouchStart={handleGlobalTouchStart}
      onTouchMove={handleGlobalTouchMove}
    >
      <SleepTimerEngine />
      <GlobalProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      {/* 🚀 GPU-ACCELERATED AMBIENT GLOW */}
      {currentTrack?.coverUrl && hasPermission && (
        <div
          className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.15] bg-cover bg-center transition-all duration-1000 transform-gpu"
          style={{ 
            backgroundImage: `url(${currentTrack.coverUrl})`,
            filter: 'blur(3rem) saturate(150%)', 
            transform: 'scale(1.2) translateZ(0)',
            willChange: 'transform, opacity'
          }}
        />
      )}

      {/* PERMISSION SCREEN */}
      {hasPermission === false && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/95 dark:bg-[#0a0a0c]/95 backdrop-blur-xl p-6 text-center animate-in zoom-in-95 duration-300">
          <ShieldAlert className="w-16 h-16 text-rose-500 mb-4 drop-shadow-[0_0_1.5rem_rgba(244,63,94,0.6)]" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Storage Access Needed</h2>
          <button onClick={requestPermissions} className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-semibold hover:scale-105 active:scale-95 transition-all mt-4">
            Grant System Permission
          </button>
        </div>
      )}

      {/* MAIN PLAYER AREA */}
      <div className="flex-1 flex flex-col h-full relative z-10 w-full overflow-hidden">
        <div className="absolute top-10 md:top-8 right-6 z-40 flex items-center gap-3">
          <SourceToggle currentMode={syncMode} onModeChange={setSyncMode} onOpenProfile={() => setIsProfileModalOpen(true)} />
          <button onClick={() => setIsLibraryOpen(true)} className="md:hidden p-2.5 bg-black/30 dark:bg-white/10 backdrop-blur-xl hover:bg-black/50 rounded-full text-white transition-all active:scale-95 shadow-xl">
            <Library className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden pt-12 relative flex flex-col">
          <MusicPlayerUI />
          
          {/* Swipe Up Hint */}
          {!isLibraryOpen && (
            <div className="absolute bottom-6 md:hidden left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 animate-pulse pointer-events-none">
              <ChevronUp className="w-5 h-5 text-slate-500 dark:text-white mb-[-4px]" />
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500 dark:text-white">Library</span>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 60FPS LIBRARY DRAWER (Solid Colors, No Blur) */}
      <div className={`
        absolute md:relative z-50 md:z-10 bottom-0 md:bottom-auto right-0
        w-full md:w-[24rem] shrink-0 h-[85vh] md:h-full
        bg-slate-50 dark:bg-[#0a0a0c] md:bg-transparent
        border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10
        transition-transform duration-300 ease-out transform-gpu will-change-transform
        ${isLibraryOpen ? 'translate-y-0 shadow-[0_-1rem_3rem_rgba(0,0,0,0.8)]' : 'translate-y-full md:translate-y-0 shadow-none'}
        rounded-t-[2rem] md:rounded-none
        flex flex-col
      `}>
        <div className="md:hidden flex items-center justify-center p-[1.2rem] cursor-pointer relative" onClick={() => setIsLibraryOpen(false)}>
          <div className="w-[3.5rem] h-[0.35rem] bg-slate-300 dark:bg-white/20 rounded-full" />
          <button className="absolute right-[1.5rem] top-[1rem] p-[0.5rem] bg-slate-200/50 dark:bg-white/10 rounded-full text-slate-600 dark:text-white/70">
            <ChevronDown className="w-[1.2rem] h-[1.2rem]" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <MusicCollection />
        </div>
      </div>

      {/* 🚀 LAG-FREE OVERLAY (Opacity transition instead of unmounting) */}
      <div 
        className={`md:hidden absolute inset-0 bg-black/70 z-40 transition-opacity duration-300 transform-gpu will-change-[opacity] ${
          isLibraryOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsLibraryOpen(false)}
      />
    </div>
  );
}