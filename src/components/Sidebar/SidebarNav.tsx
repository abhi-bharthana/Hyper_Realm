import React from 'react';
import { 
  LayoutDashboard, Settings, AppWindow, Server, Package, 
  Activity, BatteryMedium, UserCircle, Globe, Layers, Music, Video, Link, Mic 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useSidebarStore } from '../../store/useSidebarStore'; // 🔥 Sidebar store imported
import { NavItem } from './NavItem';

export function SidebarNav() {
  const { activeTab, setActiveTab, isSidebarCollapsed, uiDensity, apps, launchApp, closeApp } = useAppStore();
  const { items } = useSidebarStore(); // 🔥 Fetching items from sidebar store

  const getIconSize = () => 18;

  // Helper to check if item is enabled in sidebar store
  const isVisible = (id: string) => {
    const item = items.find(i => i.id === id);
    return item ? item.isVisible : true;
  };

  const isInternalAppActive = (appId: string) => {
    if (appId === 'hyper-surf' && activeTab === 'Hyper-Surf') return true;
    if (appId === 'hyper-media' && activeTab === 'Hyper-Media') return true;
    if (appId === 'hyper-music' && activeTab === 'Music') return true;
    return false;
  };

  const taskbarApps = apps.filter(app => app.status === 'running' || isInternalAppActive(app.id));

  const renderAppIcon = (iconName: string, size: number) => {
    switch(iconName) {
      case 'Globe': return <Globe size={size} />;
      case 'Film': return <Video size={size} />;
      case 'Music': return <Music size={size} />;
      case 'Activity': return <Activity size={size} />;
      default: return <AppWindow size={size} />;
    }
  };

  return (
    <nav className="flex-1 space-y-1.5 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 flex flex-col items-center">
      
      {/* 🟢 TOP APPS */}
      {isVisible('dashboard') && <NavItem icon={<LayoutDashboard size={getIconSize()} />} label="Dashboard" active={activeTab === 'Dashboard'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Dashboard')} />}
      {isVisible('apps') && <NavItem icon={<AppWindow size={getIconSize()} />} label="Applications" active={activeTab === 'Applications'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Applications')} />}
      {isVisible('hyper-link') && <NavItem icon={<Link size={getIconSize()} />} label="Hyper-Link" active={activeTab === 'Hyper-Link'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Link')} />}
      {isVisible('hyper-surf') && <NavItem icon={<Globe size={getIconSize()} />} label="Hyper-Surf" active={activeTab === 'Hyper-Surf'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Surf')} />}
      {isVisible('widgets') && <NavItem icon={<Layers size={getIconSize()} />} label="Widgets Core" active={activeTab === 'Widgets Core'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Widgets Core')} />}
      {isVisible('processes') && <NavItem icon={<Activity size={getIconSize()} />} label="Processes" active={activeTab === 'Processes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Processes')} />}
      {isVisible('battery') && <NavItem icon={<BatteryMedium size={getIconSize()} />} label="Battery" active={activeTab === 'Battery'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Battery')} />}
      
      {/* 🎵 MEDIA & AI APPS */}
      {isVisible('music') && <NavItem icon={<Music size={getIconSize()} />} label="Music Studio" active={activeTab === 'Music'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Music')} />}
      {isVisible('media') && <NavItem icon={<Video size={getIconSize()} />} label="Video Player" active={activeTab === 'Hyper-Media'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Media')} />}
      {isVisible('recorder') && <NavItem icon={<Mic size={getIconSize()} />} label="AI Recorder" active={activeTab === 'AI Recorder'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('AI Recorder')} />}

      {/* --- SEPARATOR --- */}
      <div className={`border-t border-neutral-200/60 dark:border-white/10 transition-all duration-[400ms] my-2 ${isSidebarCollapsed ? 'w-1/2' : 'w-4/5'}`} />

      {/* ⚙️ SYSTEM & SETTINGS */}
      {isVisible('servicenodes') && <NavItem icon={<Server size={getIconSize()} />} label="Services/Nodes" active={activeTab === 'Services/Nodes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Services/Nodes')} />}
      {isVisible('libraries') && <NavItem icon={<Package size={getIconSize()} />} label="Libraries" active={activeTab === 'Libraries/Packages'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Libraries/Packages')} />}
      {isVisible('profile') && <NavItem icon={<UserCircle size={getIconSize()} />} label="Profile" active={activeTab === 'Profile'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Profile')} />}
      <NavItem icon={<Settings size={getIconSize()} />} label="Settings" active={activeTab === 'Node Settings'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Node Settings')} />

      {/* 🚀 RUNNING TASKBAR APPS */}
      {taskbarApps.length > 0 && (
        <>
          <div className={`border-t border-neutral-200/60 dark:border-white/10 transition-all duration-[400ms] my-2 ${isSidebarCollapsed ? 'w-1/2' : 'w-4/5'}`} />
          {taskbarApps.taskbarApps?.map ? taskbarApps.map((app) => {
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
                onClose={(e: React.MouseEvent) => { e.stopPropagation(); closeApp(app.id); }}
              />
            );
          }) : null}
        </>
      )}
    </nav>
  );
}