import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Pause, Play, ListMusic } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { Card, Button, Heading, Text } from '@/shared-ui';
import { useRecorderStore } from './store';
import { WaveformVisualizer } from './WaveformVisualizer'; 
import { PostRecordingView } from './PostRecordingView';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}; // <-- Missing brace fixed here

export const RecorderApp = () => {
  const { 
    isRecording, isPaused, duration, showPostView, recordings,
    startRecording, pauseRecording, resumeRecording, stopRecording, tick 
  } = useRecorderStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused, tick]);

  const handleStart = async () => {
    try {
      await invoke('start_recording');
      startRecording();
    } catch (err) {
      console.error("Failed to start:", err);
      alert(`Backend Error: ${err}`);
      startRecording(); 
    }
  };

  const handlePauseResume = async () => {
    try {
      if (isPaused) {
        await invoke('resume_recording');
        resumeRecording();
      } else {
        await invoke('pause_recording');
        pauseRecording();
      }
    } catch (err) {
      console.error("Failed to pause/resume:", err);
      isPaused ? resumeRecording() : pauseRecording();
    }
  };

  const handleStop = async () => {
    try {
      const filePath = await invoke<string>('stop_recording');
      stopRecording(filePath); 
    } catch (err) {
      console.error("Failed to stop:", err);
      alert(`Backend Error: ${err}\nTesting Save Pannel...`);
      stopRecording("/test/dummy_recording.wav");
    }
  };

  // <-- Missing braces fixed for the conditional block
  if (showPostView) {
    return <PostRecordingView />;
  }

  return (
    <Card variant="glass" padding="lg" className="h-full flex flex-col justify-between relative overflow-hidden bg-[#0f0f13]">
      {/* --- Header --- */}
      <div className="flex items-center justify-between z-10">
        <Text variant="muted" className="tracking-widest uppercase">Standard Recording</Text>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <ListMusic size={20} />
        </Button>
      </div>

      {/* --- Middle --- */}
      <div className="flex flex-col items-center justify-center flex-grow z-10 space-y-8 mt-8">
        <Heading 
          level="h1" 
          className="text-6xl md:text-8xl font-light tabular-nums tracking-wider text-white drop-shadow-lg transition-all duration-300"
        >
          {formatTime(duration)}
        </Heading>

        <div className="w-full max-w-md">
          <WaveformVisualizer />
        </div>
        
        <Text className={`text-sm font-medium transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-0'} ${isPaused ? 'text-gray-400' : 'text-red-400 animate-pulse'}`}>
          {isPaused ? 'Recording Paused' : 'Recording...'}
        </Text>
      </div>

      {/* --- Bottom Controls --- */}
      <div className="flex items-center justify-center gap-8 z-10 pb-8 mt-auto">
        <AnimatePresence>
          {isRecording && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleStop}
                className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-gray-300"
              >
                <Square size={20} fill="currentColor" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={!isRecording ? handleStart : handlePauseResume}
          className={`relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 shadow-xl ${
            !isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
              : 'bg-white/10 hover:bg-white/20 border border-white/20'
          }`}
        >
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

        <AnimatePresence>
          {isRecording && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
               <div className="w-14 h-14" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Saved Recordings List --- */}
      <AnimatePresence>
        {!isRecording && recordings.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto mt-4 border-t border-gray-800 pt-4 max-h-40 overflow-y-auto"
          >
            <Text variant="muted" className="text-xs uppercase tracking-widest mb-3">Recent</Text>
            <div className="flex flex-col gap-2">
              {recordings.map((rec) => (
                <div key={rec.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                  <div className="flex flex-col">
                    <span className="font-medium text-white text-sm">{rec.name}</span>
                    <span className="text-xs text-gray-400">{rec.date}</span>
                  </div>
                  <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded text-gray-300">
                    {formatTime(rec.duration)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default RecorderApp;