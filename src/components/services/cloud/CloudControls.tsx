import React from 'react';
import { Loader2 } from 'lucide-react';

interface CloudControlsProps {
  isRunning: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export default function CloudControls({ isRunning, isLoading, onToggle }: CloudControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cloud Tunnel</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2.5 w-2.5">
            {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </span>
          <span className="text-sm font-semibold text-slate-500">
            {isRunning ? 'Online & Active' : 'Offline'}
          </span>
        </div>
      </div>
      
      <button 
        onClick={onToggle} 
        disabled={isLoading}
        className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isRunning ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-1 bottom-1 w-6 bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${isRunning ? 'translate-x-9' : 'translate-x-1'}`}>
          {isLoading && <Loader2 size={12} className="animate-spin text-slate-400" />}
        </div>
      </button>
    </div>
  );
}