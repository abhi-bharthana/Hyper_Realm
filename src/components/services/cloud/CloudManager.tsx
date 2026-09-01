import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import CloudHeader from './CloudHeader';
import CloudControls from './CloudControls';
import CloudLinkDisplay from './CloudLinkDisplay';
import { useCloudStore } from '../../../store/useCloudStore';

export default function CloudManager() {
  const { isRunning, tunnelUrl, setIsRunning, setTunnelUrl } = useCloudStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 🎧 Backend se successful connection event sunn rahe hain
    const unlistenReady = listen<string>('tunnel-ready', (event) => {
      setTunnelUrl(event.payload);
      setIsRunning(true);
      setIsLoading(false); // Loading khatam, URL live!
    });

    // 🎧 Error ya stop event sunn rahe hain
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
        setIsLoading(true); // Toggle dabate hi loading shuru
        await invoke('start_cloud_tunnel'); 
        // Note: jaise hi background process "Registered tunnel connection" bolega, 
        // 'tunnel-ready' event aayega aur loading automatically band ho jayegi.
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 w-full max-w-2xl mx-auto flex flex-col gap-8">
      <CloudHeader isRunning={isRunning} />

      <div className={`p-6 rounded-3xl border transition-all duration-500 ${isRunning ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
        <CloudControls 
          isRunning={isRunning} 
          isLoading={isLoading} 
          onToggle={toggleTunnel} 
        />
        
        {tunnelUrl && (
          <CloudLinkDisplay url={tunnelUrl} />
        )}
      </div>
    </div>
  );
}