import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Heart, ListOrdered, ChevronDown, X } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { useAppStore } from '../../store/useAppStore';

export default function MusicWidget() {
  const { 
    playlist, currentTrackIndex, isPlaying, togglePlay, nextTrack, prevTrack,
    favorites, toggleFavorite, queue, removeFromQueue, clearQueue 
  } = useMusicStore();
  const { showMusicWidget, setActiveTab } = useAppStore();
  
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;
  const isFavorite = currentTrack ? favorites.includes(currentTrack.path) : false;

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
    <div className="absolute bottom-[2rem] right-[2rem] w-[20rem] md:w-[24rem] bg-white/70 dark:bg-black/50 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[1.5rem] shadow-[0_1.5rem_3rem_-0.5rem_rgba(0,0,0,0.2)] dark:shadow-[0_1.5rem_3rem_-0.5rem_rgba(0,0,0,0.6)] flex flex-col z-50 animate-in slide-in-from-bottom-5 transition-all duration-500 overflow-hidden">
      
      {/* Main Mini Player Row */}
      <div 
        onClick={() => setActiveTab('Music')}
        className="relative p-[0.75rem] flex items-center gap-[0.75rem] cursor-pointer group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
      >
        {/* Mini Album Art */}
        <div className={`relative w-[3.5rem] h-[3.5rem] shrink-0 rounded-[1rem] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-95'}`}>
          {currentTrack?.coverUrl ? (
            <img src={currentTrack.coverUrl} alt="Art" className="w-full h-full object-cover" />
          ) : (
            <Music2 className="w-[1.5rem] h-[1.5rem] text-neutral-400 dark:text-white/20" />
          )}
        </div>

        {/* Track Info (Scaled via em) */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="text-[0.9em] font-bold text-neutral-900 dark:text-white truncate">
            {currentTrack ? currentTrack.title : 'Not Playing'}
          </h4>
          <p className="text-[0.75em] text-neutral-500 dark:text-white/50 truncate font-medium mt-[0.1em]">
            {currentTrack ? currentTrack.artist : 'Select a track'}
          </p>
        </div>

        {/* Mini Controls (Scaled via rem) */}
        <div className="flex items-center gap-[0.25rem] shrink-0" onClick={(e) => e.stopPropagation()}>
          
          <button 
            onClick={() => currentTrack && toggleFavorite(currentTrack.path)} 
            className="p-[0.4rem] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-[1.2rem] h-[1.2rem] transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <button 
            onClick={togglePlay} disabled={!currentTrack}
            className="w-[2.2rem] h-[2.2rem] mx-[0.25rem] flex items-center justify-center bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-[1rem] h-[1rem]" fill="currentColor" /> : <Play className="w-[1rem] h-[1rem] ml-[0.1rem]" fill="currentColor" />}
          </button>
          
          <button onClick={nextTrack} className="p-[0.4rem] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
            <SkipForward className="w-[1.2rem] h-[1.2rem]" fill="currentColor" />
          </button>

          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className={`p-[0.4rem] ml-[0.25rem] transition-colors rounded-full ${isExpanded ? 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white' : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
            title="Up Next"
          >
            {isExpanded ? <ChevronDown className="w-[1.1rem] h-[1.1rem]" /> : <ListOrdered className="w-[1.1rem] h-[1.1rem]" />}
          </button>
        </div>

        {/* Mini Progress Bar inside the player row */}
        <div className="absolute bottom-0 left-[1.25rem] right-[1.25rem] h-[0.15rem] bg-neutral-200/80 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-900 dark:bg-white transition-all duration-500 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Expanded Up-Next Queue */}
      <div className={`transition-all duration-500 ease-in-out bg-slate-50/50 dark:bg-black/20 ${isExpanded ? 'max-h-[16rem] opacity-100 border-t border-slate-200 dark:border-white/5' : 'max-h-0 opacity-0 border-t-0'}`}>
        <div className="p-[0.75rem] flex flex-col gap-[0.5rem]">
          
          <div className="flex justify-between items-center px-[0.5rem] pb-[0.25rem]">
            <span className="text-[0.7em] font-bold uppercase tracking-wider text-slate-500">Up Next Queue</span>
            {queue.length > 0 && (
              <button onClick={clearQueue} className="text-[0.7em] font-bold text-slate-400 hover:text-red-500 transition-colors">Clear</button>
            )}
          </div>

          <div className="flex flex-col gap-[0.25rem] overflow-y-auto custom-scrollbar max-h-[12rem] pr-[0.25rem]">
            {queue.length === 0 ? (
              <p className="text-[0.75em] text-slate-400 text-center py-[1.5rem] italic">Your queue is empty.</p>
            ) : (
              queue.map((path, idx) => {
                const qTrack = playlist.find(t => t.path === path);
                if (!qTrack) return null;
                return (
                  <div key={idx} className="flex items-center gap-[0.75rem] p-[0.4rem] rounded-[0.75rem] hover:bg-slate-200/50 dark:hover:bg-white/5 group transition-colors">
                    <img src={qTrack.coverUrl || 'placeholder.jpg'} className="w-[2rem] h-[2rem] rounded-[0.5rem] object-cover bg-slate-200 dark:bg-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.8em] font-bold text-slate-800 dark:text-white truncate">{qTrack.title}</p>
                      <p className="text-[0.7em] text-slate-500 truncate">{qTrack.artist}</p>
                    </div>
                    <button 
                      onClick={() => removeFromQueue(idx)} 
                      className="p-[0.3rem] text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-[0.4rem]"
                    >
                      <X className="w-[1rem] h-[1rem]" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}