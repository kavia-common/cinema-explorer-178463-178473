import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * upsertProfileForUser
 * Ensures a 'profiles' row exists for the given Supabase user.
 * It will upsert by 'id' (primary key), setting email, full_name, avatar_url.
 * If the table is missing, it will not throw; instead it logs guidance to the console.
 */
export async function upsertProfileForUser(user) {
  const supabase = getSupabaseClient();
  if (!user || !user.id) return { error: null };

  const meta = user.user_metadata || {};
  const payload = {
    id: user.id,
    email: user.email || meta.email || null,
    full_name: meta.full_name || meta.name || user.email || null,
    avatar_url: meta.avatar_url || meta.picture || null,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      // If the table doesn't exist, Postgres error code is 42P01
      const code = error?.code || '';
      const msg = (error?.message || '').toLowerCase();
      if (code === '42P01' || msg.includes('relation') && msg.includes('does not exist')) {
        // eslint-disable-next-line no-console
        console.warn(
          `[profiles] The 'profiles' table does not exist. Create it using something like:

create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Optionally add RLS policies as needed.`
        );
        return { error: null };
      }
      // eslint-disable-next-line no-console
      console.warn('[profiles] Upsert failed:', error);
      return { error };
    }
    return { error: null };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[profiles] Upsert threw an error:', e);
    return { error: e };
  }
}

export default upsertProfileForUser;
