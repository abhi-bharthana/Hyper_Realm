// src/components/APP/music/MusicPlayer.tsx
import React from 'react';

const MusicPlayer: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900">
      {/* Placeholder for Album Art */}
      <div className="w-48 h-48 bg-gray-700 rounded-lg shadow-lg mb-4 flex items-center justify-center">
        <span className="text-4xl text-gray-500">💿</span>
      </div>
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold">Unknown Track</h2>
        <p className="text-gray-400 text-sm mt-1">Unknown Artist</p>
      </div>
    </div>
  );
};

export default MusicPlayer;