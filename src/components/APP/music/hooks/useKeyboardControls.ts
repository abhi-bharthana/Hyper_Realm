import { useEffect } from 'react';
import { useMusicStore } from "../store";

export const useKeyboardControls = (onNext?: () => void, onPrev?: () => void) => {
  const { 
    nextTrack, prevTrack, isPlaying, setIsPlaying, 
    toggleMute, toggleShuffle, toggleRepeat 
  } = useMusicStore();

  const triggerNext = onNext || nextTrack;
  const triggerPrev = onPrev || prevTrack;

  useEffect(() => {
    let holdTimeout: NodeJS.Timeout;
    let seekInterval: NodeJS.Timeout;
    let isHolding = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Input field checking
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // 🎵 SPACE: Play / Pause
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }

      // 🔇 M: Mute / Unmute
      if (e.key.toLowerCase() === 'm') {
        toggleMute();
      }

      // 🔀 S: Shuffle
      if (e.key.toLowerCase() === 's') {
        toggleShuffle();
      }

      // 🔁 R: Repeat ('off' -> 'all' -> 'one')
      if (e.key.toLowerCase() === 'r') {
        toggleRepeat();
      }

      // ⬇️ Arrows: Next/Prev
      if (e.key === 'ArrowUp') { e.preventDefault(); triggerPrev(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); triggerNext(); }
      
      // ⏩ Arrows: Seek
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.repeat) return; 
        e.preventDefault();
        isHolding = false;
        
        holdTimeout = setTimeout(() => {
          isHolding = true;
          seekInterval = setInterval(() => {
            const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
            if (audio && audio.duration) {
              const newTime = audio.currentTime + (e.key === 'ArrowRight' ? 3 : -3);
              audio.currentTime = Math.max(0, Math.min(newTime, audio.duration));
            }
          }, 100);
        }, 250);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        clearTimeout(holdTimeout);
        clearInterval(seekInterval);
        
        if (!isHolding) {
          if (e.key === 'ArrowRight') triggerNext();
          if (e.key === 'ArrowLeft') triggerPrev();
        }
        isHolding = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(holdTimeout);
      clearInterval(seekInterval);
    };
  }, [triggerNext, triggerPrev, isPlaying, setIsPlaying, toggleMute, toggleShuffle, toggleRepeat]);
};