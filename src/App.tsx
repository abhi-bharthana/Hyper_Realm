import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window'; 
import Sidebar from './components/Sidebar';
import Home from './components/home/Home';
import Dashboard from './components/Dashboard';
import Applications from './components/Applications';
import HyperSurf from './components/APP/HyperSurf';
import VideoPlayer from './components/APP/VideoPlayer'; 
import MusicApp from './components/APP/music/MusicApp'; 
import GlobalAudioEngine from './components/APP/music/GlobalAudioEngine';
import Processes from './components/Processes';
import Battery from './components/Battery';
import Services from './components/Services';
import Libraries from './components/Libraries';
import Profile from './components/Profile';
import Settings from './components/Settings';
import WidgetsCore from './components/WidgetsCore';
import HyperLinkView from './components/hyperlink/HyperLinkView'; // <-- Added import
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { 
    environmentName, theme, activeTab, setActiveTab, setAppIdle, uiDensity,
    homeBackgroundType, homeBackgroundValue 
  } = useAppStore();

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
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
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
          console.error("Fullscreen API block ho gaya. Permissions check karo:", error);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getHeaderDescription = () => {
    switch (activeTab) {
      case 'Applications': return "Select an environment module to launch into isolated space.";
      case 'Hyper-Surf': return "Native isolated web browsing environment.";
      case 'Hyper-Media': return "System video directory scanner and playback unit."; 
      case 'Music': return "Native modular audio playback and library management."; 
      case 'Widgets Core': return "Granular telemetry and standalone module orchestration.";
      case 'Hyper-Link': return "Seamless connectivity, global cloud tunnels, and local network bridges."; // <-- Added Hyper-Link Header
      case 'Processes': return "Live system metrics and resource consumption.";
      case 'Battery': return "Power draw and ARM64 efficiency node status.";
      case 'Dashboard': return "System core overview and analytics.";
      case 'Profile': return "Manage identity and view hardware specifications.";
      case 'Node Settings': return "Configuration and workspace management.";
      default: return "System workspace configuration.";
    }
  };

  const getDensityClass = () => {
    switch (uiDensity) {
      case 'ultra': return 'p-2 md:p-3 gap-2';
      case 'compact': return 'p-3 md:p-4 gap-2.5';
      case 'spacious': return 'p-6 md:p-8 gap-5';
      default: return 'p-4 md:p-6 gap-3.5';
    }
  };

  const isHome = activeTab === 'Home';
  const isAppView = ['Hyper-Surf', 'Hyper-Media', 'Music'].includes(activeTab);
  const isFullscreenView = isHome || isAppView;
  
  const showCustomBg = isHome && homeBackgroundType !== 'default';

  const getRootPaddingClass = () => {
    switch (uiDensity) {
      case 'ultra': return 'p-2 gap-2';
      case 'compact': return 'p-2.5 gap-2.5';
      case 'spacious': return 'p-4 gap-4';
      default: return 'p-3 gap-3';
    }
  };

  return (
    <div 
      className={`h-screen w-screen overflow-hidden flex relative font-sans selection:bg-blue-500/30 transition-all duration-700 ease-in-out ${
        showCustomBg ? 'text-white' : 'bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-100'
      } ${getRootPaddingClass()}`}
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
      <GlobalAudioEngine />
      
      {!showCustomBg && !isAppView && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-300/40 dark:bg-zinc-800/10 blur-[140px] rounded-full pointer-events-none -z-10 transition-opacity duration-700" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-slate-300/40 dark:bg-neutral-800/10 blur-[140px] rounded-full pointer-events-none -z-10 transition-opacity duration-700" />
        </>
      )}
      
      <Sidebar />
      
      <main className={`flex-1 h-full flex flex-col overflow-hidden z-10 ${isFullscreenView ? 'p-0' : getDensityClass()}`}>
        
        {!isFullscreenView && activeTab !== 'Node Settings' && (
          <header className="flex-shrink-0 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-0.5">
              {activeTab === 'Dashboard' ? environmentName : activeTab}
            </h2>
            <p className="opacity-60 text-xs md:text-sm font-medium">
              {getHeaderDescription()}
            </p>
          </header>
        )}
        
        <div className={`flex-1 w-full h-full custom-scrollbar ${isFullscreenView ? 'overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl' : 'overflow-y-auto pb-2 pr-1'}`}>
          {isHome && <Home />}
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Applications' && <Applications />}
          {activeTab === 'Hyper-Surf' && <HyperSurf />}
          {activeTab === 'Hyper-Link' && <HyperLinkView />} {/* <-- Added render component */}
          {activeTab === 'Widgets Core' && <WidgetsCore />}
          {activeTab === 'Hyper-Media' && <VideoPlayer />}
          {activeTab === 'Music' && <MusicApp />} 
          {activeTab === 'Processes' && <Processes />}
          {activeTab === 'Battery' && <Battery />}
          {activeTab === 'Services/Nodes' && <Services />}
          {activeTab === 'Libraries/Packages' && <Libraries />}
          {activeTab === 'Profile' && <Profile />}
          {activeTab === 'Node Settings' && <Settings />}
        </div>
      </main>
    </div>
  );
}