/**
 * Movies service: CRUD helpers for the 'movies' table in Supabase.
 * Table schema expectation (documented, not enforced here):
 * - id: uuid primary key (default uuid_generate_v4())
 * - title: text not null
 * - overview: text nullable
 * - poster_url: text nullable
 * - created_at: timestamp with time zone default now()
 */
import supabaseClient, { getSupabaseClient } from '../lib/supabaseClient';

const supabase = supabaseClient || getSupabaseClient();

/**
 * PUBLIC_INTERFACE
 * listMovies
 * Fetch all movies ordered by created_at desc.
 * Returns: { data: Movie[], error: PostgrestError | null }
 */
export async function listMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

/**
 * PUBLIC_INTERFACE
 * addMovie
 * Add a movie.
 * Params:
 *  - movie: { title: string, overview?: string, poster_url?: string }
 * Returns: { data: Movie | null, error: PostgrestError | null }
 */
export async function addMovie(movie) {
  const payload = {
    title: movie.title,
    overview: movie.overview ?? null,
    poster_url: movie.poster_url ?? null,
  };

  const { data, error } = await supabase.from('movies').insert(payload).select().single();
  return { data, error };
}

/**
 * PUBLIC_INTERFACE
 * deleteMovie
 * Delete a movie by id.
 * Params:
 *  - id: string (uuid)
 * Returns: { error: PostgrestError | null }
 */
export async function deleteMovie(id) {
  const { error } = await supabase.from('movies').delete().eq('id', id);
  return { error };
}

/**
 * PUBLIC_INTERFACE
 * updateMovie
 * Update a movie by id with partial updates.
 * Params:
 *  - id: string (uuid)
 *  - updates: Partial<{ title: string, overview: string, poster_url: string }>
 * Returns: { data: Movie | null, error: PostgrestError | null }
 */
export async function updateMovie(id, updates) {
  const cleaned = {};
  ['title', 'overview', 'poster_url'].forEach((k) => {
    if (k in updates) cleaned[k] = updates[k];
  });

  const { data, error } = await supabase.from('movies').update(cleaned).eq('id', id).select().single();
  return { data, error };
}
