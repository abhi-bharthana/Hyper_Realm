import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { invoke } from '@tauri-apps/api/core';
import { SystemApp } from '../types';

export interface SystemAppExtended extends Omit<SystemApp, 'status'> {
  status: 'idle' | 'running' | 'error';
  mode: 'efficient' | 'balanced' | 'performance';
  pid?: number;
}

const initialApps: SystemAppExtended[] = [
  {
    id: 'calc-test',
    name: 'System Calculator',
    description: 'Native Windows OS Tool for testing IPC bridge',
    icon: 'Activity',
    executable_path: 'C:/Windows/System32/calc.exe',
    status: 'idle',
    mode: 'balanced'
  },
  {
    id: 'hyper-surf',
    name: 'Hyper-Surf',
    description: 'Native isolated web browsing environment with advanced controls.',
    icon: 'Globe',
    executable_path: 'internal://hyper-surf',
    status: 'idle',
    mode: 'balanced'
  },
  {
    id: 'hyper-media',
    name: 'Hyper-Media',
    description: 'High-performance local and stream video playback unit.',
    icon: 'Film',
    executable_path: 'internal://hyper-media',
    status: 'idle',
    mode: 'balanced'
  },
  {
    id: 'hyper-music',
    name: 'Music',
    description: 'Native modular audio playback and library management.',
    icon: 'Music',
    executable_path: 'internal://hyper-music',
    status: 'idle',
    mode: 'balanced'
  }
];

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

      // LIFECYCLE FIX: launchApp ab internal apps ko 'running' set karega
      launchApp: async (id) => {
        const appToLaunch = get().apps.find(a => a.id === id);
        if (!appToLaunch) return;

        // Har app launch hone par turant running mark ho jayegi
        set((state) => ({ 
          apps: state.apps.map(app => app.id === id ? { ...app, status: 'running', mode: 'balanced' } : app) 
        }));

        if (id === 'hyper-surf') {
          set({ activeTab: 'Hyper-Surf' });
          return;
        }
        if (id === 'hyper-media') {
          set({ activeTab: 'Hyper-Media' });
          return;
        }
        if (id === 'hyper-music') {
          set({ activeTab: 'Music' });
          return;
        }

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

      // LIFECYCLE FIX: closeApp ab current active screen check karega
      closeApp: (id) => {
        const { activeTab } = get();
        // Agar jo app band kar rahe hain, wohi currently display ho rahi hai, toh screen waapas Applications menu pe le jao
        if ((id === 'hyper-surf' && activeTab === 'Hyper-Surf') || 
            (id === 'hyper-media' && activeTab === 'Hyper-Media') || 
            (id === 'hyper-music' && activeTab === 'Music')) {
           set({ activeTab: 'Applications' }); 
        }
        // App ko completely idle mark karo
        get().setAppIdle(id);
      },

      setAppIdle: (id) => set((state) => ({ apps: state.apps.map(app => app.id === id ? { ...app, status: 'idle', pid: undefined, mode: 'balanced' } : app) }))
    }),
    { name: 'hyper-realm-storage-v72' } // Bumped version to reset local storage caches
  )
);