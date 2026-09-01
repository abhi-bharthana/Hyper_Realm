import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2 } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { useAppStore } from '../../store/useAppStore';

export default function MusicWidget() {
  const { playlist, currentTrackIndex, isPlaying, togglePlay, nextTrack, prevTrack } = useMusicStore();
  const { showMusicWidget, setActiveTab } = useAppStore();
  
  const [progress, setProgress] = useState(0);
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  // Real-time progress tracker just for the widget's mini progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!showMusicWidget) return null;

  return (
    <div 
      onClick={() => setActiveTab('Music')}
      className="absolute bottom-8 right-8 w-72 md:w-80 bg-white/70 dark:bg-black/40 backdrop-blur-3xl border border-white/50 dark:border-white/10 rounded-3xl p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] flex items-center gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group z-50 animate-in slide-in-from-bottom-5"
    >
      {/* Mini Album Art */}
      <div className={`relative w-14 h-14 shrink-0 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shadow-md transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-95'}`}>
        {currentTrack?.coverUrl ? (
          <img src={currentTrack.coverUrl} alt="Art" className="w-full h-full object-cover" />
        ) : (
          <Music2 size={24} className="text-neutral-400 dark:text-white/20" />
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
          {currentTrack ? currentTrack.title : 'Not Playing'}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-white/50 truncate font-medium mt-0.5">
          {currentTrack ? currentTrack.artist : 'Select a track'}
        </p>
      </div>

      {/* Mini Controls (e.stopPropagation zaroori hai taaki click se app open na ho) */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        <button onClick={prevTrack} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-white/50 dark:hover:text-white transition-colors">
          <SkipBack size={16} fill="currentColor" />
        </button>
        <button 
          onClick={togglePlay} disabled={!currentTrack}
          className="w-8 h-8 flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
        </button>
        <button onClick={nextTrack} className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:text-white/50 dark:hover:text-white transition-colors">
          <SkipForward size={16} fill="currentColor" />
        </button>
      </div>

      {/* Mini Progress Bar at the absolute bottom */}
      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-neutral-200/50 dark:bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-neutral-900 dark:bg-white transition-all duration-500 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}