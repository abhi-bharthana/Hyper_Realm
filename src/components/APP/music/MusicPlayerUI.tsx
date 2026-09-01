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
    <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 md:p-10 min-w-0">
      <div className={`relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 max-w-[40vh] max-h-[40vh] mb-6 lg:mb-8 rounded-2xl bg-white dark:bg-neutral-900 shadow-xl dark:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] flex items-center justify-center border border-slate-200 dark:border-white/10 transition-all duration-700 overflow-hidden shrink-0 ${isPlaying ? 'scale-100' : 'scale-95 dark:grayscale-[15%]'}`}>
        {currentTrack?.coverUrl ? <img src={currentTrack.coverUrl} alt="Art" className="w-full h-full object-cover" /> : <Music2 size={48} className="text-slate-300 dark:text-white/10" />}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent pointer-events-none" />
      </div>
      
      <div className="text-center w-full max-w-md mb-6 lg:mb-8 px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white truncate drop-shadow-sm">{currentTrack ? currentTrack.title : 'No Track Selected'}</h2>
        <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-white/50 mt-1 lg:mt-2 tracking-wide truncate">{currentTrack ? `${currentTrack.artist} • ${currentTrack.album}` : 'Scan a directory to build your library'}</p>

        {currentTrack && (
          <div className="relative flex items-center gap-3 mt-4 justify-center">
            <button onClick={() => toggleFavorite(currentTrack.path)} className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 group" title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}>
              <Heart size={22} className={`transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
            </button>
            <div className="relative">
              <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} className={`p-3 rounded-full transition-all active:scale-95 ${showPlaylistMenu ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white' : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`} title="Add to Playlist"><ListPlus size={22} /></button>
              {showPlaylistMenu && (
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-1">Add to Playlist</h4>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar flex flex-col gap-1 text-left">
                    {playlists.length === 0 ? <p className="text-xs text-slate-500 px-3 py-2 italic text-center">No playlists created</p> : playlists.map(p => {
                        const isAlreadyAdded = p.trackPaths.includes(currentTrack.path);
                        const isJustAdded = addedTo === p.id;
                        return (
                          <button key={p.id} disabled={isAlreadyAdded && !isJustAdded} onClick={() => handleAddToPlaylist(p.id)} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isJustAdded ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : isAlreadyAdded ? 'opacity-50 cursor-not-allowed text-slate-500' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white'}`}>
                            <span className="truncate pr-2">{p.name}</span>
                            {isJustAdded ? <Check size={14} className="shrink-0" /> : isAlreadyAdded ? <Check size={14} className="shrink-0 opacity-50" /> : null}
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

      <div className="w-full max-w-sm flex flex-col items-center px-4">
        <div className="w-full flex items-center gap-3 text-[10px] md:text-xs font-mono text-slate-500 dark:text-white/40 mb-5">
          <span>{currentTime}</span>
          <input type="range" min="0" max="100" value={progress || 0} onChange={handleSeek} className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-white" />
          <span>{duration}</span>
        </div>
        
        {/* 🔀 MAIN CONTROLS WITH SHUFFLE & REPEAT */}
        <div className="flex items-center justify-between w-full px-2">
          
          <button onClick={toggleShuffle} className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}>
            <Shuffle size={18} />
          </button>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={prevTrack} className="text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors"><SkipBack size={24} fill="currentColor" /></button>
            <button onClick={togglePlay} disabled={!currentTrack} className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 shrink-0">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-slate-400 hover:text-slate-900 dark:text-white/50 dark:hover:text-white transition-colors"><SkipForward size={24} fill="currentColor" /></button>
          </div>

          <button onClick={toggleRepeat} className={`p-2 rounded-full transition-colors ${repeatMode !== 'off' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:text-white/40 dark:hover:text-white'}`}>
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>

        </div>
      </div>
    </div>
  );
}