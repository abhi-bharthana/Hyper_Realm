import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { Track, useMusicStore } from '../../../../store/useMusicStore';

export default function PlaybackControls({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { currentTrackIndex, isPlaying, togglePlay, isShuffle, toggleShuffle, repeatMode, toggleRepeat } = useMusicStore();

  return (
    <div className="flex items-center justify-between w-full px-4 md:px-[0.5rem]">
      
      {/* Shuffle Button */}
      <button 
        onClick={toggleShuffle} 
        className={`p-3 md:p-[0.5rem] rounded-full transition-all active:scale-90 active:bg-slate-200/50 dark:active:bg-white/10 md:active:bg-transparent ${
          isShuffle ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'
        }`}
      >
        <Shuffle className="w-6 h-6 md:w-[1.2rem] md:h-[1.2rem]" />
      </button>

      <div className="flex items-center gap-4 sm:gap-6 md:gap-[1.5rem]">
        
        {/* Prev Button */}
        <button 
          onClick={onPrev} 
          className="p-3 md:p-0 rounded-full text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-all active:scale-90 active:bg-slate-200/50 dark:active:bg-white/10 md:active:bg-transparent"
        >
          <SkipBack className="w-8 h-8 md:w-[1.5rem] md:h-[1.5rem]" fill="currentColor" />
        </button>
        
        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay} 
          disabled={currentTrackIndex === null} 
          className="w-16 h-16 md:w-[4rem] md:h-[4rem] flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-90 transition-all shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.2)] disabled:opacity-50 shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 md:w-[1.5rem] md:h-[1.5rem]" fill="currentColor" />
          ) : (
            <Play className="w-8 h-8 md:w-[1.5rem] md:h-[1.5rem] ml-1" fill="currentColor" />
          )}
        </button>
        
        {/* Next Button */}
        <button 
          onClick={onNext} 
          className="p-3 md:p-0 rounded-full text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-all active:scale-90 active:bg-slate-200/50 dark:active:bg-white/10 md:active:bg-transparent"
        >
          <SkipForward className="w-8 h-8 md:w-[1.5rem] md:h-[1.5rem]" fill="currentColor" />
        </button>
      </div>

      {/* Repeat Button */}
      <button 
        onClick={toggleRepeat} 
        className={`p-3 md:p-[0.5rem] rounded-full transition-all active:scale-90 active:bg-slate-200/50 dark:active:bg-white/10 md:active:bg-transparent ${
          repeatMode !== 'off' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'
        }`}
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="w-6 h-6 md:w-[1.2rem] md:h-[1.2rem]" />
        ) : (
          <Repeat className="w-6 h-6 md:w-[1.2rem] md:h-[1.2rem]" />
        )}
      </button>
    </div>
  );
}