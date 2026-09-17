import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { HyperSenseResult } from '../../../types/hypersense';

// 🧠 Zustand Stores
import { useMusicStore } from '../../APP/music/store';
import { useAppStore } from '../../../store/useAppStore';

export const HyperSensePalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HyperSenseResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Toggle with Ctrl+K / Cmd+K or Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 2. Fetch results from Rust Backend
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await invoke<HyperSenseResult[]>('search_hypersense', { query });
        setResults(res);
        setSelectedIndex(0); // Reset selection
      } catch (error) {
        console.error("Hyper Sense search failed:", error);
      }
    };

    // Debounce logic (150ms delay to prevent spamming backend)
    const timeoutId = setTimeout(fetchResults, 150);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // 3. Handle Keyboard Navigation (Up/Down/Enter)
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      executeAction(results[selectedIndex]);
    }
  };

  // 🚀 4. THE ACTION EXECUTION ENGINE
  const executeAction = (result: HyperSenseResult) => {
    try {
      // Backend se aayi string ko JSON mein convert karo
      const payloadData = JSON.parse(result.payload);

      // 🎵 MUSIC ACTION HANDLER
      if (result.source === 'Music' && payloadData.action === 'play_music') {
        
        // Artist aur Album ko safely alag karo (Agar gaane mein multiple '-' hue toh break na ho)
        const subtitleParts = result.subtitle.split(' - ');
        const artist = subtitleParts[0] || 'Unknown Artist';
        const album = subtitleParts.slice(1).join(' - ') || 'Unknown Album';

        // 🔥 THE GOD FIX: Frontend par ek baar strict URL Encoding karenge
        // Isse spaces, brackets "()", aur special characters URL ko break nahi kar payenge
        const safeEncodedPath = encodeURIComponent(payloadData.path);
        const guaranteedStreamUrl = `http://127.0.0.1:8765/api/stream?path=${safeEncodedPath}`;
        const guaranteedCoverUrl = `http://127.0.0.1:8765/api/cover?path=${safeEncodedPath}`;

        const trackToPlay = {
          id: payloadData.id,
          title: result.title,
          artist: artist,
          album: album,
          path: payloadData.path,
          cover_url: guaranteedCoverUrl, // Safe URL
          url: guaranteedStreamUrl,      // Safe URL
        };

        console.log("▶️ Playing Track from Hyper Sense:", trackToPlay.title);

        // Zustand store ke through gaana play karo
        const musicStore = useMusicStore.getState();
        if (musicStore.setCurrentTrack) musicStore.setCurrentTrack(trackToPlay);
        if (musicStore.setIsPlaying) musicStore.setIsPlaying(true);
        
        // (Optional) Music tab par auto-switch karna
        // const appStore = useAppStore.getState();
        // if (appStore.setActiveTab) appStore.setActiveTab('Music'); 
      }

      // 🎙️ RECORDER ACTION HANDLER
      else if (result.source === 'Recorder') {
        console.log("Play recording:", payloadData);
      }
      
      // 🔗 HYPERLINK ACTION HANDLER
      else if (result.source === 'HyperLink') {
        if (payloadData.action === 'open_url') {
          window.open(payloadData.url, '_blank');
        } else if (payloadData.action === 'copy_text') {
          navigator.clipboard.writeText(payloadData.text);
        }
      }

    } catch (error) {
      console.error("⚠️ Failed to parse or execute Hyper Sense payload", error);
    }
    
    // Action trigger hote hi palette smoothly band kar do
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm transition-all"
      onClick={() => setIsOpen(false)} // Background click par band ho jayega
    >
      <div 
        className="w-full max-w-2xl bg-[#111111] border border-zinc-700/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Click ko background tak jaane se rokna
      >
        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
          <svg className="w-5 h-5 text-indigo-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent text-xl font-medium text-white outline-none placeholder-zinc-500"
            placeholder="What do you want to find?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <span className="text-[10px] font-bold tracking-wider text-zinc-500 bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-700">ESC</span>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <ul className="max-h-[60vh] overflow-y-auto py-2 custom-scrollbar">
            {results.map((result, index) => (
              <li
                key={result.id}
                className={`px-5 py-3 cursor-pointer flex items-center justify-between transition-all ${
                  index === selectedIndex 
                    ? 'bg-indigo-600/10 border-l-4 border-indigo-500' 
                    : 'hover:bg-zinc-800/50 border-l-4 border-transparent'
                }`}
                onClick={() => executeAction(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex flex-col">
                  <span className={`font-medium ${index === selectedIndex ? 'text-indigo-200' : 'text-zinc-200'}`}>
                    {result.title}
                  </span>
                  <span className="text-[13px] text-zinc-500 mt-0.5">{result.subtitle}</span>
                </div>
                
                {/* Dynamic Badges */}
                <div className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border ${
                  result.source === 'Music' ? 'bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-500/20' : 
                  result.source === 'Recorder' ? 'bg-red-900/30 text-red-400 border-red-500/20' :
                  result.source === 'HyperLink' ? 'bg-blue-900/30 text-blue-400 border-blue-500/20' :
                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {result.source}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty State */}
        {query && results.length === 0 && (
          <div className="px-4 py-12 flex flex-col items-center justify-center text-zinc-500">
            <svg className="w-10 h-10 text-zinc-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base font-medium text-zinc-400">No results found for "{query}"</p>
            <p className="text-sm mt-1">Try searching with a different keyword</p>
          </div>
        )}
      </div>
    </div>
  );
};