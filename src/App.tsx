import { useEffect, useMemo } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window'; 

// 🚀 Core System Components
import { Sidebar } from './components/Sidebar';
import Home from './components/home/Home';
import Dashboard from './components/Dashboard';
import { Applications } from './components/APP/launcher/Applications'; // 🔥 Updated Path
import Processes from './components/Settings/Processes';
import Battery from './components/Settings/Battery';
import Services from './components/Services';
import Libraries from './components/Libraries';
import Profile from './components/Settings/profile';
import Settings from './components/Settings';
import WidgetsCore from './components/Settings/WidgetsCore';
import HyperLinkView from './components/hyperlink/HyperLinkView'; 

// 🎵 Global Services (Kept direct because it runs in background)
import GlobalAudioEngine from './components/APP/music/GlobalAudioEngine';

// 🔥 DYNAMIC REGISTRY IMPORT 🔥
import { CORE_APPS } from './components/APP/appRegistry';

import { useAppStore } from './store/useAppStore';
import { useSidebarStore } from './store/useSidebarStore'; 

export default function App() {
  const { 
    environmentName, theme, activeTab, setActiveTab, setAppIdle, 
    homeBackgroundType, homeBackgroundValue,
    globalFontFamily, uiScale, textScale, isEyeCareEnabled, eyeCareIntensity 
  } = useAppStore();

  const { isSidebarCollapsed, isSidebarAutoHide } = useSidebarStore();

  // =========================================================================
  // 🔥 DYNAMIC APP RESOLVER (Finds active app from registry)
  // =========================================================================
  const activeAppConfig = useMemo(() => {
    return CORE_APPS.find(app => app.title === activeTab);
  }, [activeTab]);

  useEffect(() => {
    let unlisten: Promise<() => void>;
    try {
      unlisten = listen('process-exited', (event) => { setAppIdle(event.payload as string); });
    } catch (e) {
      console.warn("Tauri environment not detected.");
    }
    return () => { if (unlisten) unlisten.then(f => f()); };
  }, [setAppIdle]);

  useEffect(() => {
    if (!activeTab) setActiveTab('Home');
  }, [activeTab, setActiveTab]);

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentTheme: string) => {
      root.classList.remove('light', 'dark');
      if (currentTheme === 'system') {
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      } else {
        root.classList.add(currentTheme);
      }
    };

    applyTheme(theme);

    const handleSystemThemeChange = () => {
      if (useAppStore.getState().theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'F11' || (e.key === 'Enter' && e.altKey)) {
        e.preventDefault(); 
        try {
          const appWindow = getCurrentWindow();
          const isFullscreen = await appWindow.isFullscreen();
          await appWindow.setFullscreen(!isFullscreen);
        } catch (error) {
          console.error("Fullscreen API blocked:", error);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // =========================================================================
  // 🌐 SMART MANIFEST ROUTING: Isolates the specific app based on Vite Env
  // =========================================================================
  const appTarget = import.meta.env.VITE_APP_TARGET;

  if (appTarget) {
    // Dynamically find component for the standalone window
    const TargetComponent = CORE_APPS.find(app => app.id === appTarget)?.component;

    return (
      <div className="h-screen w-screen overflow-hidden flex relative font-sans selection:bg-blue-500/30 transition-all duration-700 ease-in-out bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100">
        <style>{`
          :root {
            font-size: ${14 * uiScale}px !important; 
            font-family: ${globalFontFamily};
          }
          .text-\\[0\\.65em\\] { font-size: calc(0.65rem * ${textScale}) !important; }
          .text-\\[0\\.75em\\] { font-size: calc(0.75rem * ${textScale}) !important; }
          .text-\\[0\\.8em\\] { font-size: calc(0.8rem * ${textScale}) !important; }
          .text-\\[0\\.85em\\] { font-size: calc(0.85rem * ${textScale}) !important; }
          .text-\\[0\\.9em\\] { font-size: calc(0.9rem * ${textScale}) !important; }
          .text-\\[0\\.95em\\] { font-size: calc(0.95rem * ${textScale}) !important; }
          .text-\\[1em\\] { font-size: calc(1rem * ${textScale}) !important; }
          .text-\\[1\\.1em\\] { font-size: calc(1.1rem * ${textScale}) !important; }
          .text-\\[1\\.5em\\] { font-size: calc(1.5rem * ${textScale}) !important; }
          .text-\\[1\\.75em\\] { font-size: calc(1.75rem * ${textScale}) !important; }
          .text-\\[1\\.8em\\] { font-size: calc(1.8rem * ${textScale}) !important; }
          .text-xs { font-size: calc(0.75rem * ${textScale}) !important; }
          .text-sm { font-size: calc(0.875rem * ${textScale}) !important; }
          .text-base { font-size: calc(1rem * ${textScale}) !important; }
          .text-lg { font-size: calc(1.125rem * ${textScale}) !important; }
        `}</style>

        {isEyeCareEnabled && (
          <div 
            className="fixed inset-0 z-[99999] pointer-events-none mix-blend-multiply transition-opacity duration-700"
            style={{ backgroundColor: '#ff8c00', opacity: eyeCareIntensity / 100 }}
          />
        )}

        {/* Global engine specifically for music target */}
        {appTarget === 'hyper-music' && <GlobalAudioEngine />}
        
        {/* 🔥 DYNAMIC COMPONENT RENDER 🔥 */}
        {TargetComponent ? <TargetComponent /> : <div className="text-white p-4">App Module Not Found</div>}
      </div>
    );
  }
  // =========================================================================

  const getHeaderDescription = () => {
    // 🚀 Dynamic App Description Fallback
    if (activeAppConfig) return activeAppConfig.description;

    // Static System Route Descriptions
    switch (activeTab) {
      case 'Applications': return "Select an environment module to launch into isolated space.";
      case 'Widgets Core': return "Granular telemetry and standalone module orchestration.";
      case 'Hyper-Link': return "Seamless connectivity, global cloud tunnels, and local network bridges."; 
      case 'Processes': return "Live system metrics and resource consumption.";
      case 'Battery': return "Power draw and ARM64 efficiency node status.";
      case 'Dashboard': return "System core overview and analytics.";
      case 'Profile': return "Manage identity and view hardware specifications.";
      case 'Node Settings': return "Configuration and workspace management.";
      default: return "System workspace configuration.";
    }
  };

  const isHome = activeTab === 'Home';
  const isAppView = !!activeAppConfig; // 🔥 True if any registry app is active
  
  const isFullscreenView = isHome || isAppView || activeTab === 'Node Settings';
  
  const showCustomBg = isHome && homeBackgroundType !== 'default';

  return (
    <div 
      className={`h-screen w-screen overflow-hidden flex relative font-sans selection:bg-blue-500/30 transition-all duration-700 ease-in-out ${
        showCustomBg ? 'text-white' : 'bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100'
      }`}
      style={
        showCustomBg ? {
          backgroundColor: homeBackgroundType === 'solid' ? homeBackgroundValue : 'transparent',
          backgroundImage: homeBackgroundType === 'gradient' ? homeBackgroundValue : (homeBackgroundType === 'image' ? `url(${homeBackgroundValue})` : 'none'),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {}
      }
    >
      <style>{`
        :root {
          font-size: ${14 * uiScale}px !important; 
          font-family: ${globalFontFamily};
        }
        .text-\\[0\\.65em\\] { font-size: calc(0.65rem * ${textScale}) !important; }
        .text-\\[0\\.75em\\] { font-size: calc(0.75rem * ${textScale}) !important; }
        .text-\\[0\\.8em\\] { font-size: calc(0.8rem * ${textScale}) !important; }
        .text-\\[0\\.85em\\] { font-size: calc(0.85rem * ${textScale}) !important; }
        .text-\\[0\\.9em\\] { font-size: calc(0.9rem * ${textScale}) !important; }
        .text-\\[0\\.95em\\] { font-size: calc(0.95rem * ${textScale}) !important; }
        .text-\\[1em\\] { font-size: calc(1rem * ${textScale}) !important; }
        .text-\\[1\\.1em\\] { font-size: calc(1.1rem * ${textScale}) !important; }
        .text-\\[1\\.5em\\] { font-size: calc(1.5rem * ${textScale}) !important; }
        .text-\\[1\\.75em\\] { font-size: calc(1.75rem * ${textScale}) !important; }
        .text-\\[1\\.8em\\] { font-size: calc(1.8rem * ${textScale}) !important; }
        .text-xs { font-size: calc(0.75rem * ${textScale}) !important; }
        .text-sm { font-size: calc(0.875rem * ${textScale}) !important; }
        .text-base { font-size: calc(1rem * ${textScale}) !important; }
        .text-lg { font-size: calc(1.125rem * ${textScale}) !important; }
      `}</style>

      {isEyeCareEnabled && (
        <div 
          className="fixed inset-0 z-[99999] pointer-events-none mix-blend-multiply transition-opacity duration-700"
          style={{ backgroundColor: '#ff8c00', opacity: eyeCareIntensity / 100 }}
        />
      )}

      {/* Main dashboard audio engine (Background play) */}
      <GlobalAudioEngine />
      
      {!showCustomBg && !isAppView && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-300/40 dark:bg-zinc-800/10 blur-[140px] rounded-full pointer-events-none -z-10 transition-opacity duration-700" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-slate-300/40 dark:bg-neutral-800/10 blur-[140px] rounded-full pointer-events-none -z-10 transition-opacity duration-700" />
        </>
      )}
      
      <div 
        className={`transition-all duration-500 ease-in-out z-[99] flex-shrink-0 h-full py-[1.5em] pl-[1.5em]
          ${isSidebarCollapsed ? 'w-[5.5rem]' : 'w-64'} 
          ${isSidebarAutoHide 
              ? 'absolute left-0 -translate-x-[calc(100%-4px)] hover:translate-x-0' 
              : 'relative translate-x-0'
           }
        `}
      >
        {isSidebarAutoHide && (
          <div className="absolute top-0 right-0 w-8 h-full bg-transparent cursor-pointer z-[-1]" />
        )}
        
        <Sidebar />
      </div>
      
      <main className={`flex-1 h-full flex flex-col overflow-hidden z-10 ${isFullscreenView ? 'p-0' : 'p-[1.5em] gap-[1em]'}`}>
        
        {!isFullscreenView && (
          <header className="flex-shrink-0 mb-[0.5em]">
            <h2 className="text-[1.8em] font-bold tracking-tight mb-[0.1em] transition-all duration-300">
              {activeTab === 'Dashboard' ? environmentName : activeTab}
            </h2>
            <p className="opacity-60 text-[0.9em] font-medium transition-all duration-300">
              {getHeaderDescription()}
            </p>
          </header>
        )}
        
        <div className={`flex-1 w-full h-full custom-scrollbar ${isFullscreenView ? 'overflow-hidden rounded-[1.5em] shadow-2xl' : 'overflow-y-auto pb-2 pr-1'}`}>
          {/* Static System Routes */}
          {isHome && <Home />}
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Applications' && <Applications />}
          {activeTab === 'Hyper-Link' && <HyperLinkView />} 
          {activeTab === 'Widgets Core' && <WidgetsCore />}
          {activeTab === 'Processes' && <Processes />}
          {activeTab === 'Battery' && <Battery />}
          {activeTab === 'Services/Nodes' && <Services />}
          {activeTab === 'Libraries/Packages' && <Libraries />}
          {activeTab === 'Profile' && <Profile />}
          {activeTab === 'Node Settings' && <Settings />}

          {/* 🔥 DYNAMIC APP ROUTING 🔥 */}
          {activeAppConfig && <activeAppConfig.component />}
        </div>
      </main>
    </div>
  );
}