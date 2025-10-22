const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Safely get the TMDB API key from CRA environment variables.
 * We do not hardcode the key in the codebase.
 */
function getApiKey() {
  const key = process.env.REACT_APP_TMDB_API_KEY;
  return key;
}

/**
 * Build a URL with query parameters.
 */
function buildUrl(path, params = {}) {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.set(k, v);
    }
  });
  return url.toString();
}

/**
 * Execute a fetch request with error handling and structured result.
 * Returns: { data: any, error: { status: number, message: string, details?: any } | null }
 */
async function request(path, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      data: null,
      error: {
        status: 400,
        message:
          'TMDB API key is not configured. Set REACT_APP_TMDB_API_KEY in your .env.local file.',
      },
    };
  }

  const url = buildUrl(path, { api_key: apiKey, ...params });

  try {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      json = { raw: text };
    }

    if (!res.ok) {
      return {
        data: null,
        error: {
          status: res.status,
          message:
            json?.status_message ||
            json?.message ||
            `TMDB request failed with status ${res.status}`,
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
export async function searchMovies(query) {
  /** Search movies by title. Returns { data: Movie[], error } */
  const q = String(query || '').trim();
  if (!q) {
    return { data: [], error: null };
  }
  const { data, error } = await request('/search/movie', {
    query: q,
    include_adult: 'false',
    language: 'en-US',
    page: '1',
  });

  if (error) return { data: [], error };
  return { data: Array.isArray(data?.results) ? data.results : [], error: null };
}

// PUBLIC_INTERFACE
export async function getTrending(period = 'day') {
  /** Get trending movies for 'day' or 'week'. Returns { data: Movie[], error } */
  const valid = period === 'week' ? 'week' : 'day';
  const { data, error } = await request(`/trending/movie/${valid}`, {
    language: 'en-US',
  });
  if (error) return { data: [], error };
  return { data: Array.isArray(data?.results) ? data.results : [], error: null };
}

// PUBLIC_INTERFACE
export function getPosterUrl(path, size = 'w342') {
  /** Build a full image URL for a poster path. */
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
