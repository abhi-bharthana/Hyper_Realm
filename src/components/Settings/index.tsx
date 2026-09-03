import React, { useState } from 'react';
import { AppearanceSection } from './AppearanceSection';
import { InterfaceSection } from './InterfaceSection';
import { AppDrawerSection } from './AppDrawerSection';
import { SidebarSection } from './SidebarSection';
// 🔥 NAYA IMPORT YAHAN HAI 🔥 (Ye automatically about/index.tsx ko utha lega)
import { AboutHyperRealm } from './about'; 

export default function Settings() {
  // State to manage whether to show the About page or the Settings grid
  const [showAbout, setShowAbout] = useState(false);

  // If showAbout is true, render our new Hollywood-level About page
  if (showAbout) {
    return <AboutHyperRealm onBack={() => setShowAbout(false)} />;
  }

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* PERFECT CENTERING WRAPPER */}
      <div className="min-h-full w-full flex flex-col justify-center px-[1.5rem] md:px-[2rem] py-[2rem] md:py-[3rem] mx-auto max-w-[80rem]">
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[1.5rem] items-start w-full">
          
          {/* Left Column */}
          <div className="flex flex-col gap-[1.5rem]">
            <AppearanceSection />
            <InterfaceSection />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[1.5rem]">
            <AppDrawerSection />
            <SidebarSection />
          </div>
          
        </div>

        {/* Premium About Button */}
        <div className="mt-10 flex justify-center w-full">
          <button
            onClick={() => setShowAbout(true)}
            className="group relative px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold tracking-wide uppercase hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-300 shadow-xl shadow-slate-900/20 dark:shadow-white/10 flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse"></div>
            About Hyper Realm
          </button>
        </div>
        
      </div>
      
    </div>
  );
}