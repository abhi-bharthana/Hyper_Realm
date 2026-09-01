import { create } from 'zustand';

interface CloudState {
  isRunning: boolean;
  tunnelUrl: string | null;
  localUrl: string;
  // Yeh function Hyper-Link ko sahi node dega
  getActiveNode: () => string; 
  setIsRunning: (status: boolean) => void;
  setTunnelUrl: (url: string | null) => void;
}

export const useCloudStore = create<CloudState>((set, get) => ({
  isRunning: false,
  tunnelUrl: null,
  localUrl: 'http://127.0.0.1:8765', // Local Node fallback
  
  // Logic: Agar cloud chal raha hai toh global node do, warna local node do
  getActiveNode: () => {
    const state = get();
    return state.isRunning && state.tunnelUrl ? state.tunnelUrl : state.localUrl;
  },

  setIsRunning: (status) => set({ isRunning: status }),
  setTunnelUrl: (url) => set({ tunnelUrl: url }),
}));