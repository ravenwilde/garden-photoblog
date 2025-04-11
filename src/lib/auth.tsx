'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from './supabase/client';
import { getCsrfToken } from './csrf-client';

interface AuthContextType {
  isAdmin: boolean;
  userEmail: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const defaultContext: AuthContextType = {
  isAdmin: false,
  userEmail: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setUserEmail(user?.email || null);
        setIsAdmin(user?.email === adminEmail);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAdmin(false);
        setUserEmail(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAuth();

    // Subscribe to auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      try {
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
          setUserEmail(null);
        } else {
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          setUserEmail(session?.user?.email || null);
          setIsAdmin(session?.user?.email === adminEmail);
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
        setIsAdmin(false);
        setUserEmail(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Expose loading state for components to handle loading states
  useEffect(() => {
    if (!loading) {
      // Force a re-render of all components using auth context when loading changes
      window.dispatchEvent(new Event('auth-state-change'));
    }
  }, [loading, isAdmin]);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      const token = await getCsrfToken();
      await fetch('/api/auth/clear-session', {
        method: 'POST',
        headers: {
          'x-csrf-token': token
        }
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isAdmin,
    userEmail,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
