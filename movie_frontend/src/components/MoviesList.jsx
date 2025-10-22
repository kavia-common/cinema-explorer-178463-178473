import React, { useEffect, useMemo, useState } from 'react';
import { listMovies, deleteMovie, updateMovie } from '../services/movies';
import supabase from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * MoviesList
 * Displays movies from Supabase with real-time sync for inserts, updates, and deletes.
 * Provides inline title editing and delete action.
 */
export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const byId = useMemo(() => {
    const map = new Map();
    movies.forEach((m) => map.set(m.id, m));
    return map;
  }, [movies]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data, error: err } = await listMovies();
      if (!isMounted) return;
      if (err) {
        setError(err.message || 'Failed to load movies.');
      } else {
        setMovies(data || []);
      }
      setLoading(false);
    })();

    // Set up realtime subscription
    const channel = supabase
      .channel('movies-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'movies' },
        (payload) => {
          setMovies((prev) => {
            const current = [...prev];
            if (payload.eventType === 'INSERT') {
              // Insert new at the top (created_at desc)
              return [payload.new, ...current];
            }
            if (payload.eventType === 'UPDATE') {
              return current.map((m) => (m.id === payload.new.id ? payload.new : m));
            }
            if (payload.eventType === 'DELETE') {
              return current.filter((m) => m.id !== payload.old.id);
            }
            return current;
          });
        }
      )
      .subscribe((status) => {
        // Optional: handle status if needed
        return status;
      });

    return () => {
      isMounted = false;
      try {
        supabase.removeChannel(channel);
      } catch (_) {
        // ignore
      }
    };
  }, []);

  const onDelete = async (id) => {
    const prev = movies;
    setMovies((p) => p.filter((m) => m.id !== id));
    const { error: err } = await deleteMovie(id);
    if (err) {
      setMovies(prev);
      setError(err.message || 'Failed to delete movie.');
    }
  };

  const startEdit = (movie) => {
    setEditingId(movie.id);
    setEditingTitle(movie.title || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const id = editingId;
    const prev = movies;
    const updatedLocal = prev.map((m) => (m.id === id ? { ...m, title: editingTitle } : m));
    setMovies(updatedLocal);
    setEditingId(null);
    setEditingTitle('');
    const { error: err } = await updateMovie(id, { title: editingTitle });
    if (err) {
      setMovies(prev);
      setError(err.message || 'Failed to update movie.');
    }
  };

  if (loading) {
    return (
      <div className="card-surface p-5">
        <p className="text-secondary">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-surface p-5">
        <p className="text-error">Error: {error}</p>
      </div>
    );
  }

  if (!movies.length) {
    return (
      <div className="card-surface p-5">
        <p className="text-secondary">No movies yet. Add your first movie using the form above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {movies.map((m) => (
        <div key={m.id} className="card-surface overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
            {m.poster_url ? (
              <img
                src={m.poster_url}
                alt={m.title || 'Movie poster'}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-secondary text-sm">No Poster</span>
            )}
          </div>
          <div className="p-4">
            {editingId === m.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="w-full rounded-lgx border border-purple-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={saveEdit} type="button">
                    Save
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lgx bg-secondary text-white font-semibold shadow-soft hover:opacity-90 transition"
                    onClick={cancelEdit}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-text font-semibold">{m.title || 'Untitled'}</h4>
                {m.overview && <p className="mt-1 text-secondary text-sm overflow-hidden">{m.overview}</p>}
                <div className="mt-4 flex gap-2">
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lgx bg-primary text-white text-sm font-semibold shadow-soft hover:opacity-90 transition"
                    onClick={() => startEdit(m)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 rounded-lgx bg-error text-white text-sm font-semibold shadow-soft hover:opacity-90 transition"
                    onClick={() => onDelete(m.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
