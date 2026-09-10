import { create } from 'zustand';

interface NodeState {
  nodeIp: string;
  isConnected: boolean;
  pingDelay: number;
  connectToNode: (ipAddress: string) => Promise<void>;
  autoDiscoverNode: () => void;
}

export const useNodeStore = create<NodeState>((set, get) => ({
  // Default to localhost for Desktop, but allows dynamic IP for Mobile
  nodeIp: 'http://127.0.0.1:8765', 
  isConnected: false,
  pingDelay: 0,

  connectToNode: async (ipAddress: string) => {
    try {
      const startTime = Date.now();
      // Rust server ke health endpoint par ping maarna
      const response = await fetch(`http://${ipAddress}:8765/health`);
      
      if (response.ok) {
        set({ 
          nodeIp: `http://${ipAddress}:8765`, 
          isConnected: true,
          pingDelay: Date.now() - startTime
        });
        console.log(`🔗 Successfully linked to Hyper Node at ${ipAddress}`);
      }
    } catch (error) {
      set({ isConnected: false });
      console.error("Failed to connect to Node");
    }
  },

  // Fallback scanner if IP changes
  autoDiscoverNode: () => {
    // Advanced feature: Yahan hum LAN par broadcast scan chala sakte hain
    // to find the Rust server automatically.
  }
}));