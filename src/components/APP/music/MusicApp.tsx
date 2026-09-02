import React from 'react';
import MusicPlayerUI from './MusicPlayerUI';
import MusicCollection from './MusicCollection';
import SleepTimerEngine from './SleepTimerEngine';
import { useMusicStore } from '../../../store/useMusicStore';

export default function MusicApp() {
  const { playlist, currentTrackIndex } = useMusicStore();
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50 dark:bg-[#0a0a0c]">
      
      {/* 🌙 Invisible Audio Engine for Sleep Timer & Smooth Fade Outs */}
      <SleepTimerEngine />

      {/* Background Ambient Glow */}
      {currentTrack?.coverUrl && (
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.12] bg-cover bg-center transition-all duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})`, filter: 'blur(4rem)' }}
        />
      )}
      
      {/* Left Side: Modular Player (Strict Scaled) */}
      <MusicPlayerUI />
      
      {/* Right Side: Modular Library */}
      <MusicCollection />
    </div>
  );
}