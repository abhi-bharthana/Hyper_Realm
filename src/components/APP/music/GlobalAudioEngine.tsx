import { useEffect, useRef } from 'react';
import { useMusicStore } from './store';
import { useKeyboardControls } from './hooks/useKeyboardControls'; // 👈 Hook import kiya

export default function GlobalAudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 👈 isMuted aur repeatMode ko store se extract kiya
  const { 
    playlist, 
    currentTrackIndex, 
    isPlaying, 
    nextTrack, 
    prevTrack, 
    setIsPlaying,
    isMuted, 
    repeatMode 
  } = useMusicStore();
  
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;
  const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || (import.meta.env.VITE_APP_TARGET === 'music' ? 8765 : 8765);

  // 🎹 Keyboard Shortcuts Initialize kar diye (Space, M, S, R, Arrows)
  useKeyboardControls();

  // 📱 Lock Screen & Bluetooth Control
  useEffect(() => {
    if (currentTrack && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album,
        artwork: currentTrack.coverUrl ? [{ src: currentTrack.coverUrl, sizes: '512x512', type: 'image/png' }] : []
      });

      navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
    }
  }, [currentTrack, nextTrack, prevTrack, setIsPlaying]);

  // 🚀 Audio Playback Engine
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      
      // 🔥 FIX: Prefer Tauri's native asset URL first, fallback to Rust Stream
      const streamUrl = currentTrack.url || `http://127.0.0.1:${SERVER_PORT}/api/stream?path=${encodeURIComponent(currentTrack.path)}`;
      
      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
        audio.load();
      }

      if (isPlaying) {
        audio.play().catch((e) => {
            console.error("Audio Load/Play Error Details:", e);
            setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying, SERVER_PORT]);

  return (
    <audio 
      ref={audioRef} 
      id="global-audio-player"  // 👈 ProgressBar isko automatically dhoondh lega
      className="hidden" 
      muted={isMuted}           // 👈 Store se mute control hoga
      loop={repeatMode === 'one'} // 👈 Agar repeat 'one' hai, tabhi native loop on hoga
      onEnded={nextTrack} 
      onPause={() => setIsPlaying(false)} 
      onPlay={() => setIsPlaying(true)} 
    />
  );
}