# Supabase Google Sign-In Setup (Frontend)

This app integrates Google Sign-In using Supabase Auth and displays user info in the header. It also upserts a `profiles` row on first login.

## Prerequisites

- Supabase project (URL + anon public key)
- Google provider enabled in Supabase Dashboard

## 1) Configure Environment Variables

Create `movie_frontend/.env.local` from `.env.example` and set:

```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_KEY=YOUR_PUBLIC_ANON_KEY
REACT_APP_TMDB_API_KEY=YOUR_TMDB_V4_READ_ACCESS_TOKEN_OR_V3_KEY
REACT_APP_SITE_URL=http://localhost:3000
```

Notes:
- `REACT_APP_SITE_URL` is used to build `redirectTo` during auth (e.g., `http://localhost:3000/auth/callback`).

## 2) Enable Google Provider in Supabase

In your Supabase project:

1. Go to Authentication → Providers
2. Enable Google
3. Fill in your Google OAuth credentials (Client ID/Secret)
4. Set the Redirect URL to:
   - `http://localhost:3000/auth/callback` (development)

If you deploy, add your production URL (e.g., `https://your-domain.com/auth/callback`) as a redirect URL.

## 3) OAuth Flow

- The Header shows "Sign in with Google" when logged out.
- Clicking it initiates `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })`.
- After Google consent, Supabase redirects to `/auth/callback`.
- `AuthCallback.jsx` calls `supabase.auth.exchangeCodeForSession(window.location.href)` to establish a session, then redirects to `/`.

The session persists across refreshes via `@supabase/supabase-js` with `persistSession: true`.

## 4) Profiles Table Upsert

On first authenticated session, the app upserts a row in `public.profiles`:

Columns used:
- `id` (uuid, PK) — from `auth.user.id`
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `updated_at` (timestamptz, recommended)

Example SQL:

```sql
create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);
```

If the table is missing, the app logs guidance to the console but does not crash.

## 5) Protected Actions

- Example: "Save to Favorites" button appears on movie cards.
- It is disabled until the user signs in.
- This demonstrates gating interactions behind auth without implementing backend storage.

## 6) Troubleshooting

- If you see "Supabase not configured" or env errors:
  - Ensure `.env.local` contains `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_KEY`, and restart the dev server.
- If Google redirect fails:
  - Verify the Redirect URL in Supabase matches `http://localhost:3000/auth/callback`.
  - Ensure `REACT_APP_SITE_URL` is set correctly.

No backend changes are required for this feature.
