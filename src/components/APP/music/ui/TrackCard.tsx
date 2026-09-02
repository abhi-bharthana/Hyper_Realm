import React, { useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { Track, useMusicStore } from '../../../../store/useMusicStore';
import AlbumArtDisplay from './AlbumArtDisplay';
import TrackInfo from './TrackInfo';

interface Props {
  track: Track | null;
  isPlaying: boolean;
  isCenter: boolean;
  style: React.CSSProperties;
}

export default function TrackCard({ track, isPlaying, isCenter, style }: Props) {
  const { toggleFavorite } = useMusicStore();
  
  // Custom tap trackers for specific zones
  const lastTapTime = useRef(0);
  const tapCount = useRef(0);
  const tapSide = useRef<'left' | 'right' | 'center'>('center');
  const seekTimeout = useRef<NodeJS.Timeout | null>(null);

  const [seekAnim, setSeekAnim] = useState<{ side: 'left' | 'right', amount: number } | null>(null);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Yeh function check karega user ne kahan double tap kiya hai
  const handleTap = (side: 'left' | 'right' | 'center', e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Parent tak click na jaye
    if (!isCenter || !track) return;
    
    const now = Date.now();
    
    // Agar user zone change karta hai (jaise left tap karke turant art pe tap kiya)
    if (tapSide.current !== side) {
      tapCount.current = 1;
      tapSide.current = side;
      lastTapTime.current = now;
      return;
    }

    if (now - lastTapTime.current < 300) {
      tapCount.current += 1;

      if (side === 'center') {
        // 💖 HEART BUBBLE BURST (Sirf Album Art par)
        toggleFavorite(track.path);
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 800);
        tapCount.current = 0; // Reset
      } else {
        // ⏩ YOUTUBE STYLE SEEK (Sirf Left/Right khaali jagah par)
        const amount = (tapCount.current - 1) * 10;
        setSeekAnim({ side, amount });

        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio && audio.duration) {
          audio.currentTime += (side === 'right' ? 10 : -10);
        }

        if (seekTimeout.current) clearTimeout(seekTimeout.current);
        seekTimeout.current = setTimeout(() => {
          setSeekAnim(null);
          tapCount.current = 1;
        }, 800);
      }
    } else {
      tapCount.current = 1;
      tapSide.current = side;
    }
    lastTapTime.current = now;
  };

  return (
    // 'h-full' add kiya taaki left/right hitboxes screen ki poori height le sakein
    <div className="absolute w-full h-full flex flex-col items-center justify-center top-0 pointer-events-none" style={style}>
      
      <style>{`
        @keyframes bubbleBurst {
          0% { transform: scale(0.5); opacity: 1; }
          40% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(2); opacity: 0; filter: blur(8px); }
        }
        .anim-bubble-burst { animation: bubbleBurst 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

        @keyframes rippleFade {
          0% { opacity: 0; background: rgba(255,255,255,0); }
          15% { opacity: 1; background: rgba(255,255,255,0.08); }
          85% { opacity: 1; background: rgba(255,255,255,0.08); }
          100% { opacity: 0; background: rgba(255,255,255,0); }
        }
        .anim-ripple-fade { animation: rippleFade 0.8s ease-out forwards; }
      `}</style>

      {/* 🎯 HITBOXES FOR 10s SEEK (Only active on the center playing card) */}
      {isCenter && (
        <>
          {/* Left Empty Space Hitbox */}
          <div 
            className="absolute inset-y-0 left-0 w-[25%] sm:w-[30%] z-40 pointer-events-auto cursor-pointer"
            onClick={(e) => handleTap('left', e)}
          />
          {/* Right Empty Space Hitbox */}
          <div 
            className="absolute inset-y-0 right-0 w-[25%] sm:w-[30%] z-40 pointer-events-auto cursor-pointer"
            onClick={(e) => handleTap('right', e)}
          />
        </>
      )}

      {/* 🎯 ALBUM WRAPPER: FIX -> Lowered Z-Index to 40 so popup menus sit above it */}
      <div 
        className="relative pointer-events-auto z-40 cursor-pointer" 
        onClick={(e) => handleTap('center', e)}
      >
        <AlbumArtDisplay track={track} isPlaying={isPlaying} isCenter={isCenter} />

        {/* 💖 BUBBLE BURST OVERLAY */}
        {isCenter && showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none mb-[1.5rem]">
            <Heart className="w-[6rem] h-[6rem] text-red-500 fill-red-500 drop-shadow-[0_0_2rem_rgba(239,68,68,0.8)] anim-bubble-burst" />
          </div>
        )}
      </div>

      {/* 🎛️ TRACK INFO WRAPPER: FIX -> Raised Z-Index to 50 so Sleep Timer & Playlist menus stay on top */}
      <div className="relative z-50 w-full flex justify-center pointer-events-none">
        <TrackInfo track={track} />
      </div>
      
      {/* ⏩ YOUTUBE SEEK RIPPLE OVERLAY */}
      {isCenter && seekAnim && (
        <div className={`absolute inset-y-0 ${seekAnim.side === 'left' ? 'left-0 rounded-r-full' : 'right-0 rounded-l-full'} w-[25%] sm:w-[30%] max-w-[12rem] z-30 pointer-events-none flex flex-col items-center justify-center anim-ripple-fade`}>
          <div className="flex flex-col items-center text-white opacity-90 drop-shadow-lg">
            <div className="flex items-center gap-1 text-[1.5em] md:text-[2em]">
              {seekAnim.side === 'left' ? <><span>⏪</span></> : <><span>⏩</span></>}
            </div>
            <span className="font-bold text-[0.8em] mt-1 tracking-wider">
              {seekAnim.side === 'left' ? '-' : '+'}{seekAnim.amount}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
}