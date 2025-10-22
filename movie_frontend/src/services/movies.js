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
 
 // Cache instance
 const supabase = supabaseClient || getSupabaseClient();
 
 // Internal helper to ensure user-friendly messages and avoid surfacing "Invalid API key"
 const sanitizeErrorMessage = (error) => {
   const raw = String(error?.message || error || 'Unexpected error');
   const lower = raw.toLowerCase();
   if (lower.includes('invalid api key') || lower.includes('api key')) {
     return 'Configuration error: please verify Supabase settings.';
   }
   return raw;
 };
 
 const normalizeError = (error) => {
   return new Error(sanitizeErrorMessage(error));
 };
 
 /**
  * PUBLIC_INTERFACE
  * listMovies
  * Fetch all movies ordered by created_at desc.
  * Returns: { data: Movie[], error: Error | null }
  */
 export async function listMovies() {
   try {
     const { data, error } = await supabase
       .from('movies')
       .select('id,title,overview,poster_url,created_at')
       .order('created_at', { ascending: false });
 
     if (error) {
       // eslint-disable-next-line no-console
       console.error('Supabase listMovies error:', error);
       return { data: [], error: normalizeError(error) };
     }
     return { data: data || [], error: null };
   } catch (e) {
     // eslint-disable-next-line no-console
     console.error('Supabase listMovies failed:', e);
     return { data: [], error: normalizeError(e) };
   }
 }
 
 /**
  * PUBLIC_INTERFACE
  * addMovie
  * Add a movie.
  * Params:
  *  - movie: { title: string, overview?: string, poster_url?: string }
  * Returns: { data: Movie | null, error: Error | null }
  */
 export async function addMovie(movie) {
   try {
     const payload = {
       title: movie.title,
       overview: movie.overview ?? null,
       poster_url: movie.poster_url ?? null,
     };
 
     const { data, error } = await supabase
       .from('movies')
       .insert(payload)
       .select('id,title,overview,poster_url,created_at')
       .single();
 
     if (error) {
       // eslint-disable-next-line no-console
       console.error('Supabase addMovie error:', error);
       return { data: null, error: normalizeError(error) };
     }
     return { data, error: null };
   } catch (e) {
     // eslint-disable-next-line no-console
     console.error('Supabase addMovie failed:', e);
     return { data: null, error: normalizeError(e) };
   }
 }
 
 /**
  * PUBLIC_INTERFACE
  * deleteMovie
  * Delete a movie by id.
  * Params:
  *  - id: string (uuid)
  * Returns: { error: Error | null }
  */
 export async function deleteMovie(id) {
   try {
     const { error } = await supabase.from('movies').delete().eq('id', id);
     if (error) {
       // eslint-disable-next-line no-console
       console.error('Supabase deleteMovie error:', error);
       return { error: normalizeError(error) };
     }
     return { error: null };
   } catch (e) {
     // eslint-disable-next-line no-console
     console.error('Supabase deleteMovie failed:', e);
     return { error: normalizeError(e) };
   }
 }
 
 /**
  * PUBLIC_INTERFACE
  * updateMovie
  * Update a movie by id with partial updates.
  * Params:
  *  - id: string (uuid)
  *  - updates: Partial<{ title: string, overview: string, poster_url: string }>
  * Returns: { data: Movie | null, error: Error | null }
  */
 export async function updateMovie(id, updates) {
   try {
     const cleaned = {};
     ['title', 'overview', 'poster_url'].forEach((k) => {
       if (k in updates) cleaned[k] = updates[k];
     });
 
     const { data, error } = await supabase
       .from('movies')
       .update(cleaned)
       .eq('id', id)
       .select('id,title,overview,poster_url,created_at')
       .single();
 
     if (error) {
       // eslint-disable-next-line no-console
       console.error('Supabase updateMovie error:', error);
       return { data: null, error: normalizeError(error) };
     }
     return { data, error: null };
   } catch (e) {
     // eslint-disable-next-line no-console
     console.error('Supabase updateMovie failed:', e);
     return { data: null, error: normalizeError(e) };
   }
 }
