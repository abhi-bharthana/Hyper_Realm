import React, { useState, useEffect } from 'react';
import { FolderSearch, History, ListMusic, Volume2, HardDrive, Trash2, Loader2, RefreshCw, FolderCog, Plus, List, MoreVertical, X, FolderPlus, Heart, ListOrdered, ChevronUp, ChevronDown } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { useMusicStore, Track, PlaylistData } from '../../../store/useMusicStore';
import { scanNativeDirectory } from './musicScanner';

// 🎨 DYNAMIC COVER COMPONENT (Same as before)
const PlaylistCover = ({ trackPaths, allTracks, historyPaths }: { trackPaths: string[], allTracks: Track[], historyPaths: string[] }) => {
  const playlistTracks = trackPaths.map(p => allTracks.find(t => t.path === p)).filter(Boolean) as Track[];
  const sortedTracks = [...playlistTracks].sort((a, b) => {
    const indexA = historyPaths.indexOf(a.path);
    const indexB = historyPaths.indexOf(b.path);
    return (indexA === -1 ? 9999 : indexA) - (indexB === -1 ? 9999 : indexB);
  });
  const uniqueCovers = Array.from(new Set(sortedTracks.map(t => t.coverUrl).filter(url => url !== '')));
  const covers = uniqueCovers.slice(0, 4);

  if (covers.length === 0) return <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"><List size={20} /></div>;
  if (covers.length === 1) return <img src={covers[0]} className="w-11 h-11 md:w-12 md:h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-white/10" alt="Cover" />;
  if (covers.length === 2) return <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden shrink-0 grid grid-cols-2 gap-[2px] bg-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-white/10"><img src={covers[0]} className="w-full h-full object-cover" alt="Cover 1" /><img src={covers[1]} className="w-full h-full object-cover" alt="Cover 2" /></div>;
  if (covers.length === 3) return <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden shrink-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-white/10"><img src={covers[0]} className="w-full h-full object-cover col-span-2 row-span-1" alt="Cover 1" /><img src={covers[1]} className="w-full h-full object-cover col-span-1 row-span-1" alt="Cover 2" /><img src={covers[2]} className="w-full h-full object-cover col-span-1 row-span-1" alt="Cover 3" /></div>;
  return <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden shrink-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-white/10"><img src={covers[0]} className="w-full h-full object-cover" alt="Cover 1" /><img src={covers[1]} className="w-full h-full object-cover" alt="Cover 2" /><img src={covers[2]} className="w-full h-full object-cover" alt="Cover 3" /><img src={covers[3]} className="w-full h-full object-cover" alt="Cover 4" /></div>;
};

export default function MusicCollection() {
  const { 
    playlist, historyPaths, savedDirectories, playlists, favorites, queue,
    currentTrackIndex, isPlaying, 
    playTrack, playTrackByPath, setPlaylist, addDirectory, removeDirectory, 
    createPlaylist, deletePlaylist, addTrackToPlaylist, removeTrackFromPlaylist, toggleFavorite,
    addToQueue, playNext, removeFromQueue, clearQueue
  } = useMusicStore();
  
  const [activeView, setActiveView] = useState<'library' | 'history' | 'playlists' | 'folders'>('library');
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  // Naya State: Floating Queue bar ko open/close karne ke liye
  const [isQueueExpanded, setIsQueueExpanded] = useState(false);

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

  const handleNativeFolderSelect = async () => {
    try {
      const selectedPath = await open({ directory: true, multiple: false });
      if (selectedPath && typeof selectedPath === 'string') {
        setIsScanning(true);
        addDirectory(selectedPath);
        const tracks = await scanNativeDirectory(selectedPath);
        const mergedTracks = [...playlist, ...tracks.filter(newTrack => !playlist.some(p => p.path === newTrack.path))];
        setPlaylist(mergedTracks);
        setIsScanning(false);
      }
    } catch (error) { setIsScanning(false); }
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
    <div className="w-full md:w-80 lg:w-[340px] shrink-0 bg-slate-100/50 dark:bg-black/20 backdrop-blur-3xl border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/5 flex flex-col relative z-10 h-1/2 md:h-full">
      
      {/* HEADER SECTION */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-white/5 flex flex-col gap-3 md:gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-wide">
            {activeView === 'folders' ? 'Manage Folders' : activeView === 'playlists' && selectedPlaylist ? selectedPlaylist.name : 'Collection'}
          </h3>
          <div className="flex gap-2">
            {activeView === 'playlists' && selectedPlaylist && <button onClick={() => setSelectedPlaylist(null)} className="p-1.5 bg-slate-200 dark:bg-white/10 rounded-lg"><X size={14} /></button>}
            {savedDirectories.length > 0 && activeView === 'library' && (
              <button onClick={syncAllDirectories} className="p-1.5 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white rounded-lg hover:text-blue-500 transition-colors" title="Sync Library">
                <RefreshCw size={14} className={isScanning ? "animate-spin" : ""} />
              </button>
            )}
          </div>
        </div>

        <div className="flex bg-slate-200/70 dark:bg-white/5 p-1 rounded-lg">
          {[
            { id: 'library', icon: <ListMusic size={14}/>, label: 'All' },
            { id: 'history', icon: <History size={14}/>, label: 'Recent' },
            { id: 'playlists', icon: <List size={14}/>, label: 'Playlists' },
            { id: 'folders', icon: <FolderCog size={14}/>, label: 'Folders' }
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveView(tab.id as any); setSelectedPlaylist(null); setOpenMenuId(null); }} className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] md:text-xs font-bold py-1.5 rounded-md transition-all ${activeView === tab.id ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-white/50 dark:hover:text-white'}`}>
              {tab.icon} <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* SCROLLABLE LIST SECTION */}
      <div className={`flex-1 overflow-y-auto p-2 md:p-3 custom-scrollbar ${queue.length > 0 ? 'pb-16' : ''}`}>
        
        {activeView === 'folders' && (
          <div className="flex flex-col gap-3">
            <button onClick={handleNativeFolderSelect} disabled={isScanning} className="flex items-center justify-center gap-2 px-3 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold rounded-xl border border-blue-500/20 transition-all">
              {isScanning ? <Loader2 size={16} className="animate-spin" /> : <FolderPlus size={16} />} {isScanning ? 'Scanning...' : 'Sync New Folder'}
            </button>
            {savedDirectories.map(dir => (
              <div key={dir} className="flex items-center justify-between bg-white/60 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3 overflow-hidden">
                  <HardDrive size={16} className="text-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-white/80 truncate" title={dir}>{dir.split('/').pop() || dir.split('\\').pop() || dir}</span>
                </div>
                <button onClick={() => removeDirectory(dir)} className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {activeView === 'playlists' && !selectedPlaylist && (
          <div className="flex flex-col gap-2">
            <div className="group flex items-center justify-between bg-white/60 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5 hover:border-red-500/30 transition-all cursor-pointer mb-2" onClick={() => setSelectedPlaylist({ id: 'favorites', name: 'Liked Songs', trackPaths: favorites })}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <PlaylistCover trackPaths={favorites} allTracks={playlist} historyPaths={historyPaths} />
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1 border-2 border-white dark:border-[#111111]"><Heart size={10} fill="currentColor" /></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">Liked Songs</h4>
                  <p className="text-xs text-slate-500">{favorites.length} tracks</p>
                </div>
              </div>
            </div>
            <button onClick={handleCreatePlaylist} className="flex items-center justify-center gap-2 px-3 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold rounded-xl border border-emerald-500/20 transition-all mb-2"><Plus size={16} /> Create Playlist</button>
            {playlists.map(p => (
              <div key={p.id} className="group flex items-center justify-between bg-white/60 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => setSelectedPlaylist(p)}>
                <div className="flex items-center gap-3">
                  <PlaylistCover trackPaths={p.trackPaths} allTracks={playlist} historyPaths={historyPaths} />
                  <div><h4 className="text-sm font-bold text-slate-800 dark:text-white">{p.name}</h4><p className="text-xs text-slate-500">{p.trackPaths.length} tracks</p></div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deletePlaylist(p.id); }} className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {/* 🎼 MAIN TRACKS RENDERER */}
        {activeView !== 'folders' && (activeView !== 'playlists' || selectedPlaylist) && (
          <div className="space-y-1.5">
            {displayList.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/30 text-center px-4 pt-10"><FolderSearch size={32} className="mb-3 opacity-50" /><p className="text-xs md:text-sm font-bold mb-1 text-slate-600 dark:text-white/50">Nothing found</p></div>
            ) : (
              displayList.map((track, idx) => (
                <div key={track.id + idx} className={`relative flex flex-col p-2 rounded-xl transition-all ${currentTrack?.path === track.path ? 'bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm' : 'hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent'}`}>
                  
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => activeView === 'library' ? playTrack(idx) : playTrackByPath(track.path)}>
                    <div className="relative w-9 h-9 shrink-0 rounded-xl overflow-hidden bg-slate-200 dark:bg-neutral-800 border border-slate-200 dark:border-white/5">
                      <img src={track.coverUrl || 'placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                      {currentTrack?.path === track.path && isPlaying && <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]"><Volume2 size={14} className="text-white animate-pulse" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs md:text-sm font-bold truncate ${currentTrack?.path === track.path ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-white/70'}`}>{track.title}</p>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-white/40 truncate">{track.artist}</p>
                    </div>
                    
                    {/* ALWAYS SHOW 3 DOTS NOW */}
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === track.id ? null : track.id); }} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>

                  {/* INLINE ACTION MENU */}
                  {openMenuId === track.id && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      
                      {/* Queue Actions */}
                      <div className="flex gap-2">
                        <button onClick={() => { playNext(track.path); setOpenMenuId(null); }} className="flex-1 px-2 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg transition-colors border border-blue-500/20">Play Next</button>
                        <button onClick={() => { addToQueue(track.path); setOpenMenuId(null); }} className="flex-1 px-2 py-1.5 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold rounded-lg transition-colors border border-slate-300 dark:border-white/5">Add to Queue</button>
                      </div>

                      {/* Remove from Playlist (Agar playlist ke andar ho tabhi dikhega) */}
                      {selectedPlaylist && (
                        <button 
                          onClick={() => { 
                            selectedPlaylist.id === 'favorites' ? toggleFavorite(track.path) : removeTrackFromPlaylist(selectedPlaylist.id, track.path); 
                            setOpenMenuId(null); 
                          }} 
                          className="w-full px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-colors border border-red-500/20"
                        >
                          Remove from this Playlist
                        </button>
                      )}

                      {/* Add to other Playlists */}
                      <span className="w-full text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Add to Playlist</span>
                      <div className="flex flex-wrap gap-2">
                        {playlists.length === 0 && <span className="text-xs text-slate-500 italic">No playlists available</span>}
                        {playlists.map(p => (
                          <button key={p.id} onClick={() => { addTrackToPlaylist(p.id, track.path); setOpenMenuId(null); }} className="px-2 py-1 bg-slate-200 dark:bg-white/10 hover:bg-emerald-500/20 text-slate-700 dark:text-white text-xs rounded-md transition-colors border border-slate-300 dark:border-white/5">{p.name}</button>
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

      {/* 📥 FLOATING UP-NEXT QUEUE BAR */}
      {queue.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-3xl border-t border-slate-200 dark:border-white/10 z-30 transition-all duration-300 rounded-bl-3xl lg:rounded-bl-none shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => setIsQueueExpanded(!isQueueExpanded)}>
            <div className="flex items-center gap-2">
              <ListOrdered size={16} className="text-blue-500" />
              <span className="text-sm font-bold text-slate-800 dark:text-white">Up Next <span className="text-blue-500 bg-blue-500/10 px-1.5 rounded-md text-[10px] ml-1">{queue.length}</span></span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={(e) => { e.stopPropagation(); clearQueue(); setIsQueueExpanded(false); }} className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-red-500 transition-colors">Clear</button>
              <div className="p-1 bg-slate-100 dark:bg-white/10 rounded-md text-slate-500 dark:text-white/60">
                {isQueueExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </div>
            </div>
          </div>
          
          {/* Expanded Queue List */}
          {isQueueExpanded && (
            <div className="max-h-56 overflow-y-auto custom-scrollbar p-2 space-y-1 animate-in slide-in-from-bottom-2">
              {queue.map((path, idx) => {
                const qTrack = playlist.find(t => t.path === path);
                if (!qTrack) return null;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors group">
                    <img src={qTrack.coverUrl || 'placeholder.jpg'} className="w-8 h-8 rounded-lg object-cover bg-slate-200 dark:bg-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{qTrack.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-white/50 truncate">{qTrack.artist}</p>
                    </div>
                    <button onClick={() => removeFromQueue(idx)} className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"><X size={14}/></button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}