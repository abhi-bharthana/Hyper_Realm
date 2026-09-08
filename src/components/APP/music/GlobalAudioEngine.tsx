import { useEffect, useRef } from 'react'; // 🔥 Unused 'React' hata diya taaki TS error na aaye
import { useMusicStore } from '../../../store/useMusicStore';

export default function GlobalAudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { playlist, currentTrackIndex, isPlaying, nextTrack, prevTrack, setIsPlaying } = useMusicStore();
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

  // 🔥 NAYA LOGIC: Dynamic Port (Vite env se uthayega, warna default 8765 use karega)
  const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || (import.meta.env.VITE_APP_TARGET === 'music' ? 8765 : 8765);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      
      // 💡 TIP: Agar aapka audio file Tauri default protocol se slow load ho raha ho, 
      // toh aap Video Player ki tarah Axum server URL use kar sakte hain. 
      // Uske liye neeche wali line uncomment karke trackUrl ki jagah use kar lena:
      // const streamUrl = `http://127.0.0.1:${SERVER_PORT}/stream?path=${encodeURIComponent(currentTrack.url)}`;
      
      const trackUrl = currentTrack.url; // Abhi ke liye purana safe logic

      if (audio.src !== trackUrl) {
        audio.src = trackUrl;
        audio.load();
      }
      if (isPlaying) audio.play().catch(() => setIsPlaying(false));
      else audio.pause();
    }
  }, [currentTrack, isPlaying, setIsPlaying, SERVER_PORT]);

  return <audio ref={audioRef} id="global-audio-player" className="hidden" onEnded={nextTrack} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />;
}