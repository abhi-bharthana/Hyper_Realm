import React from 'react';
import { Music2 } from 'lucide-react';
import { Track } from '../../../store/useMusicStore';

interface Props {
  track: Track | null;
  isPlaying: boolean;
}

export default function AlbumArtDisplay({ track, isPlaying }: Props) {
  return (
    <div className="relative mb-[2rem] flex items-center justify-center">
      {track?.coverUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center blur-[4rem] opacity-40 dark:opacity-60 scale-[1.3] z-0 rounded-full transition-all duration-1000 pointer-events-none"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
        />
      )}
      <div className={`relative z-10 w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] lg:w-[22rem] lg:h-[22rem] max-w-[40vh] max-h-[40vh] rounded-[1.5rem] bg-white dark:bg-neutral-900 shadow-[0_1.5rem_4rem_-0.5rem_rgba(0,0,0,0.3)] dark:shadow-[0_1.5rem_4rem_-0.5rem_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/20 dark:border-white/10 transition-all duration-700 overflow-hidden shrink-0 ${isPlaying ? 'scale-100' : 'scale-95 dark:grayscale-[15%]'}`}>
        {track?.coverUrl ? (
          <img src={track.coverUrl} alt="Art" className="w-full h-full object-cover" />
        ) : (
          <Music2 className="w-[4rem] h-[4rem] text-slate-300 dark:text-white/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}