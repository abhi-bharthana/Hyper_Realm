import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronUp, Battery as BatteryIcon, 
  Palette, MonitorSmartphone, PanelLeft, AppWindow, Search, 
  Database // 🔥 Database icon for Indexing
} from 'lucide-react';

import { AppearanceSection } from './AppearanceSection';
import { InterfaceSection } from './InterfaceSection';
import { AppDrawerSection } from './AppDrawerSection';
import { SidebarSection } from './SidebarSection';
import { AboutHyperRealm } from './about';
import Profile from './profile';
import Battery from './Battery';
// 🔥 FIX: Updated import to our new advanced IndexingManager
import { IndexingManager } from './IndexingManager'; 

const CollapsibleSection = ({ title, icon: Icon, children, isOpen, onToggle, isLast = false }: any) => {
  return (
    <div className={`transition-colors duration-300 ${!isLast ? 'border-b border-slate-200/80 dark:border-white/5' : ''}`}>
      <button 
        onClick={onToggle} 
        className="w-full flex items-center justify-between p-5 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-[1.05rem] font-semibold text-slate-800 dark:text-zinc-100 tracking-wide">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
        )}
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5 pt-0 bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  const [showAbout, setShowAbout] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("Appearance & Preview");

  const SETTINGS_SECTIONS = useMemo(() => [
    { id: "Appearance & Preview", icon: Palette, component: <AppearanceSection searchQuery={searchQuery} />, keywords: "theme color dark mode light mode ui aesthetic" },
    // 🔥 FIX: Replaced old component with IndexingManager
    { id: "AI Indexing & Search", icon: Database, component: <IndexingManager />, keywords: "ai index search semantic smart database scan music brain vector speed" },
    { id: "Power & Battery", icon: BatteryIcon, component: <Battery />, keywords: "energy usage performance node active charging power saver eco" },
    { id: "Interface Options", icon: MonitorSmartphone, component: <InterfaceSection searchQuery={searchQuery} />, keywords: "scale text font size zoom eye care filter display typography" },
    { id: "App Drawer", icon: AppWindow, component: <AppDrawerSection searchQuery={searchQuery} />, keywords: "grid icons spacing launcher app names size" },
    { id: "Sidebar Layout", icon: PanelLeft, component: <SidebarSection searchQuery={searchQuery} />, keywords: "navigation auto-hide pin collapse shortcuts sidebar" }
  ], [searchQuery]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SETTINGS_SECTIONS;
    const query = searchQuery.toLowerCase();
    return SETTINGS_SECTIONS.filter(
      section => 
        section.id.toLowerCase().includes(query) || 
        section.keywords.toLowerCase().includes(query)
    );
  }, [searchQuery, SETTINGS_SECTIONS]);

  useMemo(() => {
    if (searchQuery.trim() && filteredSections.length > 0) {
      setOpenSection(filteredSections[0].id);
    }
  }, [searchQuery, filteredSections]);

  if (showAbout) {
    return <AboutHyperRealm onBack={() => setShowAbout(false)} />;
  }

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="min-h-full w-full mx-auto max-w-[76rem] px-4 md:px-8 py-8 md:py-10">
        
        {/* ========================================== */}
        {/* TOP HEADER ROW: Title & Search */}
        {/* ========================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 w-full">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1 text-[0.9rem]">Manage your Hyper_Realm preferences</p>
          </div>
          
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/60 dark:bg-[#111111] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-10 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-800 dark:text-zinc-200 transition-all placeholder:text-slate-500 shadow-sm"
            />
          </div>
        </div>

        {/* ========================================== */}
        {/* GRID LAYOUT: Profile (Left) & Settings (Right) */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-8">
            {!searchQuery.trim() && (
              <div className="w-full">
                <Profile />
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="mt-2 flex justify-start w-full">
                <button
                  onClick={() => setShowAbout(true)}
                  className="group w-full relative px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold tracking-wide hover:bg-slate-800 dark:hover:bg-slate-200 hover:-translate-y-0.5 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                  About Hyper Realm
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Settings Accordion List */}
          <div className="lg:col-span-7 w-full">
            {filteredSections.length > 0 ? (
              <div className="w-full bg-white/60 dark:bg-[#0c0c0c] backdrop-blur-2xl border border-slate-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
                {filteredSections.map((section, index) => (
                  <CollapsibleSection 
                    key={section.id}
                    title={section.id} 
                    icon={section.icon} 
                    isOpen={openSection === section.id}
                    onToggle={() => setOpenSection(openSection === section.id ? null : section.id)}
                    isLast={index === filteredSections.length - 1}
                  >
                    {section.component}
                  </CollapsibleSection>
                ))}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 bg-white/30 dark:bg-[#0c0c0c]/50 rounded-[2rem] border border-slate-200/50 dark:border-white/5">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-lg">No settings found</p>
                <p className="text-sm opacity-70 mt-1">Try searching for something else.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}