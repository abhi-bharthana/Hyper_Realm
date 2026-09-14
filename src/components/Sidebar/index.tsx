import React from 'react'; 
import { SidebarTop } from './SidebarTop'; 
import { SidebarNav } from './SidebarNav'; 
import { SidebarBottom } from './SidebarBottom'; 
import { useSidebarStore } from '../../store/useSidebarStore'; 

export const Sidebar = () => {   
  const { isSidebarCollapsed } = useSidebarStore(); 

  return (     
    // 🔥 FIX: w-[64px] ko aur patla karke w-[54px] kar diya taaki extra space na bache
    <div className={`h-full ${isSidebarCollapsed ? 'w-[64px]' : 'w-[240px]'} -ml-3 bg-white/10 dark:bg-[#0a0a0c]/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col py-6 px-1 relative transition-all duration-300 ease-in-out`}>              
      <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-none z-[-1]" />              
      <SidebarTop />       
      <SidebarNav />       
      <SidebarBottom />     
    </div>   
  ); 
};