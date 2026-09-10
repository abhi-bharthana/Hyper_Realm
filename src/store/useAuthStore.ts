import { create } from 'zustand';
import { createClient, Session, User } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  signInWithProvider: async (provider) => {
    // Tauri ke liye deep linking redirect uri zaroori hai
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'hyperrealm://auth-callback', // Custom Protocol for your app
      },
    });
    if (error) console.error("Login failed:", error);
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  }
}));

// Auto-listen to auth changes (App startup par chalana zaroori hai)
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({ 
    session, 
    user: session?.user || null,
    isLoading: false
  });
});