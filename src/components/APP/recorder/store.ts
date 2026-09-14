import { create } from 'zustand';

interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; // in seconds
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  tick: () => void; // timer badhane ke liye
}

export const useRecorderStore = create<RecorderState>((set) => ({
  isRecording: false,
  isPaused: false,
  duration: 0,
  
  startRecording: () => set({ isRecording: true, isPaused: false, duration: 0 }),
  pauseRecording: () => set({ isPaused: true }),
  resumeRecording: () => set({ isPaused: false }),
  stopRecording: () => set({ isRecording: false, isPaused: false, duration: 0 }),
  tick: () => set((state) => ({ duration: state.duration + 1 })),
}));