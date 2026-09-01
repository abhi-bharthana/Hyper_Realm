import React from 'react';
import MusicPlayerUI from './MusicPlayerUI';
import MusicCollection from './MusicCollection';
import { useMusicStore } from '../../../store/useMusicStore';

export default function MusicApp() {
  const { playlist, currentTrackIndex } = useMusicStore();
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  return (
    <div className="w-full h-full flex flex-col md:flex-row relative overflow-hidden animate-in fade-in duration-500 bg-slate-50 dark:bg-[#0a0a0c]">
      {/* Background Ambient Glow */}
      {currentTrack?.coverUrl && (
        <div 
          className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.12] bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentTrack.coverUrl})`, filter: 'blur(60px)' }}
        />
      )}
      
      {/* Left Side: Modular Player */}
      <MusicPlayerUI />
      
      {/* Right Side: Modular Library */}
      <MusicCollection />
    </div>
  );
}