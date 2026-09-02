import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useCloudStore } from '../../../store/useCloudStore';

export default function CloudConnect() {
  const { isRunning, tunnelUrl, setIsRunning, setTunnelUrl } = useCloudStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unlistenReady = listen<string>('tunnel-ready', (event) => {
      setTunnelUrl(event.payload);
      setIsRunning(true);
      setIsLoading(false);
    });
    const unlistenError = listen<string>('tunnel-error', (event) => {
      console.error("Tunnel error:", event.payload);
      setIsLoading(false);
    });
    const unlistenStopped = listen('tunnel-stopped', () => {
      setIsRunning(false);
      setTunnelUrl(null);
      setIsLoading(false);
    });
    return () => {
      unlistenReady.then(f => f());
      unlistenError.then(f => f());
      unlistenStopped.then(f => f());
    };
  }, [setIsRunning, setTunnelUrl]);

  const toggleTunnel = async () => {
    try {
      if (isRunning) {
        setIsLoading(true);
        await invoke('stop_cloud_tunnel');
        setIsRunning(false);
        setTunnelUrl(null);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await invoke('start_cloud_tunnel'); 
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-[1.5rem]">
      {/* Status Card */}
      <div className={`p-[1.5rem] rounded-[1.5rem] border transition-all duration-500 shadow-sm ${isRunning ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/70 dark:bg-zinc-900/80 border-slate-200 dark:border-white/[0.08]'}`}>
        <div className="flex items-center justify-between gap-[1rem]">
          <div className="flex flex-col gap-[0.25rem]">
            <h3 className="text-[1.1em] font-semibold text-slate-800 dark:text-white">Cloudflare Named Tunnel</h3>
            <p className="text-[0.75em] text-slate-500 dark:text-zinc-400">
              {isRunning ? 'Tunnel is active globally via your custom domain.' : 'Turn on to route your local server globally.'}
            </p>
          </div>
          
          {/* Toggle Button Scaled */}
          <button
            onClick={toggleTunnel}
            disabled={isLoading}
            className={`px-[1.5rem] py-[0.75rem] rounded-[1rem] font-medium text-[0.85em] transition-all active:scale-95 disabled:opacity-50 shrink-0 ${
              isRunning 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0.5rem_1rem_rgba(244,63,94,0.25)]' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0.5rem_1rem_rgba(37,99,235,0.25)]'
            }`}
          >
            {isLoading ? 'Connecting...' : isRunning ? 'Disconnect 🛑' : 'Start Tunnel 🚀'}
          </button>
        </div>

        {/* Live URL Display if running */}
        {isRunning && tunnelUrl && (
          <div className="mt-[1.5rem] pt-[1.5rem] border-t border-slate-200/50 dark:border-white/10 flex flex-col gap-[0.75rem]">
            <span className="text-[0.65em] font-semibold uppercase tracking-wider text-blue-500">Global Active Endpoint</span>
            <div className="flex items-center justify-between p-[1rem] rounded-[1rem] bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 font-mono text-[0.85em] text-slate-700 dark:text-slate-200">
              <a href={tunnelUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-500 dark:text-blue-400 truncate pr-[1rem]">
                {tunnelUrl}
              </a>
              <span className="flex items-center gap-[0.5rem] text-[0.75em] text-emerald-500 font-sans font-medium shrink-0">
                <span className="w-[0.5rem] h-[0.5rem] rounded-full bg-emerald-500 animate-ping"></span> Live
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}