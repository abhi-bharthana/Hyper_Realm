import React, { useState, useEffect } from 'react';
import { FolderSearch, History, ListMusic, Volume2, Plus, List, MoreVertical, X, FolderCog, Heart, RefreshCw } from 'lucide-react';
// 🔥 Path Fix: musicCollection -> music -> APP -> components -> src -> store
import { useMusicStore, Track, PlaylistData } from '../../../../store/useMusicStore';
// 🔥 Path Fix: musicScanner ek folder piche (music folder) mein hai
import { scanNativeDirectory } from '../musicScanner';

import { PlaylistCover } from './PlaylistCover';
import { FolderManager } from './FolderManager';
import { UpNextQueue } from './UpNextQueue';

export default function MusicCollection() {
  const { 
    playlist, historyPaths, savedDirectories, playlists, favorites, queue,
    currentTrackIndex, isPlaying, 
    playTrack, playTrackByPath, setPlaylist, 
    createPlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist, toggleFavorite,
    addToQueue, playNext
  } = useMusicStore();

  const [activeView, setActiveView] = useState<'library' | 'history' | 'playlists' | 'folders'>('library');
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  useEffect(() => {
    if (savedDirectories.length > 0 && playlist.length === 0) syncAllDirectories();
  }, []);

  const syncAllDirectories = async () => {
    setIsScanning(true);
    let allTracks: Track[] = [];
    for (const dir of savedDirectories) {
      try {
        const tracks = await scanNativeDirectory(dir);
        allTracks = [...allTracks, ...tracks];
      } catch (error) { console.error(error); }
    }
    setPlaylist(allTracks);
    setIsScanning(false);
  };

  const handleCreatePlaylist = () => {
    const name = prompt("Enter Playlist Name:");
    if (name) createPlaylist(name);
  };

  let displayList: Track[] = [];
  if (activeView === 'library') displayList = playlist;
  if (activeView === 'history') displayList = historyPaths.map(p => playlist.find(t => t.path === p)).filter(Boolean) as Track[];
  if (activeView === 'playlists' && selectedPlaylist) {
    if (selectedPlaylist.id === 'favorites') {
      displayList = favorites.map(p => playlist.find(t => t.path === p)).filter(Boolean) as Track[];
    } else {
      const freshPlaylist = playlists.find(p => p.id === selectedPlaylist.id);
      displayList = (freshPlaylist ? freshPlaylist.trackPaths : []).map(p => playlist.find(t => t.path === p)).filter(Boolean) as Track[];
    }
  }

  return (
    <div className="w-full h-full flex flex-col relative z-10 transition-all bg-transparent">
      
      {/* HEADER SECTION */}
      <div className="p-[1.25rem] border-b border-slate-200 dark:border-white/5 flex flex-col gap-[1rem] shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[1.1em] font-bold text-slate-900 dark:text-white tracking-wide">
            {activeView === 'folders' ? 'Manage Folders' : activeView === 'playlists' && selectedPlaylist ? selectedPlaylist.name : 'Collection'}
          </h3>
          <div className="flex gap-[0.5rem]">
            {activeView === 'playlists' && selectedPlaylist && (
              <button onClick={() => setSelectedPlaylist(null)} className="p-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-[0.5rem]">
                <X className="w-[1rem] h-[1rem]" />
              </button>
            )}
            {savedDirectories.length > 0 && activeView === 'library' && (
              <button onClick={syncAllDirectories} className="p-[0.4rem] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white rounded-[0.5rem] hover:text-blue-500 transition-colors" title="Sync Library">
                <RefreshCw className={`w-[1rem] h-[1rem] ${isScanning ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="flex bg-slate-200/70 dark:bg-white/5 p-[0.25rem] rounded-[0.6rem]">
          {[
            { id: 'library', icon: <ListMusic className="w-[1rem] h-[1rem]"/>, label: 'All' },
            { id: 'history', icon: <History className="w-[1rem] h-[1rem]"/>, label: 'Recent' },
            { id: 'playlists', icon: <List className="w-[1rem] h-[1rem]"/>, label: 'Playlists' },
            { id: 'folders', icon: <FolderCog className="w-[1rem] h-[1rem]"/>, label: 'Folders' }
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveView(tab.id as any); setSelectedPlaylist(null); setOpenMenuId(null); }} className={`flex-1 flex flex-col items-center justify-center gap-[0.25rem] text-[0.75em] font-bold py-[0.4rem] rounded-[0.4rem] transition-all ${activeView === tab.id ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.05)]' : 'text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white'}`}>
              {tab.icon} <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* SCROLLABLE LIST SECTION */}
      <div className={`flex-1 overflow-y-auto p-[0.75rem] custom-scrollbar ${queue.length > 0 ? 'pb-[4rem]' : ''}`}>
        
        {activeView === 'folders' && <FolderManager />}

        {activeView === 'playlists' && !selectedPlaylist && (
          <div className="flex flex-col gap-[0.5rem]">
            <div className="group flex items-center justify-between bg-white/60 dark:bg-white/5 p-[0.75rem] rounded-[0.75rem] border border-slate-200 dark:border-white/5 hover:border-red-500/30 transition-all cursor-pointer mb-[0.5rem]" onClick={() => setSelectedPlaylist({ id: 'favorites', name: 'Liked Songs', trackPaths: favorites })}>
              <div className="flex items-center gap-[0.75rem]">
                <div className="relative">
                  <PlaylistCover trackPaths={favorites} allTracks={playlist} historyPaths={historyPaths} />
                  <div className="absolute -bottom-[0.25rem] -right-[0.25rem] bg-red-500 text-white rounded-full p-[0.2rem] border-2 border-white dark:border-[#111111]"><Heart className="w-[0.8rem] h-[0.8rem]" fill="currentColor" /></div>
                </div>
                <div>
                  <h4 className="text-[0.85em] font-bold text-slate-800 dark:text-white">Liked Songs</h4>
                  <p className="text-[0.75em] text-slate-500">{favorites.length} tracks</p>
                </div>
              </div>
            </div>
            <button onClick={handleCreatePlaylist} className="flex items-center justify-center gap-[0.5rem] px-[0.75rem] py-[0.75rem] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[0.85em] font-bold rounded-[0.75rem] border border-emerald-500/20 transition-all mb-[0.5rem]"><Plus className="w-[1.2rem] h-[1.2rem]" /> Create Playlist</button>
            {playlists.map(p => (
              <div key={p.id} className="group flex items-center justify-between bg-white/60 dark:bg-white/5 p-[0.75rem] rounded-[0.75rem] border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => setSelectedPlaylist(p)}>
                <div className="flex items-center gap-[0.75rem]">
                  <PlaylistCover trackPaths={p.trackPaths} allTracks={playlist} historyPaths={historyPaths} />
                  <div><h4 className="text-[0.85em] font-bold text-slate-800 dark:text-white">{p.name}</h4><p className="text-[0.75em] text-slate-500">{p.trackPaths.length} tracks</p></div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id); }} className="p-[0.5rem] text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-[1.2rem] h-[1.2rem]" /></button>
              </div>
            ))}
          </div>
        )}

        {/* MAIN TRACKS RENDERER */}
        {activeView !== 'folders' && (activeView !== 'playlists' || selectedPlaylist) && (
          <div className="space-y-[0.4rem]">
            {displayList.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/30 text-center px-[1rem] pt-[2.5rem]"><FolderSearch className="w-[2.5rem] h-[2.5rem] mb-[0.75rem] opacity-50" /><p className="text-[0.85em] font-bold mb-[0.25rem] text-slate-600 dark:text-white/50">Nothing found</p></div>
            ) : (
              displayList.map((track, idx) => (
                <div key={track.id + idx} className={`relative flex flex-col p-[0.5rem] rounded-[0.75rem] transition-all ${currentTrack?.path === track.path ? 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-[0_0.2rem_0.5rem_rgba(0,0,0,0.05)]' : 'hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'}`}>
                  
                  <div className="flex items-center gap-[0.75rem] cursor-pointer" onClick={() => activeView === 'library' ? playTrack(idx) : playTrackByPath(track.path)}>
                    <div className="relative w-[2.25rem] h-[2.25rem] shrink-0 rounded-[0.6rem] overflow-hidden bg-slate-200 dark:bg-neutral-800 border border-slate-200 dark:border-white/5">
                      <img src={track.coverUrl || 'placeholder.jpg'} loading="lazy" decoding="async" alt="" className="w-full h-full object-cover" />
                      {currentTrack?.path === track.path && isPlaying && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]"><Volume2 className="w-[1rem] h-[1rem] text-white animate-pulse" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[0.85em] font-bold truncate ${currentTrack?.path === track.path ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-white/70'}`}>{track.title}</p>
                      <p className="text-[0.75em] text-slate-500 dark:text-white/40 truncate">{track.artist}</p>
                    </div>
                    
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === track.id ? null : track.id); }} className="p-[0.4rem] text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-[0.4rem] transition-colors">
                      <MoreVertical className="w-[1rem] h-[1rem]" />
                    </button>
                  </div>
                  
                  {/* INLINE ACTION MENU */}
                  {openMenuId === track.id && (
                    <div className="mt-[0.5rem] pt-[0.5rem] border-t border-slate-200 dark:border-white/10 flex flex-col gap-[0.5rem] animate-in fade-in slide-in-from-top-2">
                      <div className="flex gap-[0.5rem]">
                        <button onClick={() => { playNext(track.path); setOpenMenuId(null); }} className="flex-1 px-[0.5rem] py-[0.4rem] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[0.75em] font-bold rounded-[0.5rem] transition-colors border border-blue-500/20">Play Next</button>
                        <button onClick={() => { addToQueue(track.path); setOpenMenuId(null); }} className="flex-1 px-[0.5rem] py-[0.4rem] bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-[0.75em] font-bold rounded-[0.5rem] transition-colors border border-slate-300 dark:border-white/5">Add to Queue</button>
                      </div>
                      {selectedPlaylist && (
                        <button 
                          onClick={() => {
                            selectedPlaylist.id === 'favorites' ? toggleFavorite(track.path) : removeTrackFromPlaylist(selectedPlaylist.id, track.path);
                            setOpenMenuId(null);
                          }} 
                          className="w-full px-[0.5rem] py-[0.4rem] bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[0.75em] font-bold rounded-[0.5rem] transition-colors border border-red-500/20"
                        >
                          Remove from this Playlist
                        </button>
                      )}
                      <span className="w-full text-[0.65em] font-bold text-slate-400 uppercase tracking-wider mt-[0.25rem]">Add to Playlist</span>
                      <div className="flex flex-wrap gap-[0.5rem]">
                        {playlists.length === 0 && <span className="text-[0.75em] text-slate-500 italic">No playlists available</span>}
                        {playlists.map(p => (
                          <button key={p.id} onClick={() => { addTrackToPlaylist(p.id, track.path); setOpenMenuId(null); }} className="px-[0.5rem] py-[0.25rem] bg-slate-200 dark:bg-white/10 hover:bg-emerald-500/20 text-slate-700 dark:text-white text-[0.75em] rounded-[0.4rem] transition-colors border border-slate-300 dark:border-white/5">{p.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <UpNextQueue />
    </div>
  );
}