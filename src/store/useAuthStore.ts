import { create } from 'zustand';
import { createClient, Session, User } from '@supabase/supabase-js';
import { invoke } from '@tauri-apps/api/core';

// Supabase Setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  connectedDevices: any[]; // Doosre devices ki list store karne ke liye
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  syncDeviceToCloud: (userId: string) => Promise<void>;
  fetchConnectedDevices: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  connectedDevices: [],

  signInWithProvider: async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'hyperrealm://auth-callback' },
    });
    if (error) console.error("Login failed:", error);
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, connectedDevices: [] });
  },

  // 🔥 THE MAGIC FUNCTION: Push Local Device to Cloud
  syncDeviceToCloud: async (userId) => {
    try {
      // 1. Rust se Local Hardware Info nikalna
      const sysInfo: any = await invoke('get_system_info');
      
      // 2. Supabase mein device ko register ya update karna
      const { error } = await supabase
        .from('connected_devices')
        .upsert({
          user_id: userId,
          device_name: sysInfo.host_name, // e.g., "Abhi-PC"
          device_type: sysInfo.os_name.includes('Windows') ? 'Desktop' : 'Mobile',
          os_info: `${sysInfo.os_name} ${sysInfo.os_version}`,
          node_location: 'Dehradun Node', // Ise baad mein dynamic Geo-IP se replace kar denge
          last_active: new Date().toISOString()
        }, { onConflict: 'user_id,device_name' }); // Agar pehle se hai toh update karo

      if (error) throw error;
      
      // 3. Update hone ke baad saare connected devices ki list fetch kar lo
      get().fetchConnectedDevices(userId);
    } catch (err) {
      console.error("Device sync failed:", err);
    }
  },

  // Doosre active devices ki list laane ke liye
  fetchConnectedDevices: async (userId) => {
    const { data, error } = await supabase
      .from('connected_devices')
      .select('*')
      .eq('user_id', userId)
      .order('last_active', { ascending: false });
      
    if (!error && data) {
      set({ connectedDevices: data });
    }
  }
}));

// 🔥 GLOBAL LISTENER: Jaise hi auth state change hogi, device sync ho jayega
supabase.auth.onAuthStateChange((_event, session) => {
  const user = session?.user || null;
  
  useAuthStore.setState({ 
    session, 
    user,
    isLoading: false
  });

  // Agar user successfully login ho gaya hai, toh background mein device sync chala do
  if (user && _event === 'SIGNED_IN') {
    useAuthStore.getState().syncDeviceToCloud(user.id);
  }
});