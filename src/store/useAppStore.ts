import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { invoke } from '@tauri-apps/api/core';
import { SystemApp } from '../types';
import { CORE_APPS } from '../components/APP/appRegistry';
import { SYSTEM_SERVICES } from '../components/services/serviceRegistry';

export interface SystemAppExtended extends Omit<SystemApp, 'status'> {
  status: 'idle' | 'running' | 'error';
  mode: 'efficient' | 'balanced' | 'performance';
  pid?: number;
}

const initialApps: SystemAppExtended[] = [...CORE_APPS, ...SYSTEM_SERVICES];

interface AppState {
  environmentName: string;
  apps: SystemAppExtended[];
  theme: 'light' | 'dark' | 'system';
  activeTab: string;
  uiDensity: 'ultra' | 'compact' | 'normal' | 'spacious';
  isSidebarCollapsed: boolean;
  userName: string;
  userTitle: string;
  userAvatar: string;
  
  homeShowClock: boolean;
  homeClockSize: 'small' | 'medium' | 'large';
  homeClockPosition: 'top' | 'center' | 'bottom';
  homeBackgroundType: 'default' | 'solid' | 'gradient' | 'image';
  homeBackgroundValue: string;
  showMusicWidget: boolean;

  appIconSize: 'small' | 'medium' | 'large';
  appGridSpacing: 'tight' | 'normal' | 'relaxed';
  showAppNames: boolean;
  isSidebarAutoHide: boolean;

  // ==== NAYE UI ENGINE STATES ====
  globalFontFamily: string;
  uiScale: number;      // 0.8 to 1.5 (Controls boxes/buttons)
  textScale: number;    // 0.8 to 1.5 (Controls fonts)
  isEyeCareEnabled: boolean;
  eyeCareIntensity: number; // 0 to 100
  
  setUiDensity: (density: 'ultra' | 'compact' | 'normal' | 'spacious') => void;
  toggleSidebar: () => void;
  updateProfile: (name: string, title: string) => void;
  updateAvatar: (avatarDataUrl: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setActiveTab: (tab: string) => void;
  launchApp: (id: string) => Promise<void>;
  closeApp: (id: string) => void;
  setAppIdle: (id: string) => void;
  setAppMode: (id: string, mode: 'efficient' | 'balanced' | 'performance') => Promise<void>;
  
  setHomeShowClock: (show: boolean) => void;
  setHomeClockSize: (size: 'small' | 'medium' | 'large') => void;
  setHomeClockPosition: (position: 'top' | 'center' | 'bottom') => void;
  setHomeBackground: (type: 'default' | 'solid' | 'gradient' | 'image', value: string) => void;
  setShowMusicWidget: (show: boolean) => void;
  setAppIconSize: (size: 'small' | 'medium' | 'large') => void;
  setAppGridSpacing: (spacing: 'tight' | 'normal' | 'relaxed') => void;
  setShowAppNames: (show: boolean) => void;
  setSidebarAutoHide: (autoHide: boolean) => void;

  // ==== NAYE SETTERS ====
  setGlobalFontFamily: (font: string) => void;
  setUiScale: (scale: number) => void;
  setTextScale: (scale: number) => void;
  toggleEyeCare: () => void;
  setEyeCareIntensity: (intensity: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      environmentName: 'Dehradun Node 01',
      apps: initialApps,
      theme: 'system',
      activeTab: 'Home',
      uiDensity: 'normal',
      isSidebarCollapsed: false,
      userName: 'Hyper User',
      userTitle: 'Node Administrator',
      userAvatar: '',
      
      homeShowClock: true,
      homeClockSize: 'medium',
      homeClockPosition: 'center',
      homeBackgroundType: 'default',
      homeBackgroundValue: '',
      showMusicWidget: true, 

      appIconSize: 'medium',
      appGridSpacing: 'normal',
      showAppNames: true,
      isSidebarAutoHide: false, 

      // ==== DEFAULT UI ENGINE VALUES ====
      globalFontFamily: 'sans-serif',
      uiScale: 1, 
      textScale: 1,
      isEyeCareEnabled: false,
      eyeCareIntensity: 30,
      
      setUiDensity: (uiDensity) => set({ uiDensity }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      updateProfile: (userName, userTitle) => set({ userName, userTitle }),
      updateAvatar: (userAvatar) => set({ userAvatar }),
      setTheme: (theme) => set({ theme }),
      setActiveTab: (activeTab) => set({ activeTab }),
      
      setHomeShowClock: (homeShowClock) => set({ homeShowClock }),
      setHomeClockSize: (homeClockSize) => set({ homeClockSize }),
      setHomeClockPosition: (homeClockPosition) => set({ homeClockPosition }),
      setHomeBackground: (homeBackgroundType, homeBackgroundValue) => set({ homeBackgroundType, homeBackgroundValue }),
      setShowMusicWidget: (showMusicWidget) => set({ showMusicWidget }),

      setAppIconSize: (appIconSize) => set({ appIconSize }),
      setAppGridSpacing: (appGridSpacing) => set({ appGridSpacing }),
      setShowAppNames: (showAppNames) => set({ showAppNames }),
      setSidebarAutoHide: (isSidebarAutoHide) => set({ isSidebarAutoHide }),

      // ==== NEW SETTERS CONFIG ====
      setGlobalFontFamily: (globalFontFamily) => set({ globalFontFamily }),
      setUiScale: (uiScale) => set({ uiScale }),
      setTextScale: (textScale) => set({ textScale }),
      toggleEyeCare: () => set((state) => ({ isEyeCareEnabled: !state.isEyeCareEnabled })),
      setEyeCareIntensity: (eyeCareIntensity) => set({ eyeCareIntensity }),

      launchApp: async (id) => {
        // 🚀 ROUTE CHECKS PLACED AT THE TOP (Fixed blockage bug)
        if (id === 'hyper-surf') { set({ activeTab: 'Hyper-Surf' }); return; }
        if (id === 'hyper-media') { set({ activeTab: 'Hyper-Media' }); return; }
        if (id === 'hyper-music') { set({ activeTab: 'Music' }); return; }
        if (id === 'hyper-recorder') { set({ activeTab: 'AI Recorder' }); return; }

        const appToLaunch = get().apps.find(a => a.id === id);
        if (!appToLaunch) return;
        
        set((state) => ({ apps: state.apps.map(app => app.id === id ? { ...app, status: 'running', mode: 'balanced' } : app) }));

        try {
          const response: string = await invoke('launch_executable', { id: appToLaunch.id, path: appToLaunch.executable_path });
          const pidMatch = response.match(/PID: (\d+)/);
          const pid = pidMatch ? parseInt(pidMatch[1], 10) : undefined;
          set((state) => ({ apps: state.apps.map(app => app.id === id ? { ...app, pid } : app) }));
        } catch (error) { console.error("Launch Error:", error); }
      },
      
      setAppMode: async (id, mode) => {
        const app = get().apps.find(a => a.id === id);
        if (!app || !app.pid) return;
        try {
          await invoke('set_process_mode', { pid: app.pid, mode });
          set((state) => ({ apps: state.apps.map(a => a.id === id ? { ...a, mode } : a) }));
        } catch (error) { console.error("Mode Change Error:", error); }
      },

      closeApp: (id) => {
        const { activeTab } = get();
        if ((id === 'hyper-surf' && activeTab === 'Hyper-Surf') || 
            (id === 'hyper-media' && activeTab === 'Hyper-Media') || 
            (id === 'hyper-music' && activeTab === 'Music') ||
            (id === 'hyper-recorder' && activeTab === 'AI Recorder')) {
           set({ activeTab: 'Applications' }); 
        }
        get().setAppIdle(id);
      },

      setAppIdle: (id) => set((state) => ({ apps: state.apps.map(app => app.id === id ? { ...app, status: 'idle', pid: undefined, mode: 'balanced' } : app) }))
    }),
    { name: 'hyper-realm-storage-v76' } 
  )
);