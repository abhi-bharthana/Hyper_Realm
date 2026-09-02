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
        <h3 className="text-[1.1em] font-bold text-slate-800 dark:text-white">Cloud Tunnel</h3>
        <div className="flex items-center gap-[0.5rem] mt-[0.25rem]">
          <span className="relative flex h-[0.6rem] w-[0.6rem]">
            {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-[0.6rem] w-[0.6rem] ${isRunning ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </span>
          <span className="text-[0.85em] font-semibold text-slate-500">
            {isRunning ? 'Online & Active' : 'Offline'}
          </span>
        </div>
      </div>
      
      <button 
        onClick={onToggle} 
        disabled={isLoading}
        className={`relative w-[3.5rem] h-[1.8rem] rounded-full transition-colors duration-300 ${isRunning ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-[0.2rem] w-[1.4rem] h-[1.4rem] bg-white rounded-full transition-transform duration-300 flex items-center justify-center ${isRunning ? 'translate-x-[1.9rem]' : 'translate-x-[0.2rem]'}`}>
          {isLoading && <Loader2 className="w-[0.9rem] h-[0.9rem] animate-spin text-slate-400" />}
        </div>
      </button>
    </div>
  );
}