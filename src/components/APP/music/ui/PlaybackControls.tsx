import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { Track, useMusicStore } from '../../../../store/useMusicStore';

export default function PlaybackControls({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const { currentTrackIndex, isPlaying, togglePlay, isShuffle, toggleShuffle, repeatMode, toggleRepeat } = useMusicStore();

  return (
    <div className="flex items-center justify-between w-full px-[0.5rem]">
      <button onClick={toggleShuffle} className={`p-[0.5rem] rounded-full transition-colors ${isShuffle ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}>
        <Shuffle className="w-[1.2rem] h-[1.2rem]" />
      </button>

      <div className="flex items-center gap-[1.5rem]">
        <button onClick={onPrev} className="text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors active:scale-90">
          <SkipBack className="w-[1.5rem] h-[1.5rem]" fill="currentColor" />
        </button>
        <button onClick={togglePlay} disabled={currentTrackIndex === null} className="w-[4rem] h-[4rem] flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.2)] disabled:opacity-50 shrink-0">
          {isPlaying ? <Pause className="w-[1.5rem] h-[1.5rem]" fill="currentColor" /> : <Play className="w-[1.5rem] h-[1.5rem] ml-[0.1rem]" fill="currentColor" />}
        </button>
        <button onClick={onNext} className="text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors active:scale-90">
          <SkipForward className="w-[1.5rem] h-[1.5rem]" fill="currentColor" />
        </button>
      </div>

      <button onClick={toggleRepeat} className={`p-[0.5rem] rounded-full transition-colors ${repeatMode !== 'off' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}>
        {repeatMode === 'one' ? <Repeat1 className="w-[1.2rem] h-[1.2rem]" /> : <Repeat className="w-[1.2rem] h-[1.2rem]" />}
      </button>
    </div>
  );
}