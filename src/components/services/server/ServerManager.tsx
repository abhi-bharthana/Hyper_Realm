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
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isRunning ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
            <Server size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Local Background Server</h2>
            <p className="text-sm text-slate-500 dark:text-white/50">
              {isRunning ? 'Online on http://127.0.0.1:8765' : 'Offline'} 
            </p>
          </div>
        </div>
        
        {/* Main Toggle Switch */}
        <button 
          onClick={handleToggle}
          className={`w-14 h-7 rounded-full p-1 transition-colors relative ${isRunning ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform absolute top-1 ${isRunning ? 'translate-x-7' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Server Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 dark:border-white/10 pt-6">
        <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-black/20 rounded-xl">
          <div className="flex items-center gap-2 text-blue-500"><Music size={18} /><span className="font-bold text-sm">Media Engine</span></div>
          <p className="text-xs text-slate-500 dark:text-white/60">Powers audio streaming via <code className="bg-slate-200 dark:bg-white/10 px-1 rounded">/api/stream</code> route.[cite: 3, 5]</p>
        </div>
        
        <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-black/20 rounded-xl">
          <div className="flex items-center gap-2 text-orange-500"><ClipboardList size={18} /><span className="font-bold text-sm">Clipboard Sync</span></div>
          <p className="text-xs text-slate-500 dark:text-white/60">Stores clipboard history across the realm via <code className="bg-slate-200 dark:bg-white/10 px-1 rounded">/api/clipboard</code>.[cite: 5, 7]</p>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-black/20 rounded-xl">
          <div className="flex items-center gap-2 text-purple-500"><LinkIcon size={18} /><span className="font-bold text-sm">Hyper Links</span></div>
          <p className="text-xs text-slate-500 dark:text-white/60">Manages shared URLs via <code className="bg-slate-200 dark:bg-white/10 px-1 rounded">/api/links</code>.[cite: 5, 7]</p>
        </div>
      </div>
    </div>
  );
}