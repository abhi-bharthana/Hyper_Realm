import React, { useState } from 'react';
import { Heart, ListPlus, Check } from 'lucide-react';
import { Track, useMusicStore } from '../../../../store/useMusicStore';
import SleepTimerMenu from './SleepTimerMenu';

export default function TrackInfo({ track }: { track: Track | null }) {
  const { favorites, toggleFavorite, playlists, addTrackToPlaylist } = useMusicStore();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [addedTo, setAddedTo] = useState<string | null>(null);

  const isFavorite = track ? favorites.includes(track.path) : false;

  const handleAdd = (id: string) => {
    if (!track) return;
    addTrackToPlaylist(id, track.path);
    setAddedTo(id);
    setTimeout(() => { setAddedTo(null); setShowPlaylistMenu(false); }, 1500);
  };

  return (
    <div className="text-center w-full max-w-[25rem] px-[1rem] relative z-10 pointer-events-auto">
      <h2 className="text-[1.5em] md:text-[1.75em] font-black text-slate-900 dark:text-white truncate drop-shadow-sm">
        {track ? track.title : 'No Track Selected'}
      </h2>
      <p className="text-[0.85em] font-medium text-slate-600 dark:text-white/60 mt-[0.5rem] tracking-wide truncate">
        {track ? `${track.artist} • ${track.album}` : 'Scan a directory'}
      </p>

      {track && (
        <div className="relative flex items-center gap-[0.75rem] mt-[1.25rem] justify-center">
          
          <button onClick={() => toggleFavorite(track.path)} className="p-[0.75rem] rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95 group">
            <Heart className={`w-[1.4rem] h-[1.4rem] transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500 dark:text-white/40 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
          </button>
          
          {/* Sleep Timer Center Aligned */}
          <SleepTimerMenu />

          <div className="relative">
            <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} className="p-[0.75rem] rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-white/40 transition-all active:scale-95">
              <ListPlus className="w-[1.4rem] h-[1.4rem]" />
            </button>
            {showPlaylistMenu && (
              <div className="absolute bottom-full mb-[1rem] left-1/2 -translate-x-1/2 w-[14rem] bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[1.25rem] p-[0.5rem] shadow-2xl z-50 text-left">
                <h4 className="text-[0.65em] font-bold text-slate-400 uppercase tracking-wider px-[0.75rem] mb-[0.5rem] mt-[0.25rem]">Add to Playlist</h4>
                <div className="max-h-[12rem] overflow-y-auto custom-scrollbar flex flex-col gap-[0.25rem] text-left">
                  {playlists.map(p => {
                    const isAlreadyAdded = p.trackPaths.includes(track.path);
                    const isJustAdded = addedTo === p.id;
                    return (
                      <button key={p.id} disabled={isAlreadyAdded && !isJustAdded} onClick={() => handleAdd(p.id)} className={`flex items-center justify-between px-[0.75rem] py-[0.6rem] rounded-[0.75rem] text-[0.8em] font-bold transition-all ${isJustAdded ? 'bg-emerald-500/20 text-emerald-600' : isAlreadyAdded ? 'opacity-50 text-slate-500' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white'}`}>
                        <span className="truncate pr-[0.5rem]">{p.name}</span>
                        {isJustAdded || isAlreadyAdded ? <Check className="w-[1rem] h-[1rem] shrink-0" /> : null}
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
  );
}