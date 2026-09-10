import { Cloud, HardDrive, User } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SourceToggleProps {
  currentMode: 'local' | 'cloud';
  onModeChange: (mode: 'local' | 'cloud') => void;
  onOpenProfile?: () => void; // Optional profile click handler
}

export function SourceToggle({ currentMode, onModeChange, onOpenProfile }: SourceToggleProps) {
  const { user } = useAuthStore();

  const handleModeSwitch = (mode: 'local' | 'cloud') => {
    if (mode === 'cloud' && !user) {
      alert("Please login from Settings to access Cloud Sync!");
      return;
    }
    onModeChange(mode);
  };

  return (
    <div className="flex items-center gap-1 bg-black/30 dark:bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg">
      
      {/* Local Button */}
      <button 
        onClick={() => handleModeSwitch('local')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${
          currentMode === 'local' 
            ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] scale-105' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <HardDrive className="w-3 h-3" /> Local
      </button>

      {/* Cloud Button */}
      <button 
        onClick={() => handleModeSwitch('cloud')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${
          currentMode === 'cloud' 
            ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.4)] scale-105' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Cloud className="w-3 h-3" /> Cloud
      </button>

      {/* Divider */}
      <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

      {/* Profile Shortcut Button */}
      <button 
        onClick={onOpenProfile}
        className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        title="Profile & Identity"
      >
        {user?.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="Profile" className="w-4 h-4 rounded-full object-cover" />
        ) : (
          <User className="w-3.5 h-3.5" />
        )}
      </button>

    </div>
  );
}