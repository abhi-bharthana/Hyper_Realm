import { useState } from 'react';
import { Music, Search } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { SourceToggle } from '../../Shared/SourceToggle'; // 🔥 Global Component Import

export default function MusicHeader() {
  const { user } = useAuthStore();
  const [isCloudMode, setIsCloudMode] = useState(false);

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white/5 dark:bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-sm z-10">
      
      {/* Title & Icon */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
          <Music className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-wide">Hyper Music</h2>
      </div>

      {/* Center: Global Animated Toggle */}
      <div className="hidden md:block">
        <SourceToggle 
          isCloudMode={isCloudMode} 
          onToggle={(mode) => setIsCloudMode(mode)} 
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white">
          <Search className="w-5 h-5" />
        </button>
        {user ? (
          <img 
            src={user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'} 
            alt="User" 
            className="w-8 h-8 rounded-full border border-blue-500/50 object-cover shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          </div>
        )}
      </div>

    </div>
  );
}