import { useEffect } from 'react';
import { useMusicStore } from '../../../../store/useMusicStore';

export const useKeyboardControls = (onNext?: () => void, onPrev?: () => void) => {
  const { nextTrack, prevTrack } = useMusicStore();
  const triggerNext = onNext || nextTrack;
  const triggerPrev = onPrev || prevTrack;

  useEffect(() => {
    let holdTimeout: NodeJS.Timeout;
    let seekInterval: NodeJS.Timeout;
    let isHolding = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowUp') { e.preventDefault(); triggerPrev(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); triggerNext(); }
      
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
  }, [triggerNext, triggerPrev]);
};