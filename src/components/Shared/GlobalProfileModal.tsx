import React, { useState, useEffect } from 'react';
import { X, Shield, Monitor, LogOut, CheckCircle2, Moon, Sun, Keyboard, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

// 🔥 Music Shortcuts import kar liya
import MusicShortcuts from '../Settings/shortcuts/MusicShortcuts';

interface GlobalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalProfileModal({ isOpen, onClose }: GlobalProfileModalProps) {
  const { user, signOut, connectedDevices } = useAuthStore();
  const { userName, userTitle, userAvatar, setTheme } = useAppStore();
  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // 🛠️ FIX: Jab bhi modal open ho, actual screen ka theme read karo (No more out-of-sync bugs)
  useEffect(() => {
    if (isOpen) {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayAvatar = user?.user_metadata?.avatar_url || userAvatar;

  // 🌓 Smart Theme Toggle
  const toggleTheme = () => {
    const currentlyDark = document.documentElement.classList.contains('dark');
    if (currentlyDark) {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      setIsDark(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/15 shadow-[0_2rem_4rem_rgba(0,0,0,0.8)] rounded-[2rem] w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Realm Identity</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* User Profile Card - UI Upgraded */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 shadow-inner">
            <div className="relative">
              <img src={displayAvatar || 'https://via.placeholder.com/150'} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-base truncate text-white tracking-wide">{user?.user_metadata?.full_name || userName}</h4>
              <p className="text-xs text-blue-300/80 truncate font-medium">{user?.email || userTitle}</p>
              <div className="inline-flex items-center gap-1.5 mt-2 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shadow-sm">
                <CheckCircle2 className="w-3 h-3" /> {user ? 'Cloud Synced' : 'Local Node Mode'}
              </div>
            </div>
          </div>

          {/* 🔥 STYLISH QUICK CONTROLS */}
          <div className="grid grid-cols-2 gap-3">
            {/* Dark/Light Mode Button */}
            <button 
              onClick={toggleTheme}
              className={`group relative overflow-hidden flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border transition-all duration-300 text-sm font-semibold shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-b from-white/10 to-white/5 border-white/15 hover:border-white/30 text-slate-200' 
                  : 'bg-gradient-to-b from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 hover:border-yellow-500/50 text-yellow-100'
              }`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isDark ? (
                <><Moon className="w-4 h-4 text-blue-400 group-hover:-rotate-12 transition-transform" /> Dark Mode</>
              ) : (
                <><Sun className="w-4 h-4 text-yellow-400 group-hover:rotate-90 transition-transform duration-500" /> Light Mode</>
              )}
            </button>

            {/* Shortcuts Toggle Button */}
            <button 
              onClick={() => setShowShortcuts(!showShortcuts)}
              className={`group relative overflow-hidden flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border transition-all duration-300 text-sm font-semibold shadow-lg ${
                showShortcuts 
                  ? 'bg-gradient-to-b from-blue-500/20 to-blue-500/5 border-blue-500/40 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'bg-gradient-to-b from-white/10 to-white/5 border-white/15 hover:border-white/30 text-slate-200'
              }`}
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Keyboard className={`w-4 h-4 ${showShortcuts ? 'text-blue-400' : 'text-slate-400'}`} />
              Shortcuts
              {showShortcuts ? <ChevronUp className="w-3.5 h-3.5 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
            </button>
          </div>

          {/* 🔽 EXPANDABLE SHORTCUTS PANEL (Now Global & Stylish) */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showShortcuts ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-2">
              <div className="scale-[0.98] origin-top"> 
                {/* Global Audio shortcuts directly rendered, no "Coming soon" */}
                <MusicShortcuts />
              </div>
            </div>
          </div>

          {/* Connected Devices Section */}
          <div className={`transition-opacity duration-300 ${showShortcuts ? "opacity-40 hover:opacity-100" : ""}`}>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-blue-400" /> Connected Ecosystem Devices ({connectedDevices.length})
            </h5>

            {connectedDevices.length > 0 ? (
              <div className="space-y-2">
                {connectedDevices.map((dev: any, idx: number) => (
                  <div key={idx} className="group flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-default">
                    <div>
                      <p className="font-semibold text-white tracking-wide">{dev.device_name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{dev.os_info} • {dev.node_location}</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#22c55e]" title="Active Node"></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-xl bg-white/[0.03] border border-white/10 border-dashed text-xs text-slate-400 font-medium tracking-wide">
                {user ? 'No other active devices found.' : 'Sign in with Cloud to sync across devices.'}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        {user && (
          <div className="p-4 border-t border-white/10 bg-white/[0.02] flex justify-end">
            <button onClick={() => { signOut(); onClose(); }} className="group flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm">
              <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Sign Out
            </button>
          </div>
        )}

      </div>
    </div>
  );
}