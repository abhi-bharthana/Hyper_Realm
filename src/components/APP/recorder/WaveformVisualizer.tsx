import React, { useEffect, useRef } from 'react';
import { useRecorderStore } from "./store"; 
import { listen } from '@tauri-apps/api/event';

export const WaveformVisualizer = () => {
  const { isRecording, addTranscript } = useRecorderStore();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Hum 40 bars ke liye ek history array maintain karenge
  const rmsHistoryRef = useRef<number[]>(new Array(40).fill(0));
  const animationRef = useRef<number>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let unlisten: () => void;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI displays ke liye crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    // Canvas drawing setup
    const barCount = 40;
    const gap = 4 * dpr;
    const barWidth = (canvas.width - (gap * (barCount - 1))) / barCount;

    if (isRecording) {
      // 1. Rust backend se audio levels suno
      const setupListener = async () => {
        unlisten = await listen<number>('audio-level', (event) => {
          // Nayi volume value ko end mein dalo aur purani nikal do (Scrolling effect)
          const history = rmsHistoryRef.current;
          history.push(event.payload);
          history.shift();
        });
      };
      setupListener();

      // 2. React UI ke bina fast canvas drawing
      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#3b82f6'; // Tailwind bg-blue-500

        const history = rmsHistoryRef.current;
        for (let i = 0; i < barCount; i++) {
          // RMS value usually 0.0 se 0.3 ke beech hoti hai, isliye thoda multiply kiya (e.g., * 5)
          const rawVolume = history[i] * 5.0; 
          const percent = Math.min(rawVolume, 1.0); // 100% se upar na jaye
          
          const minHeight = canvas.height * 0.1; // 10% resting state
          const barHeight = Math.max(minHeight, canvas.height * percent);
          
          const x = i * (barWidth + gap);
          const y = (canvas.height - barHeight) / 2; // Center vertically
          
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
          ctx.fill();
        }
      };
      
      draw();

      // 3. Fake AI Transcripts (Future mein ise bhi Rust se hook karenge)
      intervalRef.current = setInterval(() => {
        if (useRecorderStore.getState().isTranscriptEnabled) {
          const phrases = ["System audio initialized.", "Processing voice command...", "Hyper Realm node active."];
          addTranscript(phrases[Math.floor(Math.random() * phrases.length)]);
        }
      }, 3000);

    } else {
      // Idle state draw karo jab recording band ho
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#94a3b8'; // Tailwind bg-slate-400
      
      const minHeight = canvas.height * 0.1;
      // Reset history
      rmsHistoryRef.current = new Array(40).fill(0);

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const y = (canvas.height - minHeight) / 2;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, minHeight, barWidth / 2);
        ctx.fill();
      }

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (unlisten) unlisten();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRecording, addTranscript]);

  return (
    <div className="h-32 bg-slate-200/50 dark:bg-[#0f0f13] rounded-xl border border-slate-300 dark:border-gray-800/60 flex items-center justify-center overflow-hidden relative w-full mb-6 shadow-inner transition-colors duration-300">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full px-4" 
        style={{ opacity: isRecording ? 1 : 0.5 }}
      />
      {!isRecording && (
        <span className="absolute text-slate-500 dark:text-gray-600 font-bold tracking-widest text-sm pointer-events-none">
          READY TO RECORD
        </span>
      )}
    </div>
  );
};