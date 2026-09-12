import React, { useRef } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useGalleryPhysics } from './hooks/useGalleryPhysics';
import ProgressBar from './ui/ProgressBar';
import PlaybackControls from './ui/PlaybackControls';
import TrackCard from './ui/TrackCard';

export default function MusicPlayerUI() {
  const playlist = useMusicStore((state) => state.playlist);
  const currentTrackIndex = useMusicStore((state) => state.currentTrackIndex);
  const isPlaying = useMusicStore((state) => state.isPlaying);
  // 🔥 CRASH FIX: useMusicStore se 'playTrack' nikala badle mein 'setCurrentTrackIndex' ke
  const playTrack = useMusicStore((state) => state.playTrack);

  const containerRef = useRef<HTMLDivElement>(null);
  const physics = useGalleryPhysics(containerRef);
  
  const validIndex = currentTrackIndex !== null ? currentTrackIndex : 0;

  // 🔥 Mismatched Song & Crash Fix
  const handleNextClick = () => { 
    if (playlist.length) {
      physics.snapToTarget(-1); 
      // Sahi function call kiya jisse backend aur store safely update honge
      playTrack((validIndex + 1) % playlist.length);
    }
  };
  
  const handlePrevClick = () => { 
    if (playlist.length) {
      physics.snapToTarget(1); 
      playTrack((validIndex - 1 + playlist.length) % playlist.length);
    }
  };
  
  useKeyboardControls(handleNextClick, handlePrevClick);

  const OFFSETS = Array.from({ length: 31 }, (_, i) => i - 15);

  const getTrack = (offset: number) => {
    if (!playlist.length) return null;
    let index = (validIndex + offset) % playlist.length;
    if (index < 0) index += playlist.length;
    return playlist[index];
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center relative z-10 p-[2rem] min-w-0 overflow-hidden w-full h-full"
      onWheel={physics.handleWheel}
      onTouchStart={physics.handleTouchStart}
      onTouchMove={physics.handleTouchMove}
      onTouchEnd={physics.handleTouchEnd}
    >
      {/* 🌟 VIRTUALIZED CONTINUOUS GALLERY 🌟 */}
      <div ref={containerRef} className="relative flex items-center justify-center w-full flex-1 min-h-[26rem] max-h-[35rem] mb-[1rem]">
        {OFFSETS.map((offset) => {
          const track = getTrack(offset);
          const width = containerRef.current?.offsetWidth || 500;
          const currentVisualPos = offset + (physics.dragOffset / width);
          const isCenter = Math.abs(currentVisualPos) < 0.5;

          return (
            <TrackCard 
              key={offset} 
              track={track} 
              isPlaying={isPlaying && offset === 0} 
              isCenter={isCenter} 
              style={physics.getCardStyle(offset)} 
            />
          );
        })}
      </div>

      <div className="w-full max-w-[26rem] flex flex-col items-center px-[1rem] z-[60] shrink-0 relative">
        <ProgressBar />
        <PlaybackControls onNext={handleNextClick} onPrev={handlePrevClick} />
      </div>
    </div>
  );
}