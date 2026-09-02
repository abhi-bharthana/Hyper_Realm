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
      
      {/* 🔥 VIBRANT AURORA GLOW EFFECT 🔥 */}
      {track?.coverUrl && isCenter && (
        <div 
          className="absolute z-0 pointer-events-none transition-all duration-1000 opacity-60 dark:opacity-[0.85]"
          style={{ 
            inset: '-10%', // Thoda extra space glow failne ke liye
            backgroundImage: `url(${track.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            // CSS MAGIC: High saturation and contrast to prevent muddy/washed-out colors
            filter: 'blur(5rem) saturate(300%) contrast(130%) brightness(110%)',
            transform: 'scale(1.4)' // Pushes dark borders/shadows out of the glow radius
          }}
        />
      )}

      {/* 🎯 ALBUM ART CARD */}
      <div className={`relative z-10 w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] lg:w-[22rem] lg:h-[22rem] max-w-[40vh] max-h-[40vh] rounded-[1.5rem] bg-white dark:bg-neutral-900 shadow-[0_2rem_5rem_-1rem_rgba(0,0,0,0.3)] dark:shadow-[0_2rem_5rem_-1rem_rgba(0,0,0,0.8)] flex items-center justify-center border border-white/50 dark:border-white/10 overflow-hidden shrink-0 transition-transform duration-700 ${isPlaying && isCenter ? 'scale-100' : 'scale-95'}`}>
        {track?.coverUrl ? (
          <img src={track.coverUrl} alt="Art" className="w-full h-full object-cover" />
        ) : (
          <Music2 className="w-[4rem] h-[4rem] text-slate-300 dark:text-white/10" />
        )}
        
        {/* Subtle Glass Reflection on the Art itself */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 dark:via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
      </div>

    </div>
  );
}