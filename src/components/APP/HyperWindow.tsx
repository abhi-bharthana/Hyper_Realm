import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
// Import App-to-App communication tools here

export default function HyperWindow({ appName, children }: { appName: string, children: React.ReactNode }) {
  const { user } = useAuthStore(); // Available to all apps automatically

  return (
    <div className="flex flex-col w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
      
      {/* 🔴 GLOBAL APP HEADER (Ye har app mein automatically aayega) */}
      <div className="h-8 bg-black/40 flex items-center justify-between px-3 drag-region">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">{appName}</span>
        
        {/* Global indicators like User Sync Status, App-to-App signals */}
        <div className="flex items-center gap-2">
           {user && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" title="Cloud Synced"></span>}
        </div>
      </div>

      {/* 🔵 APP CONTENT (Aapka actual app yahan render hoga) */}
      <div className="flex-1 relative overflow-hidden">
        {children}
      </div>

    </div>
  );
}