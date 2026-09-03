import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window'; 
import Sidebar from './components/Sidebar';
import Home from './components/home/Home';
import Dashboard from './components/Dashboard';
import { Applications } from './components/Applications';
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
import HyperLinkView from './components/hyperlink/HyperLinkView'; 
import { useAppStore } from './store/useAppStore';
import { RecorderApp } from './components/APP/recorder/RecorderApp';

export default function App() {
  const { 
    environmentName, theme, activeTab, setActiveTab, setAppIdle, 
    homeBackgroundType, homeBackgroundValue,
    // === NAYE STATES IMPORT KIYE ===
    globalFontFamily, uiScale, textScale, isEyeCareEnabled, eyeCareIntensity 
  } = useAppStore();

  // 1. Process Lifecycle Listener
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

  // 2. TIGHT THEME CONTROLLER (Live OS Sync)
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

    // Live listener for OS theme switch
    const handleSystemThemeChange = () => {
      if (useAppStore.getState().theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  // 3. Fullscreen Keybinds
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

  const getHeaderDescription = () => {
    switch (activeTab) {
      case 'Applications': return "Select an environment module to launch into isolated space.";
      case 'Hyper-Surf': return "Native isolated web browsing environment.";
      case 'Hyper-Media': return "System video directory scanner and playback unit."; 
      case 'Music': return "Native modular audio playback and library management."; 
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
  const isAppView = ['Hyper-Surf', 'Hyper-Media', 'Music', 'AI Recorder'].includes(activeTab);
  const isFullscreenView = isHome || isAppView;
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
{/* ======= TIGHT UI SCALING & FONT ENGINE ======= */}
      <style>{`
        :root {
          /* UI Scale directly controls 1rem base (Boxes, Layouts, Toggles only) */
          font-size: ${14 * uiScale}px !important; 
          font-family: ${globalFontFamily};
        }
        
        /* 
           FIXED TEXT ENGINE: 
           Yeh sirf text classes ko target karega aur unhe 'rem' mein output dega.
           Isse Text Slider sirf font badhayega, aur Toggles untouched rahenge!
        */
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
        
        /* Fallback for standard Tailwind classes */
        .text-xs { font-size: calc(0.75rem * ${textScale}) !important; }
        .text-sm { font-size: calc(0.875rem * ${textScale}) !important; }
        .text-base { font-size: calc(1rem * ${textScale}) !important; }
        .text-lg { font-size: calc(1.125rem * ${textScale}) !important; }
      `}</style>      {/* ================================================= */}

      {/* ======= EYE CARE BLUELIGHT FILTER ======= */}
      {isEyeCareEnabled && (
        <div 
          className="fixed inset-0 z-[99999] pointer-events-none mix-blend-multiply transition-opacity duration-700"
          style={{ 
            backgroundColor: '#ff8c00', // Warm amber/orange
            opacity: eyeCareIntensity / 100 
          }}
        />
      )}
      {/* ========================================= */}

      <GlobalAudioEngine />
      
      {!showCustomBg && !isAppView && (
        <>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-300/40 dark:bg-zinc-800/10 blur-[140px] rounded-full pointer-events-none -z-10 transition-opacity duration-700" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-slate-300/40 dark:bg-neutral-800/10 blur-[140px] rounded-full pointer-events-none -z-10 transition-opacity duration-700" />
        </>
      )}
      
      <Sidebar />
      
      {/* Fixed root padding with fallback scaling */}
      <main className={`flex-1 h-full flex flex-col overflow-hidden z-10 ${isFullscreenView ? 'p-0' : 'p-[1.5em] gap-[1em]'}`}>
        
        {!isFullscreenView && activeTab !== 'Node Settings' && (
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
          {isHome && <Home />}
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Applications' && <Applications />}
          {activeTab === 'Hyper-Surf' && <HyperSurf />}
          {activeTab === 'Hyper-Link' && <HyperLinkView />} 
          {activeTab === 'Widgets Core' && <WidgetsCore />}
          {activeTab === 'Hyper-Media' && <VideoPlayer />}
          {activeTab === 'AI Recorder' && <RecorderApp />}
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