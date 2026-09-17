import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { Track } from "./store"

export const scanNativeDirectory = async (dirPath: string): Promise<Track[]> => {
  try {
    // 1. Rust ko order diya: "Bhai path le, aur gaane scan karke JSON dede"
    // 🔥 FIX: 'speed' parameter add kar diya taaki Rust error na feke
    const tracks: Track[] = await invoke('scan_music_directory', { 
      path: dirPath,
      speed: 'balanced' // Default sync speed
    });
    
    // 2. React sirf URLs generate karega taaki HTML <audio> unhe play kar sake
    return tracks.map(track => ({
      ...track,
      url: convertFileSrc(track.path) 
    }));

  } catch (error) {
    console.error("Rust Scanner Error:", error);
    return [];
  }
};