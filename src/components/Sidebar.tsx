import { 
  LayoutDashboard, Settings, Zap, Cpu, 
  AppWindow, Server, Package, Activity, BatteryMedium, UserCircle,
  ChevronLeft, ChevronRight, Globe
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Sidebar() {
  const { activeTab, setActiveTab, isSidebarCollapsed, toggleSidebar, uiDensity } = useAppStore();

  const getSidebarWidth = () => {
    if (isSidebarCollapsed) return 'w-12 items-center';
    switch (uiDensity) {
      case 'ultra': return 'w-40';
      case 'compact': return 'w-44';
      case 'spacious': return 'w-56';
      default: return 'w-48';
    }
  };

  const getIconSize = () => {
    if (isSidebarCollapsed) return 16;
    return 16; 
  };

  const getSidebarDensityClass = () => {
    if (isSidebarCollapsed) return 'py-3 px-1 gap-1.5';
    switch (uiDensity) {
      case 'ultra': return 'py-2.5 px-2 gap-1.5';
      case 'compact': return 'py-3 px-2.5 gap-2';
      case 'spacious': return 'py-6 px-4 gap-4';
      default: return 'py-3.5 px-3 gap-2.5';
    }
  };

  return (
    <aside 
      className={`h-full bg-white/70 dark:bg-[#121215]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/[0.08] rounded-[2.5rem] flex flex-col z-20 relative shadow-2xl transition-all duration-300 ease-in-out shrink-0 ${getSidebarDensityClass()} ${getSidebarWidth()}`}
    >
      {/* Header & Logo (Clickable to open Home Page) */}
      <div className={`flex items-center px-1 ${isSidebarCollapsed ? 'justify-center mb-2' : 'justify-between mb-2'}`}>
        <div 
          onClick={() => setActiveTab('Home')}
          className="flex items-center space-x-2 overflow-hidden cursor-pointer group"
          title="Open Home Page"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-zinc-700 to-zinc-900 dark:from-zinc-800 dark:to-zinc-950 flex items-center justify-center shadow-md border border-zinc-700/30 shrink-0 group-hover:scale-105 transition-transform">
            <Zap size={15} className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-xs font-bold tracking-wide text-slate-900 dark:text-zinc-100 group-hover:text-emerald-400 transition-colors leading-tight">
                Hyper_Realm
              </h1>
              <p className="text-[7px] text-zinc-500 dark:text-zinc-400 font-mono tracking-widest uppercase">Core</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        {!isSidebarCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Collapsed Expand Trigger */}
      {isSidebarCollapsed && (
        <button 
          onClick={toggleSidebar}
          className="mb-2 p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors self-center"
          title="Expand Sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto w-full custom-scrollbar pr-0.5">
        <NavItem icon={<LayoutDashboard size={getIconSize()} />} label="Dashboard" active={activeTab === 'Dashboard'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Dashboard')} />
        <NavItem icon={<AppWindow size={getIconSize()} />} label="Applications" active={activeTab === 'Applications'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Applications')} />
        
        {/* Naya Hyper-Surf Tab */}
        <NavItem icon={<Globe size={getIconSize()} />} label="Hyper-Surf" active={activeTab === 'Hyper-Surf'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Surf')} />
        
        <NavItem icon={<Activity size={getIconSize()} />} label="Processes" active={activeTab === 'Processes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Processes')} />
        <NavItem icon={<BatteryMedium size={getIconSize()} />} label="Battery" active={activeTab === 'Battery'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Battery')} />
        
        <div className="my-1.5 border-t border-slate-200 dark:border-white/[0.06]" />
        
        <NavItem icon={<Server size={getIconSize()} />} label="Services/Nodes" active={activeTab === 'Services/Nodes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Services/Nodes')} />
        <NavItem icon={<Package size={getIconSize()} />} label="Libraries" active={activeTab === 'Libraries/Packages'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Libraries/Packages')} />
        <NavItem icon={<UserCircle size={getIconSize()} />} label="Profile" active={activeTab === 'Profile'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Profile')} />
        <NavItem icon={<Settings size={getIconSize()} />} label="Settings" active={activeTab === 'Node Settings'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Node Settings')} />
      </nav>

      {/* Bottom Node Status */}
      <div className={`rounded-xl bg-slate-100/60 dark:bg-black/40 border border-slate-200 dark:border-white/[0.06] flex items-center ${
        isSidebarCollapsed ? 'justify-center w-8 h-8 self-center p-0' : 'space-x-2 w-full p-2'
      }`}>
        <div className="relative flex h-1.5 w-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
        </div>
        {!isSidebarCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <p className="font-semibold text-slate-700 dark:text-zinc-200 text-[10px]">Node Active</p>
            <p className="text-[7px] text-slate-500 dark:text-zinc-400 font-mono flex items-center gap-0.5">
              <Cpu size={8} /> ARM64
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false, collapsed = false, density = 'normal', onClick }: any) {
  const getItemPadding = () => {
    if (collapsed) return 'p-1.5 justify-center w-8 h-8 mx-auto';
    switch (density) {
      case 'ultra': return 'px-3 py-1.5 text-xs';
      case 'compact': return 'px-3 py-1.5 text-xs';
      case 'spacious': return 'px-3.5 py-2.5 text-sm';
      default: return 'px-3 py-2 text-xs';
    }
  };

  return (
    <button 
      onClick={onClick} 
      title={collapsed ? label : undefined}
      className={`w-full flex items-center rounded-xl transition-all duration-300 ${getItemPadding()} ${
        active 
          ? 'bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-semibold shadow-sm' 
          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-zinc-200'
      }`}
    >
      <span className="shrink-0 flex items-center justify-center">{icon}</span>
      {!collapsed && <span className="font-medium tracking-wide whitespace-nowrap overflow-hidden text-ellipsis ml-2.5 text-xs">{label}</span>}
    </button>
  );
}