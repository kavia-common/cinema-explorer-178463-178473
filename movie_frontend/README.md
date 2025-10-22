# MovieAI Frontend (CRA + Tailwind + Supabase)

A lightweight React app styled with TailwindCSS using the "Royal Purple" theme, now integrated with Supabase for a simple Movies CRUD and real-time updates.

## Quick Start
- Install dependencies: `npm install`
- Start dev server: `npm start`
- Run tests: `npm test`
- Build: `npm run build`

## Environment Variables (CRA)
Create a `.env.local` file in `movie_frontend/` based on `.env.example`:
```
REACT_APP_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_KEY=YOUR_PUBLIC_ANON_KEY
```
Do not hardcode credentials in code. The app reads these via `process.env`.

## Supabase Setup
- Create a project in Supabase and obtain your Project URL and anon public key.
- Create a table named `movies` (example schema):
  ```
  -- Enable extensions if necessary
  -- create extension if not exists "uuid-ossp";

  create table if not exists public.movies (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    overview text null,
    poster_url text null,
    created_at timestamptz not null default now()
  );
  ```
- Realtime: Ensure Realtime is enabled for the `movies` table (under Database > Replication).

## Features
- Add a movie (title, overview optional, poster URL optional)
- List movies ordered by newest first
- Inline edit of movie title
- Delete movie
- Real-time updates (insert/update/delete) without manual refresh

## TailwindCSS
Configured via:
- `tailwind.config.js` (Royal Purple palette)
- `postcss.config.js`
- `src/index.css` includes `@tailwind base; @tailwind components; @tailwind utilities;`

Theme colors:
- primary: `#8B5CF6`
- secondary: `#6B7280`
- background: `#F3E8FF`
- text: `#374151`

## Homepage
- Header and Footer visible
- Welcome hero: "Welcome to MovieAI"
- Placeholder cards: "Featured", "Trending Movies"
- "Trending Movies" placeholder section grid
- "My Movies (Supabase)" section with Add form and Movies list

## Notes
- The app will render even if env variables are not set, but Supabase features will show warnings/errors in the console until configured.
- Running preview is available on port 3000 by default for CRA.
