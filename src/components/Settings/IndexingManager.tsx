import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Music, Video, Play, Loader2, HardDrive, Activity } from 'lucide-react';

// 🔥 FIX 1: Tera Music Store yahan import kiya hai
import { useMusicStore } from '../APP/music/store';

interface ProgressPayload {
  processed: number;
  total: number;
  current_file: string;
}

export const IndexingManager: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState<ProgressPayload>({ processed: 0, total: 0, current_file: '' });
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  
  const [speed, setSpeed] = useState<string>("balanced");

  useEffect(() => {
    // 🎧 Listen for real-time progress from Rust
    const setupListener = async () => {
      const unlisten = await listen<ProgressPayload>('indexing-progress', (event) => {
        setProgress(event.payload);
      });
      return unlisten;
    };

    let unlistenFn: (() => void) | undefined;
    setupListener().then(fn => unlistenFn = fn);

    return () => {
      if (unlistenFn) unlistenFn();
    };
  }, []);

  const handleIndexMusic = async () => {
    setIsScanning(true);
    setProgress({ processed: 0, total: 0, current_file: 'Initializing...' });
    setStatusMsg(null);
    
    try {
      const scanPath = "C:/Users/Abhi/Music";
      
      // 🔥 FIX 2: Result ko 'tracks' variable mein pakda
      const tracks = await invoke<any[]>('scan_music_directory', { path: scanPath, speed: speed });
      
      // 🔥 FIX 3: Un tracks ko seedha Music Player ke store mein bhej diya!
      const musicStore = useMusicStore.getState();
      
      // 🔥 THE ULTIMATE FIX: setTracks ki jagah setPlaylist kar diya hai!
      if (musicStore.setPlaylist) {
        musicStore.setPlaylist(tracks);
      } else {
         console.warn("⚠️ setPlaylist function tere music store mein nahi mila! Apna sahi function name check kar.");
      }
      
      setStatusMsg(`✅ Successfully indexed and loaded ${tracks.length} tracks!`);
    } catch (error) {
      console.error(error);
      setStatusMsg("❌ Indexing failed. Check console for details.");
    } finally {
      setIsScanning(false);
    }
  };

  // Calculate percentage
  const percentage = progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <HardDrive className="w-5 h-5 text-indigo-400" />
        <p className="text-sm text-zinc-400">
          Manage your AI Semantic Index. The more files you index, the smarter Hyper Sense becomes.
        </p>
      </div>

      {/* 🎵 MUSIC INDEXING SECTION */}
      <div className="p-5 bg-black/20 border border-white/5 rounded-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Music className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Music Database</h3>
              <p className="text-xs text-zinc-500 mt-1">Extracts metadata & AI meanings for Hybrid Search</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* 🔥 SPEED DROPDOWN UI */}
            <div className="relative flex items-center bg-zinc-900/80 border border-white/10 rounded-xl px-3 py-2">
              <Activity className="w-4 h-4 text-zinc-400 mr-2" />
              <select 
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                disabled={isScanning}
                className="bg-transparent text-sm text-zinc-200 outline-none cursor-pointer appearance-none pr-4 disabled:opacity-50"
              >
                <option value="fast" className="bg-zinc-900">Fast (High CPU)</option>
                <option value="balanced" className="bg-zinc-900">Balanced (Recommended)</option>
                <option value="background" className="bg-zinc-900">Background (Smooth UI)</option>
              </select>
            </div>

            <button 
              onClick={handleIndexMusic}
              disabled={isScanning}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                isScanning 
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
              }`}
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-black" />}
              {isScanning ? 'Indexing...' : 'Start Index'}
            </button>
          </div>
        </div>

        {/* PROGRESS BAR UI (Only visible when scanning) */}
        {isScanning && (
          <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl border border-white/5 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between text-xs text-zinc-400 mb-2 font-medium">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
                Scanning: <span className="text-blue-400 truncate max-w-[150px] sm:max-w-[250px] inline-block align-bottom">{progress.current_file}</span>
              </span>
              <span>{progress.processed} / {progress.total} Files</span>
            </div>
            
            {/* The actual Bar */}
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner relative">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              >
                {/* Flowing light effect over the bar */}
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_1s_infinite]"></div>
              </div>
            </div>
            
            <div className="mt-2 text-right text-xs font-bold text-white tracking-wider">
              {percentage}%
            </div>
          </div>
        )}

        {statusMsg && !isScanning && (
          <div className={`mt-4 p-3 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-300 ${
            statusMsg.includes('✅') ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-red-400 bg-red-500/10 border border-red-500/20'
          }`}>
            {statusMsg}
          </div>
        )}
      </div>

      {/* 🎬 VIDEO INDEXING SECTION (Placeholder for future) */}
      <div className="p-5 bg-black/20 border border-white/5 rounded-2xl opacity-50 grayscale select-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Video Database</h3>
              <p className="text-xs text-zinc-500 mt-1">Coming soon in next update</p>
            </div>
          </div>
          <button disabled className="px-5 py-2.5 rounded-xl font-medium text-sm bg-zinc-800 text-zinc-600 cursor-not-allowed">
            Locked
          </button>
        </div>
      </div>

    </div>
  );
};