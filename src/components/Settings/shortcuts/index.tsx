// src/components/Settings/shortcuts/index.tsx
import React from 'react';
import MusicShortcuts from './MusicShortcuts';

const ShortcutsSection: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in w-full max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Keyboard Shortcuts ⌨️</h2>
        <p className="text-gray-400 text-sm mb-6">Master your workflow and navigate the app faster with these quick controls.</p>
      </div>

      {/* Yahan par music wala component call kar liya */}
      <MusicShortcuts />

      {/* Future ke liye placeholder taaki baad mein aur modules add kar sako */}
      <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-md opacity-50 mt-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚙️</span>
          <h3 className="text-lg font-semibold text-white tracking-wide">System & Global (Coming Soon)</h3>
        </div>
        <p className="text-gray-400 text-sm">OS level shortcuts will be added here...</p>
      </div>
    </div>
  );
};

export default ShortcutsSection;