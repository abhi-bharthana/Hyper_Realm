import React from 'react';
import { AppearanceSection } from './AppearanceSection';
import { InterfaceSection } from './InterfaceSection';
import { AppDrawerSection } from './AppDrawerSection';
import { SidebarSection } from './SidebarSection';

export default function Settings() {
  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* PERFECT CENTERING WRAPPER: min-h-full and justify-center added */}
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
        
      </div>
      
    </div>
  );
}