import React from 'react';
import { X } from 'lucide-react';

export function NavItem({ icon, label, active = false, collapsed = false, density = 'normal', onClick, isTaskbarApp = false, onClose }: any) {
  const getVerticalPadding = () => {
    switch (density) {
      case 'ultra': return 'py-2';
      case 'compact': return 'py-2.5';
      case 'spacious': return 'py-3.5';
      default: return 'py-3';
    }
  };

  return (
    <button 
      onClick={onClick} 
      title={collapsed ? label : undefined}
      className={`relative flex items-center rounded-xl transition-all duration-[400ms] ease-in-out overflow-hidden group w-full ${getVerticalPadding()} ${
        collapsed ? 'justify-center px-0' : 'px-3'
      } ${
        active 
          ? 'bg-neutral-900/5 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold shadow-sm backdrop-blur-md' 
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-900/5 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
      }`}
    >
      <div className={`absolute left-0 w-1 bg-neutral-800 dark:bg-white rounded-r-full transition-all duration-300 ease-out ${active ? 'h-1/2 opacity-100' : 'h-0 opacity-0'}`} />
      
      <span className={`shrink-0 flex items-center justify-center w-8 transition-transform duration-300 relative ${!active && 'group-hover:scale-110'}`}>
        {icon}
        {isTaskbarApp && collapsed && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-white dark:border-black"></span>
        )}
      </span>
      
      <span className={`font-medium tracking-wide whitespace-nowrap flex-1 flex justify-between items-center overflow-hidden text-left text-[13px] transition-all duration-[400ms] ease-in-out ${
        collapsed ? 'w-0 opacity-0 ml-0' : 'w-[130px] opacity-100 ml-2'
      } ${!active && 'group-hover:translate-x-1'}`}>
        <span className="truncate flex items-center gap-2">
          {label}
          {isTaskbarApp && !collapsed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
        </span>
        
        {isTaskbarApp && !collapsed && (
          <div onClick={onClose} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-all shrink-0">
            <X size={14} />
          </div>
        )}
      </span>
    </button>
  );
}