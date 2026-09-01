import React from 'react';
import { 
  LayoutDashboard, Settings, Zap, Cpu, 
  AppWindow, Server, Package, Activity, BatteryMedium, UserCircle,
  ChevronLeft, ChevronRight, Globe, Layers, Music, Video, Link, X
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Sidebar() {
  const { 
    activeTab, setActiveTab, 
    isSidebarCollapsed, toggleSidebar, 
    uiDensity, apps, launchApp, closeApp 
  } = useAppStore();

  const getSidebarWidth = () => {
    if (isSidebarCollapsed) return 'w-16'; 
    switch (uiDensity) {
      case 'ultra': return 'w-48';
      case 'compact': return 'w-52';
      case 'spacious': return 'w-64';
      default: return 'w-56';
    }
  };

  const getIconSize = () => 18; 

  const getSidebarDensityClass = () => {
    if (isSidebarCollapsed) return 'py-5 px-2';
    switch (uiDensity) {
      case 'ultra': return 'py-4 px-2';
      case 'compact': return 'py-4 px-2.5';
      case 'spacious': return 'py-6 px-4';
      default: return 'py-5 px-3';
    }
  };

  // --- RUNNING APPS LOGIC ---
  const isInternalAppActive = (appId: string) => {
    if (appId === 'hyper-surf' && activeTab === 'Hyper-Surf') return true;
    if (appId === 'hyper-media' && activeTab === 'Hyper-Media') return true;
    if (appId === 'hyper-music' && activeTab === 'Music') return true;
    return false;
  };

  const taskbarApps = apps.filter(app => app.status === 'running' || isInternalAppActive(app.id));

  // Icons strictly mapped to your App Drawer icons
  const renderAppIcon = (iconName: string, size: number) => {
    switch(iconName) {
      case 'Globe': return <Globe size={size} />;
      case 'Film': return <Video size={size} />; // Mapped to Video
      case 'Music': return <Music size={size} />; // Mapped to Music
      case 'Activity': return <Activity size={size} />;
      default: return <AppWindow size={size} />;
    }
  };

  return (
    <aside 
      className={`h-full bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[2rem] flex flex-col z-20 relative shadow-2xl transition-all duration-[400ms] ease-in-out shrink-0 ${getSidebarDensityClass()} ${getSidebarWidth()}`}
    >
      
      {/* --- TOP SECTION: TOGGLE & LOGO --- */}
      <div className="flex flex-col items-center w-full mb-6">
        
        <button 
          onClick={toggleSidebar}
          className="p-1.5 mb-5 rounded-xl bg-neutral-200/50 hover:bg-neutral-300 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} strokeWidth={2.5} /> : <ChevronLeft size={18} strokeWidth={2.5} />}
        </button>

        <div 
          onClick={() => setActiveTab('Home')}
          className={`flex items-center overflow-hidden cursor-pointer group w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-start px-2'}`}
          title="Open Home Page"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-black flex items-center justify-center shadow-lg border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-[400ms] ease-out">
            <Zap size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          
          {/* Butter smooth width/opacity transition */}
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-[400ms] ease-in-out ${
            isSidebarCollapsed ? 'w-0 opacity-0 ml-0' : 'w-[110px] opacity-100 ml-3'
          }`}>
            <h1 className="text-[14px] font-bold tracking-wide text-neutral-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-tight">
              Hyper_Realm
            </h1>
            <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono tracking-widest uppercase mt-0.5">Core Env</p>
          </div>
        </div>
        
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1 flex flex-col items-center">
        <NavItem icon={<LayoutDashboard size={getIconSize()} />} label="Dashboard" active={activeTab === 'Dashboard'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Dashboard')} />
        <NavItem icon={<AppWindow size={getIconSize()} />} label="Applications" active={activeTab === 'Applications'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Applications')} />
        <NavItem icon={<Link size={getIconSize()} />} label="Hyper-Link" active={activeTab === 'Hyper-Link'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Link')} />
        <NavItem icon={<Globe size={getIconSize()} />} label="Hyper-Surf" active={activeTab === 'Hyper-Surf'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Surf')} />
        <NavItem icon={<Layers size={getIconSize()} />} label="Widgets Core" active={activeTab === 'Widgets Core'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Widgets Core')} />
        <NavItem icon={<Activity size={getIconSize()} />} label="Processes" active={activeTab === 'Processes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Processes')} />
        <NavItem icon={<BatteryMedium size={getIconSize()} />} label="Battery" active={activeTab === 'Battery'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Battery')} />
        
        <div className={`border-t border-neutral-200/60 dark:border-white/10 transition-all duration-[400ms] my-2 ${isSidebarCollapsed ? 'w-1/2' : 'w-4/5'}`} />
        
        <NavItem icon={<Server size={getIconSize()} />} label="Services/Nodes" active={activeTab === 'Services/Nodes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Services/Nodes')} />
        <NavItem icon={<Package size={getIconSize()} />} label="Libraries" active={activeTab === 'Libraries/Packages'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Libraries/Packages')} />
        <NavItem icon={<UserCircle size={getIconSize()} />} label="Profile" active={activeTab === 'Profile'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Profile')} />
        <NavItem icon={<Settings size={getIconSize()} />} label="Settings" active={activeTab === 'Node Settings'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Node Settings')} />
        
        {/* --- RUNNING APPS (TASKBAR) --- */}
        {taskbarApps.length > 0 && (
          <>
            <div className={`border-t border-neutral-200/60 dark:border-white/10 transition-all duration-[400ms] my-2 ${isSidebarCollapsed ? 'w-1/2' : 'w-4/5'}`} />
            {taskbarApps.map((app) => {
              const active = activeTab === app.name || (app.id === 'hyper-surf' && activeTab === 'Hyper-Surf') || (app.id === 'hyper-media' && activeTab === 'Hyper-Media') || (app.id === 'hyper-music' && activeTab === 'Music');
              return (
                <NavItem 
                  key={app.id} 
                  icon={renderAppIcon(app.icon, getIconSize())} 
                  label={app.name} 
                  active={active} 
                  collapsed={isSidebarCollapsed} 
                  density={uiDensity} 
                  onClick={() => launchApp(app.id)}
                  isTaskbarApp={true}
                  onClose={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    closeApp(app.id);
                  }}
                />
              );
            })}
          </>
        )}
      </nav>

      {/* --- BOTTOM NODE STATUS --- */}
      <div className={`mt-3 rounded-2xl bg-white/50 dark:bg-black/50 border border-white/40 dark:border-white/5 flex items-center transition-all duration-[400ms] overflow-hidden ${
        isSidebarCollapsed ? 'justify-center w-10 h-10 self-center p-0 shrink-0' : 'space-x-3 w-full p-3 shrink-0'
      }`}>
        <div className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </div>
        
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-[400ms] ease-in-out ${
          isSidebarCollapsed ? 'w-0 opacity-0 ml-0' : 'w-[120px] opacity-100 ml-1'
        }`}>
          <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11.5px] tracking-wide">Node Active</p>
          <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-1 mt-0.5 uppercase tracking-wider">
            <Cpu size={10} /> ARM64 Core
          </p>
        </div>
      </div>
    </aside>
  );
}

// --- NAV ITEM COMPONENT ---
function NavItem({ icon, label, active = false, collapsed = false, density = 'normal', onClick, isTaskbarApp = false, onClose }: any) {
  
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
      <div className={`absolute left-0 w-1 bg-neutral-800 dark:bg-white rounded-r-full transition-all duration-300 ease-out ${
        active ? 'h-1/2 opacity-100' : 'h-0 opacity-0'
      }`} />
      
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
          {isTaskbarApp && !collapsed && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </span>
        
        {/* Close Button for Running Apps */}
        {isTaskbarApp && !collapsed && (
          <div 
            onClick={onClose}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-all shrink-0"
          >
            <X size={14} />
          </div>
        )}
      </span>
    </button>
  );
}