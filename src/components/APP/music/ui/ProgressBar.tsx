import React, { useState, useEffect } from 'react';
import { Track, useMusicStore } from '../../../../store/useMusicStore';

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ProgressBar() {
  const { isPlaying } = useMusicStore();
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
        if (audio && audio.duration && !isNaN(audio.duration)) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(formatTime(audio.currentTime));
          setDuration(formatTime(audio.duration));
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audio && audio.duration) {
      const seekTime = (Number(e.target.value) / 100) * audio.duration;
      audio.currentTime = seekTime;
      setProgress(Number(e.target.value));
      setCurrentTime(formatTime(seekTime));
    }
  };

  return (
    <div className="w-full flex items-center gap-[0.75rem] text-[0.75em] font-mono text-slate-500 dark:text-white/40 mb-[1.5rem]">
      <span>{currentTime}</span>
      <input type="range" min="0" max="100" value={progress || 0} onChange={handleSeek} className="flex-1 h-[0.4rem] bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-slate-900 dark:accent-white" />
      <span>{duration}</span>
    </div>
  );
}