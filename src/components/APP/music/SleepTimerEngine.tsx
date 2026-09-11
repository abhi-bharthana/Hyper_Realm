import { useEffect, useRef } from 'react';
import { useMusicStore } from '../../../store/useMusicStore';

export default function SleepTimerEngine() {
  const { sleepTimer, cancelSleepTimer, setIsPlaying } = useMusicStore();
  const originalVolume = useRef<number>(1);
  const isFading = useRef(false);

  useEffect(() => {
    // Agar timer active nahi hai, toh fading flag reset kar do
    if (!sleepTimer.active || !sleepTimer.endTime) {
      isFading.current = false;
      return;
    }

    const checkInterval = setInterval(() => {
      const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
      if (!audio || !audio.duration) return;

      const now = Date.now();
      const timeLeftMS = sleepTimer.endTime! - now;
      const timeLeftSec = timeLeftMS / 1000;
      const trackTimeLeftSec = audio.duration - audio.currentTime;

      // ⏳ STRICT MODE LOGIC
      if (sleepTimer.mode === 'strict') {
        if (timeLeftSec <= 30 && timeLeftSec > 0) {
          // Aakhiri 30 seconds mein volume fade out
          if (!isFading.current) {
            originalVolume.current = audio.volume || 1;
            isFading.current = true;
          }
          const targetVol = (timeLeftSec / 30) * originalVolume.current;
          audio.volume = Math.max(0, targetVol);
        } else if (timeLeftSec <= 0) {
          // Time Up -> Interval roko aur Playback stop karo
          clearInterval(checkInterval);
          audio.pause();
          setIsPlaying(false);
          audio.volume = originalVolume.current; // Volume reset for next time
          cancelSleepTimer();
        }
      } 
      
      // 🎵 DYNAMIC MODE LOGIC (Smart Finish)
      else if (sleepTimer.mode === 'dynamic') {
        // Condition: Kya yeh aakhiri gaana hona chahiye?
        // True IF: Timer is gaane ke dauran khatam ho raha hai 
        // OR Timer is gaane ke khatam hone ke agle 120 seconds (2 mins) ke andar khatam ho jayega.
        const isFinalTrack = timeLeftSec <= (trackTimeLeftSec + 120);

        if (isFinalTrack) {
          if (trackTimeLeftSec <= 30 && trackTimeLeftSec > 1.5) {
            // Gaane ke aakhiri 30 second mein fade out
            if (!isFading.current) {
              originalVolume.current = audio.volume || 1;
              isFading.current = true;
            }
            const targetVol = (trackTimeLeftSec / 30) * originalVolume.current;
            audio.volume = Math.max(0, targetVol);
          } else if (trackTimeLeftSec <= 1.5) {
            // FIX: Gaana khatam hone se theek 1.5 sec pehle hi stop kar do
            // Taaki global player next song auto-play na kar de
            clearInterval(checkInterval);
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

  return null; // Stealth mode component
}