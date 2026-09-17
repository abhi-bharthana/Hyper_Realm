import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const IndexingSettings: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleScanDirectory = async () => {
    setIsScanning(true);
    setStatus("Scanning files and building AI Brain... (This might take a few seconds)");
    
    try {
      // Yeh tere music folder ko backend mein bhejega
      // Yahan tu apni marzi ka Desktop ya Android path pass kar sakta hai
      const scanPath = "C:/Users/Abhi/Music"; // Desktop testing ke liye apna path yahan dal
      
      const tracks = await invoke('scan_music_directory', { path: scanPath });
      
      setStatus(`✅ Success! Indexed ${Array.isArray(tracks) ? tracks.length : 'all'} tracks into Hyper Sense.`);
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to index the directory. Check console.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg mt-4">
      <h2 className="text-xl font-bold text-white mb-2">System Indexing</h2>
      <p className="text-sm text-zinc-400 mb-6">
        Build the Hyper Sense search index. This allows the AI to map meanings (e.g., "Kala" = "Black") and makes your library instantly searchable.
      </p>

      <button 
        onClick={handleScanDirectory}
        disabled={isScanning}
        className={`px-6 py-2 rounded-lg font-medium transition-all ${
          isScanning 
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
        }`}
      >
        {isScanning ? 'Building AI Index...' : 'Re-Index Music Library'}
      </button>

      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          status.includes('Success') ? 'bg-green-900/30 text-green-400 border border-green-800/50' : 
          status.includes('Failed') ? 'bg-red-900/30 text-red-400 border border-red-800/50' :
          'bg-indigo-900/30 text-indigo-400 border border-indigo-800/50'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
};