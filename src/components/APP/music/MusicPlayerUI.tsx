import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Heart, ListPlus, Check, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { useMusicStore } from '../../../store/useMusicStore';

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MusicPlayerUI() {
  const { 
    playlist, currentTrackIndex, isPlaying, togglePlay, nextTrack, prevTrack,
    favorites, toggleFavorite, playlists, addTrackToPlaylist,
    isShuffle, toggleShuffle, repeatMode, toggleRepeat
  } = useMusicStore();
  
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio && audio.duration && !isNaN(audio.duration)) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(formatTime(audio.currentTime));
          setDuration(formatTime(audio.duration));
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audio && audio.duration) {
      const seekTime = (Number(e.target.value) / 100) * audio.duration;
      audio.currentTime = seekTime;
      setProgress(Number(e.target.value));
      setCurrentTime(formatTime(seekTime));
    }
  };

  const isFavorite = currentTrack ? favorites.includes(currentTrack.path) : false;

  const handleAddToPlaylist = (playlistId: string) => {
    if (!currentTrack) return;
    addTrackToPlaylist(playlistId, currentTrack.path);
    setAddedTo(playlistId);
    setTimeout(() => { setAddedTo(null); setShowPlaylistMenu(false); }, 1500);
  };

  return (
    // Outer Wrapper dynamically scales using 'rem' spacing (Controlled by UI Slider)
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-[2rem] min-w-0">
      
      {/* Scalable Album Art Box (Uses rem so it strictly scales with UI, not Text) */}
      <div className={`relative w-[14rem] h-[14rem] sm:w-[18rem] sm:h-[18rem] lg:w-[22rem] lg:h-[22rem] max-w-[40vh] max-h-[40vh] mb-[2rem] rounded-[1.5rem] bg-white dark:bg-neutral-900 shadow-[0_1rem_3rem_-0.5rem_rgba(0,0,0,0.15)] dark:shadow-[0_1rem_3rem_-0.5rem_rgba(0,0,0,0.6)] flex items-center justify-center border border-slate-200 dark:border-white/10 transition-all duration-700 overflow-hidden shrink-0 ${isPlaying ? 'scale-100' : 'scale-95 dark:grayscale-[15%]'}`}>
        {currentTrack?.coverUrl ? (
          <img src={currentTrack.coverUrl} alt="Art" className="w-full h-full object-cover" />
        ) : (
          <Music2 className="w-[4rem] h-[4rem] text-slate-300 dark:text-white/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent pointer-events-none" />
      </div>
      
      {/* Track Info */}
      <div className="text-center w-full max-w-[25rem] mb-[2rem] px-[1rem]">
        {/* TEXT CLASSES are left as em/tailwind so they respond to the TEXT SCALE SLIDER */}
        <h2 className="text-[1.5em] md:text-[1.75em] font-black text-slate-900 dark:text-white truncate drop-shadow-sm">
          {currentTrack ? currentTrack.title : 'No Track Selected'}
        </h2>
        <p className="text-[0.85em] font-medium text-slate-500 dark:text-white/50 mt-[0.5rem] tracking-wide truncate">
          {currentTrack ? `${currentTrack.artist} • ${currentTrack.album}` : 'Scan a directory to build your library'}
        </p>

        {currentTrack && (
          <div className="relative flex items-center gap-[0.75rem] mt-[1.25rem] justify-center">
            
            {/* Scalable Action Buttons (Containers use rem, icons use rem) */}
            <button onClick={() => toggleFavorite(currentTrack.path)} className="p-[0.75rem] rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 group" title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              <Heart className={`w-[1.4rem] h-[1.4rem] transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
            </button>
            
            <div className="relative">
              <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} className={`p-[0.75rem] rounded-full transition-all active:scale-95 ${showPlaylistMenu ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`} title="Add to Playlist">
                <ListPlus className="w-[1.4rem] h-[1.4rem]" />
              </button>
              
              {/* Scalable Playlist Menu Menu */}
              {showPlaylistMenu && (
                <div className="absolute bottom-full mb-[1rem] left-1/2 -translate-x-1/2 w-[14rem] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.25rem] p-[0.5rem] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="text-[0.65em] font-bold text-slate-400 uppercase tracking-wider px-[0.75rem] mb-[0.5rem] mt-[0.25rem]">Add to Playlist</h4>
                  <div className="max-h-[12rem] overflow-y-auto custom-scrollbar flex flex-col gap-[0.25rem] text-left">
                    {playlists.length === 0 ? (
                      <p className="text-[0.75em] text-slate-500 px-[0.75rem] py-[0.5rem] italic text-center">No playlists created</p>
                    ) : playlists.map(p => {
                        const isAlreadyAdded = p.trackPaths.includes(currentTrack.path);
                        const isJustAdded = addedTo === p.id;
                        return (
                          <button key={p.id} disabled={isAlreadyAdded && !isJustAdded} onClick={() => handleAddToPlaylist(p.id)} className={`flex items-center justify-between px-[0.75rem] py-[0.6rem] rounded-[0.75rem] text-[0.8em] font-bold transition-all ${isJustAdded ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : isAlreadyAdded ? 'opacity-50 cursor-not-allowed text-slate-500' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white'}`}>
                            <span className="truncate pr-[0.5rem]">{p.name}</span>
                            {isJustAdded ? <Check className="w-[1rem] h-[1rem] shrink-0" /> : isAlreadyAdded ? <Check className="w-[1rem] h-[1rem] shrink-0 opacity-50" /> : null}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-[24rem] flex flex-col items-center px-[1rem]">
        
        {/* Scalable Progress Bar */}
        <div className="w-full flex items-center gap-[0.75rem] text-[0.75em] font-mono text-slate-500 dark:text-white/40 mb-[1.5rem]">
          <span>{currentTime}</span>
          <input type="range" min="0" max="100" value={progress || 0} onChange={handleSeek} className="flex-1 h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-white" />
          <span>{duration}</span>
        </div>
        
        {/* 🔀 MAIN CONTROLS WITH SHUFFLE & REPEAT */}
        <div className="flex items-center justify-between w-full px-[0.5rem]">
          
          <button onClick={toggleShuffle} className={`p-[0.5rem] rounded-full transition-colors ${isShuffle ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}>
            <Shuffle className="w-[1.2rem] h-[1.2rem]" />
          </button>

          <div className="flex items-center gap-[1.5rem]">
            <button onClick={prevTrack} className="text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors">
              <SkipBack className="w-[1.5rem] h-[1.5rem]" fill="currentColor" />
            </button>
            <button onClick={togglePlay} disabled={!currentTrack} className="w-[4rem] h-[4rem] flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0.5rem_1rem_rgba(0,0,0,0.2)] disabled:opacity-50 shrink-0">
              {isPlaying ? (
                <Pause className="w-[1.5rem] h-[1.5rem]" fill="currentColor" />
              ) : (
                <Play className="w-[1.5rem] h-[1.5rem] ml-[0.1rem]" fill="currentColor" />
              )}
            </button>
            <button onClick={nextTrack} className="text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors">
              <SkipForward className="w-[1.5rem] h-[1.5rem]" fill="currentColor" />
            </button>
          </div>

          <button onClick={toggleRepeat} className={`p-[0.5rem] rounded-full transition-colors ${repeatMode !== 'off' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}>
            {repeatMode === 'one' ? <Repeat1 className="w-[1.2rem] h-[1.2rem]" /> : <Repeat className="w-[1.2rem] h-[1.2rem]" />}
          </button>

        </div>
      </div>
    </div>
  );
}