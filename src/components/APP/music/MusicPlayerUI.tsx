import React, { useRef } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { useGalleryPhysics } from './hooks/useGalleryPhysics';
import ProgressBar from './ui/ProgressBar';
import PlaybackControls from './ui/PlaybackControls';
import TrackCard from './ui/TrackCard';

export default function MusicPlayerUI() {
  const { playlist, currentTrackIndex, isPlaying } = useMusicStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 🧠 Import separated brains
  const physics = useGalleryPhysics(containerRef);
  
  const handleNextClick = () => { if (playlist.length) physics.snapToTarget(-1); };
  const handlePrevClick = () => { if (playlist.length) physics.snapToTarget(1); };
  
  useKeyboardControls(handleNextClick, handlePrevClick);

  // 31 Virtual Cards
  const OFFSETS = Array.from({ length: 31 }, (_, i) => i - 15);
  const validIndex = currentTrackIndex !== null ? currentTrackIndex : 0;

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

      {/* 🔥 FIX: Changed z-20 to z-[60] and added relative to break out of trapping */}
      <div className="w-full max-w-[26rem] flex flex-col items-center px-[1rem] z-[60] shrink-0 relative">
        <ProgressBar />
        <PlaybackControls onNext={handleNextClick} onPrev={handlePrevClick} />
      </div>
    </div>
  );
}