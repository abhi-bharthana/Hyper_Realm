import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useCloudStore } from '../../../store/useCloudStore';

export default function CloudConnect() {
  const { isRunning, tunnelUrl, setIsRunning, setTunnelUrl } = useCloudStore();
  const [isLoading, setIsLoading] = useState(false);

  const MY_CUSTOM_DOMAIN = "https://dashboard.hyper-realm.com";

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
    <div className="flex flex-col gap-6">
      {/* Status Card */}
      <div className={`p-6 rounded-3xl border transition-all duration-500 ${isRunning ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Cloudflare Named Tunnel</h3>
            <p className="text-xs text-slate-400">
              {isRunning ? 'Tunnel is active globally via your custom domain.' : 'Turn on to route your local server globally.'}
            </p>
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={toggleTunnel}
            disabled={isLoading}
            className={`px-6 py-3 rounded-2xl font-medium text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
              isRunning 
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25'
            }`}
          >
            {isLoading ? 'Connecting...' : isRunning ? 'Disconnect ⏹' : 'Start Tunnel 🚀'}
          </button>
        </div>

        {/* Live URL Display if running */}
        {isRunning && tunnelUrl && (
          <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-white/10 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">Global Active Endpoint</span>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 font-mono text-sm text-slate-700 dark:text-slate-200">
              <a href={tunnelUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-400 truncate">
                {tunnelUrl}
              </a>
              <span className="flex items-center gap-2 text-xs text-emerald-500 font-sans font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}