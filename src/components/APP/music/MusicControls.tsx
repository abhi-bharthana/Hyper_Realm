// src/components/APP/music/MusicControls.tsx
import React, { useState } from 'react';

const MusicControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded-b-lg">
      {/* Seekbar */}
      <div className="w-full bg-gray-700 h-1.5 rounded-full mb-4 cursor-pointer">
        <div className="bg-blue-500 h-1.5 rounded-full w-1/3"></div>
      </div>
      
      {/* Buttons */}
      <div className="flex items-center justify-center gap-6 text-white">
        <button className="hover:text-blue-400 transition-colors">⏮</button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-500 transition-colors shadow-lg"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button className="hover:text-blue-400 transition-colors">⏭</button>
      </div>
    </div>
  );
};

export default MusicControls;