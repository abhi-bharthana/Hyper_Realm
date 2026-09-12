import React, { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { Loader2, FolderPlus, FolderCog, HardDrive, Trash2 } from 'lucide-react';
import { useMusicStore } from '../../../../store/useMusicStore';
import { scanNativeDirectory } from '../musicScanner';

export const FolderManager = () => {
  const { playlist, savedDirectories, setPlaylist, addDirectory, removeDirectory } = useMusicStore();
  const [isScanning, setIsScanning] = useState(false);

  const handleAutoScan = async () => {
    try {
      setIsScanning(true);
      const selected = await open({
        directory: false,
        multiple: true,
        filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'flac', 'm4a'] }]
      });

      if (selected) {
        const files = Array.isArray(selected) ? selected : [selected];
        if (files.length > 0) {
          const firstFile = files[0];
          const lastSlash = Math.max(firstFile.lastIndexOf('/'), firstFile.lastIndexOf('\\'));
          const parentDir = firstFile.substring(0, lastSlash);

          addDirectory(parentDir);
          const tracks = await scanNativeDirectory(parentDir);
          
          if (tracks.length > 0) {
            const mergedTracks = [...playlist, ...tracks.filter(newTrack => !playlist.some(p => p.path === newTrack.path))];
            setPlaylist(mergedTracks);
          } else {
            alert("No MP3 tracks found in this folder!");
          }
        }
      }
      setIsScanning(false);
    } catch (error) { 
      console.error("Scan Error:", error);
      setIsScanning(false); 
    }
  };

  const handleNativeFolderSelect = async () => {
    try {
      const selectedPath = await open({ directory: true, multiple: false });
      if (selectedPath && typeof selectedPath === 'string') {
        setIsScanning(true);
        addDirectory(selectedPath);
        const tracks = await scanNativeDirectory(selectedPath);
        const mergedTracks = [...playlist, ...tracks.filter(newTrack => !playlist.some(p => p.path === newTrack.path))];
        setPlaylist(mergedTracks);
        setIsScanning(false);
      }
    } catch (error) { setIsScanning(false); }
  };

  return (
    <div className="flex flex-col gap-[0.75rem]">
      <button onClick={handleAutoScan} disabled={isScanning} className="flex items-center justify-center gap-[0.5rem] px-[0.75rem] py-[0.75rem] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[0.85em] font-bold rounded-[0.75rem] border border-emerald-500/20 transition-all">
        {isScanning ? <Loader2 className="w-[1.2rem] h-[1.2rem] animate-spin" /> : <FolderPlus className="w-[1.2rem] h-[1.2rem]" />} 
        {isScanning ? 'Scanning...' : '✨ Auto-Scan Phone Audio'}
      </button>

      <button onClick={handleNativeFolderSelect} disabled={isScanning} className="flex items-center justify-center gap-[0.5rem] px-[0.75rem] py-[0.75rem] bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[0.85em] font-bold rounded-[0.75rem] border border-blue-500/20 transition-all">
        <FolderCog className="w-[1.2rem] h-[1.2rem]" /> Manual Select
      </button>

      {savedDirectories.map(dir => (
        <div key={dir} className="flex items-center justify-between bg-white/60 dark:bg-white/5 p-[0.75rem] rounded-[0.75rem] border border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-[0.75rem] overflow-hidden">
            <HardDrive className="w-[1.2rem] h-[1.2rem] text-slate-400 shrink-0" />
            <span className="text-[0.8em] font-semibold text-slate-700 dark:text-white/80 truncate" title={dir}>{dir.split('/').pop() || dir.split('\\').pop() || dir}</span>
          </div>
          <button onClick={() => removeDirectory(dir)} className="p-[0.4rem] text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-[0.5rem] transition-colors"><Trash2 className="w-[1rem] h-[1rem]" /></button>
        </div>
      ))}
    </div>
  );
};