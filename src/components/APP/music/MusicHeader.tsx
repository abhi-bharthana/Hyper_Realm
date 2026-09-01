// src/components/APP/music/MusicHeader.tsx
import React from 'react';

interface MusicHeaderProps {
  onClose: () => void;
}

const MusicHeader: React.FC<MusicHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 p-3 rounded-t-lg border-b border-gray-700">
      <div className="flex items-center gap-2 text-white">
        <span className="text-xl">🎵</span>
        <h3 className="font-semibold select-none">Music Player</h3>
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export default MusicHeader;