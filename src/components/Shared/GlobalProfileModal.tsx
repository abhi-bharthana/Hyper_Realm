import { X, Shield, Monitor, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

interface GlobalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalProfileModal({ isOpen, onClose }: GlobalProfileModalProps) {
  const { user, signOut, connectedDevices } = useAuthStore();
  const { userName, userTitle, userAvatar } = useAppStore();

  if (!isOpen) return null;

  const displayAvatar = user?.user_metadata?.avatar_url || userAvatar;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-950/90 backdrop-blur-3xl border border-white/15 shadow-[0_1.5rem_3rem_rgba(0,0,0,0.6)] rounded-3xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Realm Identity & Devices</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* User Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <img src={displayAvatar || 'https://via.placeholder.com/150'} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50 shadow-md" />
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-base truncate">{user?.user_metadata?.full_name || userName}</h4>
              <p className="text-xs text-slate-400 truncate">{user?.email || userTitle}</p>
              <div className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> {user ? 'Cloud Synced' : 'Local Node Mode'}
              </div>
            </div>
          </div>

          {/* Connected Devices Section */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-blue-400" /> Connected Ecosystem Devices ({connectedDevices.length})
            </h5>

            {connectedDevices.length > 0 ? (
              <div className="space-y-2">
                {connectedDevices.map((dev: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs hover:border-white/20 transition-all">
                    <div>
                      <p className="font-semibold text-white">{dev.device_name}</p>
                      <p className="text-[10px] text-slate-400">{dev.os_info} • {dev.node_location}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#22c55e]" title="Active Node"></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
                {user ? 'No other active devices found. Sync your ID on another device!' : 'Sign in with Google/Cloud to track and sync across multiple devices.'}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        {user && (
          <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
            <button onClick={() => { signOut(); onClose(); }} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}