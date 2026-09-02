import { useEffect, useRef } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';

export default function SleepTimerEngine() {
  const { sleepTimer, cancelSleepTimer, setIsPlaying } = useMusicStore();
  const originalVolume = useRef<number>(1);
  const isFading = useRef(false);

  useEffect(() => {
    if (!sleepTimer.active || !sleepTimer.endTime) {
      isFading.current = false;
      return;
    }

    const checkInterval = setInterval(() => {
      const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
      if (!audio) return;

      const now = Date.now();
      const timeLeftMS = sleepTimer.endTime! - now;

      // STRICT MODE LOGIC
      if (sleepTimer.mode === 'strict') {
        if (timeLeftMS <= 30000 && timeLeftMS > 0) {
          // Aakhiri 30 seconds mein volume fade out
          if (!isFading.current) {
            originalVolume.current = audio.volume || 1;
            isFading.current = true;
          }
          const targetVol = (timeLeftMS / 30000) * originalVolume.current;
          audio.volume = Math.max(0, targetVol);
        } else if (timeLeftMS <= 0) {
          // Time Up -> Stop Playback
          audio.pause();
          setIsPlaying(false);
          audio.volume = originalVolume.current; // Volume reset for next time
          cancelSleepTimer();
        }
      } 
      
      // DYNAMIC MODE LOGIC (Finish current track)
      else if (sleepTimer.mode === 'dynamic') {
        if (timeLeftMS <= 0) {
          // Timer khatam hone ke baad gaane ka remaining time track karo
          const trackTimeLeftSec = audio.duration - audio.currentTime;
          
          if (trackTimeLeftSec <= 30 && trackTimeLeftSec > 0) {
            // Gaane ke aakhiri 30 second mein fade out
            if (!isFading.current) {
              originalVolume.current = audio.volume || 1;
              isFading.current = true;
            }
            const targetVol = (trackTimeLeftSec / 30) * originalVolume.current;
            audio.volume = Math.max(0, targetVol);
          } else if (trackTimeLeftSec <= 0.5) {
            // Gaana khatam hote hi stop (Next track play hone se rokna)
            audio.pause();
            setIsPlaying(false);
            audio.volume = originalVolume.current;
            cancelSleepTimer();
          }
        }
      }
    }, 500); // 500ms precision for smooth volume fade

    return () => clearInterval(checkInterval);
  }, [sleepTimer, cancelSleepTimer, setIsPlaying]);

  return null; // Yeh stealth mode mein chalega
}