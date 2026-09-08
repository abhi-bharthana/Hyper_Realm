import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  isVisible: boolean;
  isFixed?: boolean;
}

interface SidebarStore {
  items: SidebarItem[];
  isSidebarCollapsed: boolean;
  isSidebarAutoHide: boolean;
  
  toggleVisibility: (id: string) => void;
  resetToDefault: () => void;
  toggleSidebar: () => void;
  setSidebarAutoHide: (autoHide: boolean) => void;
}

const defaultItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: 'Dashboard', iconName: 'Dashboard', isVisible: true },
  { id: 'apps', label: 'Applications', path: 'Applications', iconName: 'AppWindow', isVisible: true },
  { id: 'hyper-link', label: 'Hyper-Link', path: 'Hyper-Link', iconName: 'Link', isVisible: true },
  { id: 'hyper-surf', label: 'Hyper-Surf', path: 'Hyper-Surf', iconName: 'Globe', isVisible: true },
  { id: 'widgets', label: 'Widgets Core', path: 'Widgets Core', iconName: 'Layers', isVisible: true },
  { id: 'processes', label: 'Processes', path: 'Processes', iconName: 'Activity', isVisible: true },
  { id: 'battery', label: 'Battery', path: 'Battery', iconName: 'BatteryMedium', isVisible: true },
  { id: 'music', label: 'Music Studio', path: 'Music', iconName: 'Music', isVisible: true },
  { id: 'media', label: 'Video Player', path: 'Hyper-Media', iconName: 'Video', isVisible: false },
  { id: 'recorder', label: 'AI Recorder', path: 'AI Recorder', iconName: 'Mic', isVisible: false },
  { id: 'servicenodes', label: 'Services/Nodes', path: 'Services/Nodes', iconName: 'Server', isVisible: true },
  { id: 'libraries', label: 'Libraries', path: 'Libraries/Packages', iconName: 'Package', isVisible: true },
  { id: 'profile', label: 'Profile', path: 'Profile', iconName: 'UserCircle', isVisible: true },
];

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      items: defaultItems,
      isSidebarCollapsed: false,
      isSidebarAutoHide: false,
      
      toggleVisibility: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && !item.isFixed 
              ? { ...item, isVisible: !item.isVisible } 
              : item
          ),
        })),
        
      resetToDefault: () => set({ items: defaultItems }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarAutoHide: (isSidebarAutoHide) => set({ isSidebarAutoHide }),
    }),
    { 
      name: 'hyper-sidebar-storage-v5' 
    }
  )
);