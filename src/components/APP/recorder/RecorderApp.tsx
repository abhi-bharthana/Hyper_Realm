import { invoke } from '@tauri-apps/api/core';
import { useRecorderStore } from '../../../store/useRecorderStore';
import { WaveformVisualizer } from './WaveformVisualizer';
import { LiveTranscript } from './LiveTranscript';

export const RecorderApp = () => {
  const { 
    isRecording, setRecording, clearSession, transcripts, 
    isTranscriptEnabled, setTranscriptEnabled 
  } = useRecorderStore();

  const handleToggleRecord = async () => {
    try {
      if (isRecording) {
        const savedPath = await invoke('stop_recording', { transcripts });
        console.log(savedPath);
        setRecording(false);
      } else {
        clearSession();
        await invoke('start_recording');
        setRecording(true);
      }
    } catch (error) {
      console.error("Recording Error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">AI Recorder</h1>
        <div className="flex items-center gap-4">
          
          {/* 🚀 Naya STT Toggle Button */}
          <button
            onClick={() => setTranscriptEnabled(!isTranscriptEnabled)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${
              isTranscriptEnabled
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50'
                : 'bg-slate-200 text-slate-500 dark:bg-gray-800 dark:text-gray-400 border border-transparent'
            }`}
          >
            {isTranscriptEnabled ? 'STT: ON' : 'STT: OFF'}
          </button>

          <span className="text-sm font-medium text-slate-500 dark:text-gray-400 transition-colors duration-300">
            {isRecording ? "🔴 Recording..." : "Paused"}
          </span>
        </div>
      </div>

      <WaveformVisualizer />
      
      {/* 🚀 Conditional Rendering for Transcript Area */}
      {isTranscriptEnabled ? (
        <LiveTranscript />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-black/20 rounded-[1.25rem] border border-slate-200 dark:border-white/5 my-4 transition-colors duration-300">
          <svg className="w-12 h-12 text-slate-300 dark:text-gray-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          <p className="text-slate-500 dark:text-gray-500 font-medium text-center">
            Live Transcription is disabled.<br/>
            <span className="text-sm font-normal opacity-70">Audio will still be recorded and saved.</span>
          </p>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <button
          onClick={handleToggleRecord}
          className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-red-500/20' 
              : 'bg-blue-600 hover:bg-blue-500 hover:-translate-y-1 shadow-blue-500/20'
          }`}
        >
          <span className="text-white font-bold tracking-wider">{isRecording ? 'STOP' : 'REC'}</span>
        </button>
      </div>
    </div>
  );
};