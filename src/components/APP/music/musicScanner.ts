import { invoke, convertFileSrc } from '@tauri-apps/api/core';
import { Track } from '../../../store/useMusicStore';

export const scanNativeDirectory = async (dirPath: string): Promise<Track[]> => {
  try {
    // 1. Rust ko order diya: "Bhai path le, aur gaane scan karke JSON dede"
    // Rust 1000 songs 0.5 sec mein scan karke de dega. JS ka koi RAM crash nahi.
    const tracks: Track[] = await invoke('scan_music_directory', { path: dirPath });
    
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