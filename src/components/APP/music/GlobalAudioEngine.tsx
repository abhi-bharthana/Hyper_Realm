import { useEffect, useRef } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';

export default function GlobalAudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { playlist, currentTrackIndex, isPlaying, nextTrack, prevTrack, setIsPlaying } = useMusicStore();
  
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;
  const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || (import.meta.env.VITE_APP_TARGET === 'music' ? 8765 : 8765);

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
      
      // 🔥 THE ULTIMATE FIX: Android WebView Security Bypass using Rust Stream
      const streamUrl = `http://127.0.0.1:${SERVER_PORT}/api/stream?path=${encodeURIComponent(currentTrack.path)}`;
      
      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
        audio.load();
      }

      if (isPlaying) {
        audio.play().catch((e) => {
            console.error("Playback failed:", e);
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
      onEnded={nextTrack} 
      onPause={() => setIsPlaying(false)} 
      onPlay={() => setIsPlaying(true)} 
    />
  );
}