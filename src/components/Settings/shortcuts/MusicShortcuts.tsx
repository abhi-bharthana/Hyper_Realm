import React from 'react';

const MusicShortcuts: React.FC = () => {
  const musicShortcuts = [
    { key: 'Space', action: 'Play / Pause' },
    { key: 'M', action: 'Mute / Unmute' },
    { key: 'S', action: 'Toggle Shuffle' },
    { key: 'R', action: 'Toggle Repeat' },
    { key: '↑ (Up)', action: 'Previous Track' },
    { key: '↓ (Down)', action: 'Next Track' },
    { key: '← (Left)', action: 'Seek Backward (-3s)' },
    { key: '→ (Right)', action: 'Seek Forward (+3s)' },
  ];

  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700/50 pb-4">
        <span className="text-2xl">🎵</span>
        <h3 className="text-lg font-semibold text-white tracking-wide">Music Controls</h3>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {musicShortcuts.map((shortcut, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 hover:border-gray-500/50 transition-colors"
          >
            <span className="text-gray-300 text-sm font-medium">{shortcut.action}</span>
            <kbd className="px-3 py-1.5 bg-gray-800 text-gray-200 rounded-md text-xs font-mono border border-gray-600 shadow-sm tracking-widest">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicShortcuts;