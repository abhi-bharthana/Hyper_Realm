import { 
  LayoutDashboard, Settings, Zap, Cpu, 
  AppWindow, Server, Package, Activity, BatteryMedium, UserCircle,
  ChevronLeft, ChevronRight, Globe, Layers // <-- 'Layers' icon add kiya Widgets ke liye
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Sidebar() {
  const { activeTab, setActiveTab, isSidebarCollapsed, toggleSidebar, uiDensity } = useAppStore();

  // 1. FIXED SLIM WIDTHS
  const getSidebarWidth = () => {
    if (isSidebarCollapsed) return 'w-16'; // Ultra-slim collapsed state (64px)
    switch (uiDensity) {
      case 'ultra': return 'w-48';
      case 'compact': return 'w-52';
      case 'spacious': return 'w-64';
      default: return 'w-56';
    }
  };

  // 2. LOCKED ICON SIZE (No more shrinking/growing on toggle)
  const getIconSize = () => 18; 

  // Kept vertical padding consistent, only adjusting horizontal padding
  const getSidebarDensityClass = () => {
    if (isSidebarCollapsed) return 'py-5 px-2';
    switch (uiDensity) {
      case 'ultra': return 'py-4 px-2';
      case 'compact': return 'py-4 px-2.5';
      case 'spacious': return 'py-6 px-4';
      default: return 'py-5 px-3';
    }
  };

  return (
    <aside 
      className={`h-full bg-white/60 dark:bg-[#0a0a0a]/50 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[2rem] flex flex-col z-20 relative shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] shrink-0 ${getSidebarDensityClass()} ${getSidebarWidth()}`}
    >
      
      {/* --- TOP SECTION: TOGGLE & LOGO --- */}
      <div className="flex flex-col items-center w-full mb-6">
        
        {/* Toggle Button (STRICTLY ABOVE THE LOGO NOW) */}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 mb-5 rounded-xl bg-neutral-200/50 hover:bg-neutral-300 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} strokeWidth={2.5} /> : <ChevronLeft size={18} strokeWidth={2.5} />}
        </button>

        {/* Home Logo Section */}
        <div 
          onClick={() => setActiveTab('Home')}
          className={`flex items-center overflow-hidden cursor-pointer group w-full ${isSidebarCollapsed ? 'justify-center' : 'justify-start px-2'}`}
          title="Open Home Page"
        >
          {/* Logo Icon (Size locked) */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-black flex items-center justify-center shadow-lg border border-white/10 shrink-0 group-hover:scale-110 transition-transform duration-500 ease-out">
            <Zap size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          
          {/* Text Container (Smooth Width Animation via max-w) */}
          <div className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'
          }`}>
            <h1 className="text-[14px] font-bold tracking-wide text-neutral-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-tight">
              Hyper_Realm
            </h1>
            <p className="text-[9px] text-neutral-500 dark:text-neutral-400 font-mono tracking-widest uppercase mt-0.5">Core Env</p>
          </div>
        </div>
        
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto w-full modern-scroll pr-1 flex flex-col items-center">
        <NavItem icon={<LayoutDashboard size={getIconSize()} />} label="Dashboard" active={activeTab === 'Dashboard'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Dashboard')} />
        <NavItem icon={<AppWindow size={getIconSize()} />} label="Applications" active={activeTab === 'Applications'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Applications')} />
        <NavItem icon={<Globe size={getIconSize()} />} label="Hyper-Surf" active={activeTab === 'Hyper-Surf'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Hyper-Surf')} />
        
        {/* --- NAYA WIDGETS CORE TAB --- */}
        <NavItem icon={<Layers size={getIconSize()} />} label="Widgets Core" active={activeTab === 'Widgets Core'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Widgets Core')} />
        
        <NavItem icon={<Activity size={getIconSize()} />} label="Processes" active={activeTab === 'Processes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Processes')} />
        <NavItem icon={<BatteryMedium size={getIconSize()} />} label="Battery" active={activeTab === 'Battery'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Battery')} />
        
        {/* Divider */}
        <div className={`border-t border-neutral-200/60 dark:border-white/10 transition-all duration-500 my-2 ${isSidebarCollapsed ? 'w-1/2' : 'w-4/5'}`} />
        
        <NavItem icon={<Server size={getIconSize()} />} label="Services/Nodes" active={activeTab === 'Services/Nodes'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Services/Nodes')} />
        <NavItem icon={<Package size={getIconSize()} />} label="Libraries" active={activeTab === 'Libraries/Packages'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Libraries/Packages')} />
        <NavItem icon={<UserCircle size={getIconSize()} />} label="Profile" active={activeTab === 'Profile'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Profile')} />
        <NavItem icon={<Settings size={getIconSize()} />} label="Settings" active={activeTab === 'Node Settings'} collapsed={isSidebarCollapsed} density={uiDensity} onClick={() => setActiveTab('Node Settings')} />
      </nav>

      {/* --- BOTTOM NODE STATUS --- */}
      <div className={`mt-3 rounded-2xl bg-white/50 dark:bg-black/50 border border-white/40 dark:border-white/5 flex items-center transition-all duration-500 overflow-hidden ${
        isSidebarCollapsed ? 'justify-center w-10 h-10 self-center p-0 shrink-0' : 'space-x-3 w-full p-3 shrink-0'
      }`}>
        <div className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        </div>
        
        <div className={`overflow-hidden whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isSidebarCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-1'
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

// --- NAV ITEM COMPONENT (Synchronized Sizes & Smooth Text Expand) ---
function NavItem({ icon, label, active = false, collapsed = false, density = 'normal', onClick }: any) {
  
  // Vertical padding is kept consistent across states to avoid jumping
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
      className={`relative flex items-center rounded-xl transition-all duration-500 overflow-hidden group w-full ${getVerticalPadding()} ${
        collapsed ? 'justify-center px-0' : 'px-3'
      } ${
        active 
          ? 'bg-neutral-900/5 dark:bg-white/10 text-neutral-900 dark:text-white font-semibold shadow-sm backdrop-blur-md' 
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-900/5 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
      }`}
    >
      {/* Active Indicator Line */}
      <div className={`absolute left-0 w-1 bg-neutral-800 dark:bg-white rounded-r-full transition-all duration-500 ease-out ${
        active ? 'h-1/2 opacity-100' : 'h-0 opacity-0'
      }`} />
      
      {/* Fixed-width Icon Container ensures it never stretches or shrinks */}
      <span className={`shrink-0 flex items-center justify-center w-8 transition-transform duration-300 ${!active && 'group-hover:scale-110'}`}>
        {icon}
      </span>
      
      {/* Text smoothly reveals using max-width trick */}
      <span className={`font-medium tracking-wide whitespace-nowrap overflow-hidden text-left text-[13px] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
        collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[12rem] opacity-100 ml-2'
      } ${!active && 'group-hover:translate-x-1'}`}>
        {label}
      </span>
    </button>
  );
}