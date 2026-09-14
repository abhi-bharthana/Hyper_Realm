// src/components/APP/recorder/store.ts
import { create } from 'zustand';

interface TranscriptItem {
  id: string;
  text: string;
  timestamp: string;
}

interface RecorderState {
  isRecording: boolean;
  isTranscriptEnabled: boolean; 
  volume: number;
  transcripts: TranscriptItem[];
  setRecording: (isRecording: boolean) => void;
  setTranscriptEnabled: (enabled: boolean) => void; 
  setVolume: (volume: number) => void;
  addTranscript: (text: string) => void;
  clearSession: () => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  isRecording: false,
  isTranscriptEnabled: true, 
  volume: 0,
  transcripts: [],
  
  setRecording: (isRecording) => set({ isRecording }),
  setTranscriptEnabled: (isTranscriptEnabled) => set({ isTranscriptEnabled }),
  setVolume: (volume) => set({ volume }),
  addTranscript: (text) => set((state) => ({
    transcripts: [
      ...state.transcripts,
      {
        id: Math.random().toString(36).substring(7),
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  })),
  clearSession: () => set({ transcripts: [], volume: 0 }),
}));