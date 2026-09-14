import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Pause, Play, ListMusic } from 'lucide-react';
import { Card, Button, Heading, Text } from '@/shared-ui';
import { useRecorderStore } from './store';

// Timer formatting utility (e.g., 00:05:23)
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function RecorderApp() {
  const { isRecording, isPaused, duration, startRecording, pauseRecording, resumeRecording, stopRecording, tick } = useRecorderStore();

  // Simple Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, tick]);

  return (
    <Card variant="glass" padding="lg" className="h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* --- Header --- */}
      <div className="flex items-center justify-between z-10">
        <Text variant="muted" className="tracking-widest">Standard Recording</Text>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <ListMusic size={20} />
        </Button>
      </div>

      {/* --- Middle: Huge Timer & Waveform --- */}
      <div className="flex flex-col items-center justify-center flex-grow z-10 space-y-8">
        
        <Heading 
          level="h1" 
          className="text-6xl md:text-8xl font-light tabular-nums tracking-wider text-white drop-shadow-lg transition-all duration-300"
        >
          {formatTime(duration)}
        </Heading>

        {/* Minimalist Waveform Placeholder (Samsung Style red line when idle, waves when recording) */}
        <div className="h-24 w-full max-w-md flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!isRecording ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full h-[2px] bg-gray-600/50 rounded-full"
              />
            ) : (
              <motion.div 
                key="recording"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full h-full flex items-center justify-center gap-1"
              >
                {/* Simulated active waves - Replace with your actual WaveformVisualizer later */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isPaused ? '4px' : ['4px', `${Math.random() * 60 + 10}px`, '4px'],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + Math.random() * 0.5,
                      ease: "easeInOut"
                    }}
                    className={`w-1 rounded-full ${isPaused ? 'bg-gray-500' : 'bg-red-500'}`}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Status Text */}
        <Text className={`text-sm font-medium transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-0'} ${isPaused ? 'text-gray-400' : 'text-red-400 animate-pulse'}`}>
          {isPaused ? 'Recording Paused' : 'Recording...'}
        </Text>
      </div>

      {/* --- Bottom Controls --- */}
      <div className="flex items-center justify-center gap-8 z-10 pb-4">
        
        {/* Stop Button (Only shows when recording) */}
        <AnimatePresence>
          {isRecording && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={stopRecording}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-gray-300"
              >
                <Square size={20} fill="currentColor" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Record/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={!isRecording ? startRecording : (isPaused ? resumeRecording : pauseRecording)}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 shadow-xl ${
            !isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20'
          }`}
        >
          {/* Inner pulsating ring when recording */}
          {isRecording && !isPaused && (
            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20"></span>
          )}
          
          {!isRecording ? (
            <Mic size={32} className="text-white" />
          ) : isPaused ? (
             <Play size={28} className="text-white ml-1" fill="currentColor" />
          ) : (
             <Pause size={28} className="text-red-500" fill="currentColor" />
          )}
        </motion.button>

        {/* Placeholder for list/settings if needed to balance the UI */}
        <AnimatePresence>
          {isRecording && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
               <div className="w-14 h-14" /> {/* Empty div to keep the center button perfectly centered */}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </Card>
  );
}