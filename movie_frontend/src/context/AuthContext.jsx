import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';
import { getURL } from '../utils/getURL';
import { upsertProfileForUser } from '../utils/profile';

/**
 * AuthContext provides auth state (session, user, loading) and actions.
 */
const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides authentication context using Supabase. Subscribes to auth state changes,
 * persists session across refresh, and upserts a row into the 'profiles' table on first login.
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep track of which user profile we attempted to upsert to avoid duplicate calls
  const upsertedForUserIdRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to get initial session:', error);
        }
        if (!mounted) return;
        const currentSession = data?.session ?? null;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Upsert profile on initial load if we have a session
        if (currentSession?.user?.id && upsertedForUserIdRef.current !== currentSession.user.id) {
          upsertedForUserIdRef.current = currentSession.user.id;
          try {
            await upsertProfileForUser(currentSession.user);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('Profile upsert skipped due to error:', e?.message || e);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth bootstrap error:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    bootstrap();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user?.id && upsertedForUserIdRef.current !== newSession.user.id) {
        upsertedForUserIdRef.current = newSession.user.id;
        try {
          await upsertProfileForUser(newSession.user);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('Profile upsert skipped due to error:', e?.message || e);
        }
      }

      if (!newSession?.user) {
        upsertedForUserIdRef.current = null;
      }
    });

    return () => {
      mounted = false;
      try {
        subscription?.subscription?.unsubscribe?.();
      } catch (_) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const signInWithGoogle = async () => {
    try {
      const redirectTo = `${getURL()}auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Google sign-in failed:', error);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Google sign-in threw error:', e);
    }
  };

  // PUBLIC_INTERFACE
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Sign out failed:', error);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Sign out error:', e);
    }
  };

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication state and actions from AuthContext.
 */
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
