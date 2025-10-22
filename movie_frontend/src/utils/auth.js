import { getSupabaseClient } from '../lib/supabaseClient';
import { getURL } from './getURL';

export const signUp = async (email, password) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getURL()}auth/callback`,
    },
  });
  return { data, error };
};

export const resetPassword = async (email) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}auth/reset-password`,
  });
  return { data, error };
};

export const signInWithMagicLink = async (email) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getURL()}auth/callback`,
    },
  });
  return { data, error };
};

export const signInWithOAuth = async (provider) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  });
  return { data, error };
};

export const handleAuthError = (error) => {
  if (!error) return;
  // Minimal handler for CRA (no router by default)
  // You can extend with react-router to navigate to dedicated error pages.
  // eslint-disable-next-line no-console
  console.error('Authentication error:', error);

  if (typeof window !== 'undefined') {
    if (String(error.message || '').toLowerCase().includes('redirect')) {
      window.location.replace('/auth/error?type=redirect');
    } else if (String(error.message || '').toLowerCase().includes('email')) {
      window.location.replace('/auth/error?type=email');
    } else {
      window.location.replace('/auth/error');
    }
  }
};
