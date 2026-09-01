import React, { useEffect, useRef } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';

export default function GlobalAudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { playlist, currentTrackIndex, isPlaying, nextTrack, prevTrack, setIsPlaying } = useMusicStore();
  const currentTrack = currentTrackIndex !== null ? playlist[currentTrackIndex] : null;

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
      if (audio.src !== currentTrack.url) {
        audio.src = currentTrack.url;
        audio.load();
      }
      if (isPlaying) audio.play().catch(() => setIsPlaying(false));
      else audio.pause();
    }
  }, [currentTrack, isPlaying, setIsPlaying]);

  return <audio ref={audioRef} id="global-audio-player" className="hidden" onEnded={nextTrack} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} />;
}