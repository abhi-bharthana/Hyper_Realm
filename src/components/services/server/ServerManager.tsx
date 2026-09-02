import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Server, Activity, Music, ClipboardList, Link as LinkIcon } from 'lucide-react';

export default function ServerManager() {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    invoke<boolean>('get_server_status').then(setIsRunning).catch(console.error);
  }, []);

  const handleToggle = async () => {
    const newState = !isRunning;
    try {
      await invoke('toggle_server', { enable: newState });
      setIsRunning(newState);
    } catch (error) {
      console.error("Failed to toggle server:", error);
    }
  };

  return (
    <div className="bg-white/70 dark:bg-zinc-900/80 border border-slate-200 dark:border-white/[0.08] rounded-[1.5rem] p-[1.5rem] shadow-sm transition-colors">
      
      <div className="flex items-center justify-between mb-[1.5rem]">
        <div className="flex items-center gap-[0.75rem]">
          <div className={`p-[0.75rem] rounded-[1rem] transition-colors ${isRunning ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
            <Server className="w-[1.5rem] h-[1.5rem]" />
          </div>
          <div className="flex flex-col gap-[0.2rem]">
            <h2 className="text-[1.1em] font-bold text-slate-900 dark:text-white leading-tight">Local Background Server</h2>
            <p className="text-[0.85em] text-slate-500 dark:text-white/50">
              {isRunning ? 'Online on http://127.0.0.1:8765' : 'Offline'} 
            </p>
          </div>
        </div>
        
        {/* Main Toggle Switch Scaled with rem */}
        <button 
          onClick={handleToggle}
          className={`w-[3.5rem] h-[1.8rem] rounded-full transition-colors duration-300 relative shrink-0 ${isRunning ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <div className={`absolute top-[0.2rem] w-[1.4rem] h-[1.4rem] bg-white rounded-full transition-transform duration-300 ${isRunning ? 'translate-x-[1.9rem]' : 'translate-x-[0.2rem]'}`} />
        </button>
      </div>

      {/* Server Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1rem] border-t border-slate-200 dark:border-white/10 pt-[1.5rem]">
        
        <div className="flex flex-col gap-[0.5rem] p-[1rem] bg-slate-50/80 dark:bg-black/20 rounded-[1rem] border border-slate-100 dark:border-transparent transition-colors">
          <div className="flex items-center gap-[0.5rem] text-blue-500">
            <Music className="w-[1.1rem] h-[1.1rem]" />
            <span className="font-bold text-[0.85em] text-slate-800 dark:text-zinc-200">Media Engine</span>
          </div>
          <p className="text-[0.75em] text-slate-500 dark:text-white/60">
            Powers audio streaming via <code className="bg-slate-200 dark:bg-white/10 px-[0.4em] py-[0.1em] rounded-[0.25rem] font-mono text-[0.9em]">/api/stream</code> route.
          </p>
        </div>
        
        <div className="flex flex-col gap-[0.5rem] p-[1rem] bg-slate-50/80 dark:bg-black/20 rounded-[1rem] border border-slate-100 dark:border-transparent transition-colors">
          <div className="flex items-center gap-[0.5rem] text-orange-500">
            <ClipboardList className="w-[1.1rem] h-[1.1rem]" />
            <span className="font-bold text-[0.85em] text-slate-800 dark:text-zinc-200">Clipboard Sync</span>
          </div>
          <p className="text-[0.75em] text-slate-500 dark:text-white/60">
            Stores clipboard history across the realm via <code className="bg-slate-200 dark:bg-white/10 px-[0.4em] py-[0.1em] rounded-[0.25rem] font-mono text-[0.9em]">/api/clipboard</code>.
          </p>
        </div>

        <div className="flex flex-col gap-[0.5rem] p-[1rem] bg-slate-50/80 dark:bg-black/20 rounded-[1rem] border border-slate-100 dark:border-transparent transition-colors">
          <div className="flex items-center gap-[0.5rem] text-purple-500">
            <LinkIcon className="w-[1.1rem] h-[1.1rem]" />
            <span className="font-bold text-[0.85em] text-slate-800 dark:text-zinc-200">Hyper Links</span>
          </div>
          <p className="text-[0.75em] text-slate-500 dark:text-white/60">
            Manages shared URLs via <code className="bg-slate-200 dark:bg-white/10 px-[0.4em] py-[0.1em] rounded-[0.25rem] font-mono text-[0.9em]">/api/links</code>.
          </p>
        </div>
        
      </div>
    </div>
  );
}