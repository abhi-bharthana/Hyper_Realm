import React, { useEffect, useRef } from 'react';
import { useRecorderStore } from '../../../store/useRecorderStore';

export const WaveformVisualizer = () => {
  const { isRecording, volume, setVolume, addTranscript } = useRecorderStore();
  
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          streamRef.current = stream;
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioCtx;
          
          const analyzer = audioCtx.createAnalyser();
          analyzer.fftSize = 256;
          
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyzer);

          const dataArray = new Uint8Array(analyzer.frequencyBinCount);

          const draw = () => {
            analyzer.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const avgVolume = sum / dataArray.length;
            setVolume(avgVolume);
            animationRef.current = requestAnimationFrame(draw);
          };
          draw();

          intervalRef.current = setInterval(() => {
            // 🚀 Sirf tabhi fake text generate hoga jab STT Enabled ho
            if (useRecorderStore.getState().isTranscriptEnabled) {
              const phrases = ["System audio initialized.", "Processing voice command...", "Hyper Realm node active."];
              addTranscript(phrases[Math.floor(Math.random() * phrases.length)]);
            }
          }, 3000);
        })
        .catch((err) => console.error("Mic Error:", err));
    } else {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setVolume(0);
    }
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, setVolume, addTranscript]);

  return (
    <div className="h-32 bg-slate-200/50 dark:bg-[#0f0f13] rounded-xl border border-slate-300 dark:border-gray-800/60 flex items-center justify-center overflow-hidden relative w-full mb-6 shadow-inner transition-colors duration-300">
      <div className="flex items-center justify-center gap-[4px] h-full w-full px-4">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className={`w-2 rounded-full transition-all duration-75 ease-out ${isRecording ? 'bg-blue-500' : 'bg-slate-300 dark:bg-gray-800'}`}
            style={{ 
              height: isRecording ? `${Math.max(10, volume * (Math.random() * 1.5 + 0.5))}%` : '10%',
              opacity: isRecording ? 1 : 0.5
            }}
          />
        ))}
      </div>
      {!isRecording && <span className="absolute text-slate-500 dark:text-gray-600 font-bold tracking-widest text-sm">READY TO RECORD</span>}
    </div>
  );
};