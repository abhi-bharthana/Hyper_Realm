import React from 'react';
import { Music2 } from 'lucide-react';
import { Track } from '../../../../store/useMusicStore';

interface Props {
  track: Track | null;
  isPlaying: boolean;
  isCenter?: boolean;
}

export default function AlbumArtDisplay({ track, isPlaying, isCenter = true }: Props) {
  return (
    <div className="relative mb-[1.5rem] flex items-center justify-center w-full">
      
      {/* 🚀 GPU ACCELERATED AURORA GLOW (No more choppiness) */}
      {track?.coverUrl && isCenter && (
        <div 
          className="absolute z-0 pointer-events-none transition-opacity duration-1000 opacity-50 dark:opacity-[0.7] transform-gpu"
          style={{ 
            inset: '-5%',
            backgroundImage: `url(${track.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // 🔥 FIX: Reduced blur drastically and added translateZ to force Hardware Acceleration
            filter: 'blur(2.5rem) saturate(200%) brightness(120%)',
            transform: 'scale(1.2) translateZ(0)',
            willChange: 'transform, opacity'
          }}
        />
      )}

      {/* ALBUM ART CARD */}
      <div className={`relative z-10 w-[15rem] h-[15rem] sm:w-[18rem] sm:h-[18rem] lg:w-[22rem] lg:h-[22rem] rounded-[1.5rem] bg-white dark:bg-neutral-900 shadow-[0_1.5rem_3.5rem_-1rem_rgba(0,0,0,0.3)] dark:shadow-[0_2rem_5rem_-1rem_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/50 dark:border-white/10 overflow-hidden shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu ${isPlaying && isCenter ? 'scale-100' : 'scale-[0.93]'}`}>
        {track?.coverUrl ? (
          <img src={track.coverUrl} alt="Art" className="w-full h-full object-cover" />
        ) : (
          <Music2 className="w-[4rem] h-[4rem] text-slate-300 dark:text-white/10" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 dark:via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
      </div>
    </div>
  );
}