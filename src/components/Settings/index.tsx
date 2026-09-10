import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Battery as BatteryIcon, 
  LayoutTemplate, 
  Palette, 
  MonitorSmartphone, 
  PanelLeft, 
  AppWindow 
} from 'lucide-react';

// === USER IMPORTS ===
import { AppearanceSection } from './AppearanceSection';
import { InterfaceSection } from './InterfaceSection';
import { AppDrawerSection } from './AppDrawerSection';
import { SidebarSection } from './SidebarSection';
import { AboutHyperRealm } from './about'; 

// === NAYE SECTIONS JINKO HUMNE ADD KIYA HAI ===
import Profile from './Profile';
import Battery from './Battery';
import WidgetsCore from './WidgetsCore';

// 🎨 CUSTOM COMPONENT: Expandable Section (Accordion)
const CollapsibleSection = ({ title, icon: Icon, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-4 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Header / Clickable Area */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-5 hover:bg-white/10 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white/90 tracking-wide">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-500 dark:text-white/50" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-white/50" />
        )}
      </button>
      
      {/* Content Area (Expand/Collapse Animation) */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 pt-0 border-t border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/20">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  // State to manage whether to show the About page or the Settings grid
  const [showAbout, setShowAbout] = useState(false);

  // If showAbout is true, render our new Hollywood-level About page
  if (showAbout) {
    return <AboutHyperRealm onBack={() => setShowAbout(false)} />;
  }

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CENTERED LAYOUT WRAPPER (Single Column for better Accordion flow) */}
      <div className="min-h-full w-full flex flex-col items-center px-[1.5rem] md:px-[2rem] py-[2rem] md:py-[3rem] mx-auto max-w-[50rem]">
        
        <div className="w-full text-left mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-white/50 mt-1 text-sm">Manage your Hyper_Realm preferences</p>
        </div>

        {/* 1. TOP SECTION: PROFILE (Hamesha open rahega, no accordion) */}
        <div className="w-full mb-8">
          <Profile />
        </div>

        {/* 2. COLLAPSIBLE SETTINGS LIST */}
        <div className="w-full flex flex-col gap-2">
          
          <CollapsibleSection title="Appearance & Preview" icon={Palette}>
            <AppearanceSection />
          </CollapsibleSection>

          <CollapsibleSection title="Power & Battery" icon={BatteryIcon}>
            <Battery />
          </CollapsibleSection>

          <CollapsibleSection title="Widgets Management" icon={LayoutTemplate}>
            <WidgetsCore />
          </CollapsibleSection>

          <CollapsibleSection title="Interface Options" icon={MonitorSmartphone}>
            <InterfaceSection />
          </CollapsibleSection>

          <CollapsibleSection title="App Drawer" icon={AppWindow}>
            <AppDrawerSection />
          </CollapsibleSection>

          <CollapsibleSection title="Sidebar Layout" icon={PanelLeft}>
            <SidebarSection />
          </CollapsibleSection>

        </div>

        {/* Premium About Button */}
        <div className="mt-12 mb-8 flex justify-center w-full">
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