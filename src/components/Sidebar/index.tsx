import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SidebarTop } from './SidebarTop';
import { SidebarNav } from './SidebarNav';
import { SidebarBottom } from './SidebarBottom';

export default function Sidebar() {
  const { isSidebarCollapsed, uiDensity, isSidebarAutoHide } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  const getSidebarWidth = () => {
    if (isSidebarCollapsed) return 'w-16'; 
    switch (uiDensity) {
      case 'ultra': return 'w-48';
      case 'compact': return 'w-52';
      case 'spacious': return 'w-64';
      default: return 'w-56';
    }
  };

  const getSidebarDensityClass = () => {
    if (isSidebarCollapsed) return 'py-5 px-2';
    switch (uiDensity) {
      case 'ultra': return 'py-4 px-2';
      case 'compact': return 'py-4 px-2.5';
      case 'spacious': return 'py-6 px-4';
      default: return 'py-5 px-3';
    }
  };

  // Fixed the Auto-Hide Classes
  const autoHideClasses = isSidebarAutoHide 
    ? `fixed left-4 top-4 bottom-4 z-50 ${isHovered ? 'translate-x-0 opacity-100 shadow-[20px_0_40px_rgba(0,0,0,0.15)]' : '-translate-x-[150%] opacity-0'}` 
    : 'relative z-20 translate-x-0 opacity-100';

  return (
    <>
      {/* SOLID TRIGGER ZONE */}
      {isSidebarAutoHide && (
        <div 
          className="fixed left-0 top-0 w-8 h-full z-[100] cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}

      <aside 
        onMouseEnter={() => isSidebarAutoHide && setIsHovered(true)}
        onMouseLeave={() => isSidebarAutoHide && setIsHovered(false)}
        className={`bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[2rem] flex flex-col shadow-2xl transition-all duration-[500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] shrink-0 ${!isSidebarAutoHide && 'h-full'} ${getSidebarDensityClass()} ${getSidebarWidth()} ${autoHideClasses}`}
      >
        <SidebarTop />
        <SidebarNav />
        <SidebarBottom />
      </aside>
    </>
  );
}