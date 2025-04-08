'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

interface AuthContextType {
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        setIsAdmin(session?.user?.email === adminEmail);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      try {
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false);
        } else {
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          setIsAdmin(session?.user?.email === adminEmail);
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
        setIsAdmin(false);
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
