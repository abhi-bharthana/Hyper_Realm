import { create } from 'zustand';

export interface Recording {
  id: string;
  name: string;
  duration: number;
  path: string;
  date: string;
} // <-- Missing brace fixed here

interface RecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number; 
  isTranscriptEnabled: boolean;
  transcripts: string[];
  
  showPostView: boolean;
  currentFilePath: string | null;
  recordings: Recording[];
  
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: (path: string) => void;
  tick: () => void; 
  
  toggleTranscript: () => void;
  addTranscript: (text: string) => void;
  clearTranscripts: () => void;
  
  saveRecording: (name: string) => void;
  discardRecording: () => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  isRecording: false,
  isPaused: false,
  duration: 0,
  isTranscriptEnabled: true,
  transcripts: [],
  showPostView: false,
  currentFilePath: null,
  recordings: [],
  
  startRecording: () => set({ 
    isRecording: true, 
    isPaused: false, 
    duration: 0, 
    transcripts: [],
    showPostView: false,
    currentFilePath: null
  }),
  pauseRecording: () => set({ isPaused: true }),
  resumeRecording: () => set({ isPaused: false }),
  
  stopRecording: (path) => set({ 
    isRecording: false, 
    isPaused: false,
    showPostView: true,
    currentFilePath: path
  }),
  
  tick: () => set((state) => ({ duration: state.duration + 1 })),
  toggleTranscript: () => set((state) => ({ isTranscriptEnabled: !state.isTranscriptEnabled })),
  addTranscript: (text) => set((state) => ({ transcripts: [...state.transcripts, text] })),
  clearTranscripts: () => set({ transcripts: [] }),
  
  saveRecording: (name) => set((state) => {
    if (!state.currentFilePath) return state;
    const newRecording: Recording = {
      id: Date.now().toString(),
      name: name.trim() || `Audio Recording ${state.recordings.length + 1}`,
      duration: state.duration,
      path: state.currentFilePath,
      date: new Date().toLocaleString(),
    };
    return {
      recordings: [newRecording, ...state.recordings],
      showPostView: false,
      currentFilePath: null,
      duration: 0 
    };
  }),
  
  discardRecording: () => set({
    showPostView: false,
    currentFilePath: null,
    duration: 0 
  })
}));