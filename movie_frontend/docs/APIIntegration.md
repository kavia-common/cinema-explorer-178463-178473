# TMDB API Integration (Frontend)

This app integrates with The Movie Database (TMDB) API directly from the React frontend to provide:
- Trending Movies (day/week)
- Title-based search
- Individual movie details

No backend or Supabase changes are required for this feature.

## Environment Setup

Create `movie_frontend/.env.local` from `.env.example` and add your TMDB key:

```
REACT_APP_TMDB_API_KEY=YOUR_TMDB_V4_READ_ACCESS_TOKEN_OR_V3_KEY
```

Do not hardcode the key in code; CRA exposes it via `process.env.REACT_APP_TMDB_API_KEY`.

## Authentication and Headers

We use the TMDB v4 Authorization header and also append `api_key` as a query parameter for compatibility with v3 endpoints:

- Header:
  - `Authorization: Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
  - `accept: application/json`
- Query parameter (compatibility):
  - `api_key=${process.env.REACT_APP_TMDB_API_KEY}`

This dual approach ensures the integration works whether you provide a v3 API key or a v4 read access token.

## Endpoints Used

Base: `https://api.themoviedb.org/3`

- Trending Movies:
  - GET `/trending/movie/day?language=en-US`
  - GET `/trending/movie/week?language=en-US`

- Search Movies by Title:
  - GET `/search/movie?query={title}&include_adult=false&language=en-US&page=1`

- Discover (when no search query):
  - GET `/discover/movie?sort_by=popularity.desc&include_adult=false&language=en-US&page=1`

- Movie Details:
  - GET `/movie/{movie_id}?language=en-US` (optionally `append_to_response=credits,images`)

Images:
- Poster URL pattern: `https://image.tmdb.org/t/p/{size}{poster_path}`
  - Example sizes: `w342`, `w500`

## Service Layer

- File: `src/services/tmdb.js`
- Config:
  - `TMDB_CONFIG = { BASE_URL, API_KEY, HEADERS: { accept, Authorization: 'Bearer ...' } }`
- Functions:
  - `fetchMovies({ query, page, language, include_adult, sort_by })` -> `{ data: Movie[], error }`
    - Uses `/search/movie` if `query` is provided; otherwise `/discover/movie` (sorted by popularity).
  - `fetchMovieDetails(movieId, { language, append_to_response })` -> `{ data: Movie | null, error }`
    - Retrieves detailed info for a single movie.
  - `getTrending(period = 'day')` -> `{ data: Movie[], error }`
    - Fetches trending movies for the given period.
  - `searchMovies(query)` -> `{ data: Movie[], error }`
    - Convenience wrapper delegating to `fetchMovies({ query })`.
  - `getPosterUrl(path, size = 'w342')` -> string
    - Returns a full image URL for a poster path.

Each function:
- Builds the request with both Authorization header and `api_key` query for maximum compatibility.
- Uses `fetch` with robust error handling.
- Parses JSON and returns `{ data, error }` with helpful messages.
- Handles network errors gracefully.

## UI Components

- `src/components/MovieCard.jsx`:
  - Reusable card displaying poster, title, release year, and rating (uses `getPosterUrl`).
- `src/components/TrendingMovies.jsx`:
  - Fetches trending on mount and renders a responsive grid with loading/error states (uses `getTrending`).
- `src/pages/SearchMovies.jsx`:
  - Search input + submit handler, results grid with loading/error states (uses `searchMovies`).

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
- The app preserves existing loading states and will display clear error messages if the API key is missing or a network error occurs.

## Troubleshooting

- If you see an error like "TMDB API key is not configured":
  - Ensure `REACT_APP_TMDB_API_KEY` is set in `movie_frontend/.env.local`
  - Restart the dev server to pick up new env vars.

- If images fail to load (404 or path is null):
  - The UI gracefully hides the broken image and shows a fallback "No Poster" label.
