import React, { useState } from 'react';
import { useRecorderStore } from './store';

export const PostRecordingView = () => {
  const { duration, saveRecording, discardRecording } = useRecorderStore();
  const [fileName, setFileName] = useState('');

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSave = () => {
    saveRecording(fileName);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-[#09090b] p-6 text-slate-800 dark:text-slate-200 items-center justify-center">
      <div className="w-full max-w-md bg-white dark:bg-[#121215] p-8 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Save Recording</h2>
        <p className="text-slate-500 dark:text-gray-400 mb-6">
          Recording length: <span className="font-mono text-blue-500 font-bold">{formatTime(duration)}</span>
        </p>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-400 mb-2">
            File Name
          </label>
          <input 
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. Interview Note, Song Idea..."
            className="w-full bg-slate-100 dark:bg-[#0a0a0c] border border-slate-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            autoFocus
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={discardRecording}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all"
          >
            Save Audio
          </button>
        </div>
      </div>
    </div>
  );
};