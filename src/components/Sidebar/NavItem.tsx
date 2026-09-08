import React from 'react';
import { X } from 'lucide-react';

export function NavItem({ icon, label, active = false, collapsed = false, density = 'normal', onClick, isTaskbarApp = false, onClose }: any) {
  const getVerticalPadding = () => {
    switch (density) {
      case 'ultra': return 'py-1.5';
      case 'compact': return 'py-2';
      case 'spacious': return 'py-3';
      default: return 'py-2.5';
    }
  };

  return (
    // 🔥 Added hover:z-50 taaki uchalta hua icon apne neighbors ke UPAR aaye, unke peeche nahi dabe!
    <div className="relative group flex items-center justify-center w-full hover:z-50">
      
      <button 
        onClick={onClick} 
        // 🔥 REMOVED 'overflow-hidden' from here too!
        // 🔥 Brightened text: 'dark:text-zinc-300' so inactive icons are super visible
        className={`relative flex items-center rounded-2xl transition-all duration-300 ease-out w-full ${getVerticalPadding()} ${
          collapsed ? 'justify-center px-0' : 'px-3'
        } ${
          active 
            ? 'bg-black/10 dark:bg-white/15 text-black dark:text-white font-bold shadow-sm' 
            : 'text-neutral-500 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
        }`}
      >
        <div className={`absolute left-0 w-1 bg-blue-500 rounded-r-full transition-all duration-300 ease-out ${active ? 'h-1/2 opacity-100' : 'h-0 opacity-0'}`} />
        
        {/* 🔥 macOS Pop Effect: group-hover:scale-[1.4] & group-hover:-translate-y-1.5 */}
        <span className={`shrink-0 flex items-center justify-center w-10 h-10 transition-all duration-300 relative z-10 
          ${!active ? 'ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.4] group-hover:-translate-y-1.5 group-hover:drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]' : 'scale-110 drop-shadow-md text-blue-500'}
        `}>
          {icon}
          {isTaskbarApp && collapsed && (
            <span className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-white dark:border-black"></span>
          )}
        </span>
        
        {/* Text Label - Yahan overflow-hidden chhodna sahi hai varna text bahar failega */}
        <span className={`font-medium tracking-wide whitespace-nowrap flex-1 flex justify-between items-center text-left text-[13px] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-0 opacity-0 ml-0 overflow-hidden' : 'w-[130px] opacity-100 ml-2 overflow-hidden'
        }`}>
          <span className="truncate flex items-center gap-2">
            {label}
            {isTaskbarApp && !collapsed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
          </span>
          
          {isTaskbarApp && !collapsed && (
            <div onClick={onClose} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all shrink-0">
              <X size={14} />
            </div>
          )}
        </span>
      </button>

      {collapsed && (
        <div className="absolute left-[4.5rem] px-3 py-1.5 bg-neutral-900/90 dark:bg-white/95 text-white dark:text-black text-xs font-bold tracking-wide rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out backdrop-blur-md pointer-events-none whitespace-nowrap z-[100] shadow-xl border border-white/10 dark:border-black/5">
          {label}
        </div>
      )}
    </div>
  );
}