const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.REACT_APP_TMDB_API_KEY || '', // CRA env var
  HEADERS: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY || ''}`,
  },
};

/**
 * Build a full URL given a path and query params.
 * For maximum compatibility, we append the api_key as a query param as well,
 * while also using the Authorization: Bearer header (TMDB v4).
 */
function buildUrl(path, params = {}, includeApiKey = true) {
  const url = new URL(`${TMDB_CONFIG.BASE_URL}${path}`);
  const qp = { ...(params || {}) };
  if (includeApiKey && TMDB_CONFIG.API_KEY) {
    // Append for v3 compatibility; v4 uses Authorization header.
    qp.api_key = TMDB_CONFIG.API_KEY;
  }
  Object.entries(qp).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

/**
 * Execute a GET request with robust error handling.
 * Returns: { data: any, error: { status: number, message: string, details?: any } | null }
 */
async function get(path, params = {}) {
  if (!TMDB_CONFIG.API_KEY) {
    return {
      data: null,
      error: {
        status: 400,
        message: 'TMDB API key is not configured. Set REACT_APP_TMDB_API_KEY in your movie_frontend/.env.local file.',
      },
    };
  }

  const url = buildUrl(path, params, true);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: TMDB_CONFIG.HEADERS,
    });

    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      return {
        data: null,
        error: {
          status: res.status,
          message:
            json?.status_message || json?.message || `TMDB request failed with status ${res.status}`,
          details: json,
        },
      };
    }

    return { data: json, error: null };
  } catch (e) {
    return {
      data: null,
      error: {
        status: 0,
        message: 'Network error while calling TMDB API',
        details: String(e?.message || e),
      },
    };
  }
}

// PUBLIC_INTERFACE
export async function fetchMovies(options = {}) {
  /**
   * Fetch movies via TMDB:
   * - If options.query is provided: use /search/movie
   * - Otherwise: use /discover/movie (sorted by popularity)
   *
   * Params (options):
   * - query?: string
   * - page?: number (default 1)
   * - language?: string (default 'en-US')
   * - include_adult?: boolean (default false)
   * - sort_by?: string (default 'popularity.desc' for discover)
   *
   * Returns: { data: Movie[], error }
   */
  const {
    query = '',
    page = 1,
    language = 'en-US',
    include_adult = false,
    sort_by = 'popularity.desc',
  } = options || {};

  const q = String(query || '').trim();
  const path = q ? '/search/movie' : '/discover/movie';

  const params = q
    ? {
        query: q,
        include_adult: String(include_adult),
        language,
        page: String(page),
      }
    : {
        sort_by,
        include_adult: String(include_adult),
        language,
        page: String(page),
      };

  const { data, error } = await get(path, params);
  if (error) return { data: [], error };
  return { data: Array.isArray(data?.results) ? data.results : [], error: null };
}

// PUBLIC_INTERFACE
export async function fetchMovieDetails(movieId, options = {}) {
  /**
   * Fetch a single movie details by ID.
   * Params:
   * - movieId: number|string
   * - options.language?: string (default 'en-US')
   * - options.append_to_response?: string (optional: 'credits,images', etc.)
   *
   * Returns: { data: Movie | null, error }
   */
  const id = String(movieId || '').trim();
  if (!id) {
    return {
      data: null,
      error: { status: 400, message: 'movieId is required' },
    };
  }
  const { language = 'en-US', append_to_response } = options || {};
  const params = { language };
  if (append_to_response) params.append_to_response = append_to_response;

  const { data, error } = await get(`/movie/${encodeURIComponent(id)}`, params);
  if (error) return { data: null, error };
  return { data, error: null };
}

// PUBLIC_INTERFACE
export async function searchMovies(query) {
  /** Search movies by title. Returns { data: Movie[], error } */
  const q = String(query || '').trim();
  if (!q) {
    return { data: [], error: null };
  }
  // Delegate to fetchMovies to keep a single code-path
  return fetchMovies({ query: q, page: 1, language: 'en-US', include_adult: false });
}

// PUBLIC_INTERFACE
export async function getTrending(period = 'day') {
  /**
   * Get trending movies for 'day' or 'week'. Returns { data: Movie[], error }
   * Uses the v3 trending endpoint with v4 Bearer auth and includes api_key param for compatibility.
   */
  const valid = period === 'week' ? 'week' : 'day';
  const { data, error } = await get(`/trending/movie/${valid}`, { language: 'en-US' });
  if (error) return { data: [], error };
  return { data: Array.isArray(data?.results) ? data.results : [], error: null };
}

// PUBLIC_INTERFACE
export function getPosterUrl(path, size = 'w342') {
  /** Build a full image URL for a poster path. */
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
