import { useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';

export default function AuthCallback() {
  useEffect(() => {
    const fn = async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) {
          // eslint-disable-next-line no-console
          console.error('Supabase not configured');
          window.location.replace('/');
          return;
        }

        // Supabase JS v2: exchange code for session from current URL
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Auth callback error:', error);
          window.location.replace('/auth/error');
          return;
        }

        if (data?.session) {
          window.location.replace('/'); // Redirect to home or dashboard
        } else {
          window.location.replace('/');
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Auth callback processing failed:', e);
        window.location.replace('/auth/error');
      }
    };

    fn();
  }, []);

  return <div style={{ padding: 24 }}>Processing authentication...</div>;
}
