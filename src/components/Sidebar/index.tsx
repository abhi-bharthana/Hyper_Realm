import React from 'react';
import { SidebarTop } from './SidebarTop';
import { SidebarNav } from './SidebarNav';
import { SidebarBottom } from './SidebarBottom';

export const Sidebar = () => {
  return (
    // 🔥 REMOVED 'overflow-hidden' taaki macOS scale animation bahar nikal sake
    <div className="h-full w-full bg-white/10 dark:bg-[#0a0a0c]/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col py-6 px-1 relative">
      
      <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-none z-[-1]" />
      
      <SidebarTop />
      <SidebarNav />
      <SidebarBottom />
    </div>
  );
};