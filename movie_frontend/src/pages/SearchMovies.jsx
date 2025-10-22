import React, { useState } from 'react';
import { searchMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';

/**
 * PUBLIC_INTERFACE
 * SearchMovies
 * Search for movies by title using the TMDB API.
 */
export default function SearchMovies() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState({ loading: false, error: '', results: [] });

  const onSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setState({ loading: false, error: '', results: [] });
      return;
    }
    setState({ loading: true, error: '', results: [] });
    const { data, error } = await searchMovies(q);
    if (error) {
      setState({
        loading: false,
        error: error.message || 'Search failed. Please try again.',
        results: [],
      });
    } else {
      setState({ loading: false, error: '', results: data || [] });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-text">Search Movies</h2>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          className="flex-1 rounded-lgx border border-purple-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="btn-primary min-w-[120px]" type="submit">
          Search
        </button>
      </form>

      {state.loading && <p className="text-secondary mt-4">Searching...</p>}
      {state.error && <p className="text-error mt-4">Error: {state.error}</p>}

      {!state.loading && !state.error && state.results.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {state.results.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}

      {!state.loading && !state.error && query.trim() && state.results.length === 0 && (
        <p className="text-secondary mt-4">No results found.</p>
      )}
    </section>
  );
}
