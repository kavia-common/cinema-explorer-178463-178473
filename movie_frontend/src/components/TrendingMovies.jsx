import React, { useEffect, useState } from 'react';
import { getTrending } from '../services/tmdb';
import MovieCard from './MovieCard';

/**
 * PUBLIC_INTERFACE
 * TrendingMovies
 * Fetches and renders trending movies from TMDB.
 * Props:
 *  - period: 'day' | 'week' (default 'day')
 */
export default function TrendingMovies({ period = 'day' }) {
  const [state, setState] = useState({ loading: true, error: '', movies: [] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setState({ loading: true, error: '', movies: [] });
      const { data, error } = await getTrending(period);
      if (!mounted) return;
      if (error) {
        setState({
          loading: false,
          error: error.message || 'Failed to load trending movies.',
          movies: [],
        });
      } else {
        setState({ loading: false, error: '', movies: data || [] });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [period]);

  if (state.loading) {
    return <p className="text-secondary mt-4">Loading trending movies...</p>;
  }

  if (state.error) {
    return <p className="text-error mt-4">Error: {state.error}</p>;
  }

  if (!state.movies.length) {
    return <p className="text-secondary mt-4">No trending movies found.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {state.movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
