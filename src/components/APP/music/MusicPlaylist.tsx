// src/components/APP/music/MusicPlaylist.tsx
import React from 'react';

const MusicPlaylist: React.FC = () => {
  const tracks = [
    { id: 1, title: 'Track 1', artist: 'Artist A', duration: '3:45' },
    { id: 2, title: 'Track 2', artist: 'Artist B', duration: '4:20' },
  ];

  return (
    <div className="bg-gray-900 p-4 h-full border-l border-gray-700 overflow-y-auto">
      <h4 className="text-white font-semibold mb-3">Playlist</h4>
      <div className="flex flex-col gap-2">
        {tracks.map(track => (
          <div key={track.id} className="flex justify-between items-center p-2 hover:bg-gray-800 rounded cursor-pointer text-sm">
            <div>
              <p className="text-white">{track.title}</p>
              <p className="text-gray-400 text-xs">{track.artist}</p>
            </div>
            <span className="text-gray-500 text-xs">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlaylist;