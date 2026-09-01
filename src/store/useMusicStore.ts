import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  url: string; 
  path: string; 
}

export interface PlaylistData {
  id: string;
  name: string;
  trackPaths: string[];
}

interface MusicState {
  playlist: Track[];
  historyPaths: string[]; 
  savedDirectories: string[];
  playlists: PlaylistData[]; 
  favorites: string[]; 
  
  // 🔀 Naye States (Queue, Shuffle, Repeat)
  queue: string[];
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  
  currentTrackIndex: number | null;
  isPlaying: boolean;
  
  addDirectory: (path: string) => void;
  removeDirectory: (path: string) => void;
  setPlaylist: (tracks: Track[]) => void;
  
  playTrack: (index: number) => void;
  playTrackByPath: (path: string) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setIsPlaying: (playing: boolean) => void;
  
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackPath: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackPath: string) => void;
  toggleFavorite: (path: string) => void;
  
  // 🔀 Naye Actions
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (path: string) => void;
  playNext: (path: string) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      playlist: [],
      historyPaths: [],
      savedDirectories: [], 
      playlists: [],
      favorites: [], 
      queue: [],
      isShuffle: false,
      repeatMode: 'off',
      currentTrackIndex: null,
      isPlaying: false,

      addDirectory: (path) => set((state) => ({ savedDirectories: state.savedDirectories.includes(path) ? state.savedDirectories : [...state.savedDirectories, path] })),
      removeDirectory: (path) => set((state) => ({ savedDirectories: state.savedDirectories.filter(d => d !== path), playlist: state.playlist.filter(t => !t.path.startsWith(path)) })),
      setPlaylist: (tracks) => set({ playlist: tracks }),

      playTrack: (index) => set((state) => {
        const track = state.playlist[index];
        if (!track) return state;
        const newHistory = [track.path, ...state.historyPaths.filter(p => p !== track.path)].slice(0, 50);
        return { currentTrackIndex: index, isPlaying: true, historyPaths: newHistory };
      }),

      playTrackByPath: (path) => {
        const { playlist, playTrack } = get();
        const index = playlist.findIndex(t => t.path === path);
        if (index !== -1) playTrack(index);
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (playing) => set({ isPlaying: playing }),

      // 🧠 SMART NEXT TRACK LOGIC (Queue -> Repeat 1 -> Shuffle -> Normal)
      nextTrack: () => {
        const { currentTrackIndex, playlist, playTrack, queue, isShuffle, repeatMode } = get();
        if (playlist.length === 0) return;

        if (repeatMode === 'one' && currentTrackIndex !== null) {
          playTrack(currentTrackIndex); // Wahi gaana wapas chalega
          return;
        }

        if (queue.length > 0) {
          const nextPath = queue[0];
          set({ queue: queue.slice(1) }); // Queue se gaana hatao
          const nextIndex = playlist.findIndex(t => t.path === nextPath);
          if (nextIndex !== -1) { playTrack(nextIndex); return; }
        }

        if (isShuffle) {
          const randomIndex = Math.floor(Math.random() * playlist.length);
          playTrack(randomIndex);
          return;
        }

        if (currentTrackIndex !== null) {
          if (currentTrackIndex + 1 < playlist.length) {
            playTrack(currentTrackIndex + 1);
          } else if (repeatMode === 'all') {
            playTrack(0); // Playlist khatam hone par shuru se lagao
          } else {
            set({ isPlaying: false }); // Stop playing
          }
        }
      },

      prevTrack: () => {
        const { currentTrackIndex, playlist, playTrack } = get();
        if (currentTrackIndex === null || playlist.length === 0) return;
        playTrack(currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1);
      },

      createPlaylist: (name) => set((state) => ({ playlists: [...state.playlists, { id: Date.now().toString(), name, trackPaths: [] }] })),
      deletePlaylist: (id) => set((state) => ({ playlists: state.playlists.filter(p => p.id !== id) })),
      addTrackToPlaylist: (playlistId, trackPath) => set((state) => ({ playlists: state.playlists.map(p => p.id === playlistId && !p.trackPaths.includes(trackPath) ? { ...p, trackPaths: [...p.trackPaths, trackPath] } : p) })),
      removeTrackFromPlaylist: (playlistId, trackPath) => set((state) => ({ playlists: state.playlists.map(p => p.id === playlistId ? { ...p, trackPaths: p.trackPaths.filter(tp => tp !== trackPath) } : p) })),
      toggleFavorite: (path) => set((state) => ({ favorites: state.favorites.includes(path) ? state.favorites.filter(p => p !== path) : [...state.favorites, path] })),

      // 🔀 Queue Actions
      toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
      toggleRepeat: () => set((state) => {
        const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
        const nextIndex = (modes.indexOf(state.repeatMode) + 1) % modes.length;
        return { repeatMode: modes[nextIndex] };
      }),
      addToQueue: (path) => set((state) => ({ queue: [...state.queue, path] })),
      playNext: (path) => set((state) => ({ queue: [path, ...state.queue] })), // Queue mein sabse aage daalo
      removeFromQueue: (index) => set((state) => ({ queue: state.queue.filter((_, i) => i !== index) })),
      clearQueue: () => set({ queue: [] }),
    }),
    { 
      name: 'hyper-music-native-v6', // Bump to v6
      partialize: (state) => ({ 
        savedDirectories: state.savedDirectories, historyPaths: state.historyPaths, 
        playlists: state.playlists, favorites: state.favorites, 
        isShuffle: state.isShuffle, repeatMode: state.repeatMode 
      })
    }
  )
);