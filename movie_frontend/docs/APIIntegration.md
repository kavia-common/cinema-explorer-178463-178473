# TMDB API Integration (Frontend)

This app integrates with The Movie Database (TMDB) API directly from the React frontend to provide:
- Trending Movies (day/week)
- Title-based search

No backend or Supabase changes are required for this feature.

## Environment Setup

Create `movie_frontend/.env.local` from `.env.example` and add your TMDB API key:

```
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY
```

Do not hardcode the key in code; CRA exposes it via `process.env.REACT_APP_TMDB_API_KEY`.

## Endpoints Used

Base: `https://api.themoviedb.org/3`

- Trending Movies:
  - GET `/trending/movie/day?language=en-US&api_key=...`
  - GET `/trending/movie/week?language=en-US&api_key=...`

- Search Movies by Title:
  - GET `/search/movie?query={title}&include_adult=false&language=en-US&page=1&api_key=...`

Images:
- Poster URL pattern: `https://image.tmdb.org/t/p/{size}{poster_path}`
  - Example sizes: `w342`, `w500`

## Service Layer

- File: `src/services/tmdb.js`
- Functions:
  - `searchMovies(query)` -> `{ data: Movie[], error }`
  - `getTrending(period = 'day')` -> `{ data: Movie[], error }`
  - `getPosterUrl(path, size = 'w342')` -> string

Each function:
- Builds the request with the API key from env.
- Uses `fetch` with proper query params.
- Parses JSON and returns `{ data, error }` with helpful messages.
- Handles network errors gracefully.

## UI Components

- `src/components/MovieCard.jsx`:
  - Reusable card displaying poster, title, release year, and rating.
- `src/components/TrendingMovies.jsx`:
  - Fetches trending on mount and renders a responsive grid with loading/error states.
- `src/pages/SearchMovies.jsx`:
  - Search input + submit handler, results grid with loading/error states.

Styling uses the established Tailwind "Royal Purple" theme.

## Routing

A minimal hash-based router is used:
- Home: `#/` shows the welcome hero and the Trending section (TMDB data).
- Search: `#/search` shows the search UI.

Links are available in the Header.

## Rate Limiting and Usage Notes

- TMDB imposes rate limits; avoid aggressive polling.
- Debounce search input in future enhancements to reduce requests.
- Always handle `error` returned from service methods to show clear user messages.

## Troubleshooting

- If you see an error like "TMDB API key is not configured":
  - Ensure `REACT_APP_TMDB_API_KEY` is set in `movie_frontend/.env.local`
  - Restart the dev server to pick up new env vars.

- If images fail to load (404 or path is null):
  - The UI gracefully hides the broken image and shows a fallback "No Poster" label.
