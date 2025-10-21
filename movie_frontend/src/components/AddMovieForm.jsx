import React, { useState } from 'react';
import { addMovie } from '../services/movies';

/**
 * PUBLIC_INTERFACE
 * AddMovieForm
 * A form to add a movie to the Supabase 'movies' table.
 * Fields:
 *  - title (required)
 *  - overview (optional)
 *  - poster_url (optional)
 */
export default function AddMovieForm() {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatus({ loading: false, error: 'Title is required.', success: '' });
      return;
    }
    setStatus({ loading: true, error: '', success: '' });

    const { error } = await addMovie({
      title: title.trim(),
      overview: overview.trim() || undefined,
      poster_url: posterUrl.trim() || undefined,
    });

    if (error) {
      setStatus({ loading: false, error: error.message || 'Failed to add movie.', success: '' });
      return;
    }

    setStatus({ loading: false, error: '', success: 'Movie added!' });
    setTitle('');
    setOverview('');
    setPosterUrl('');

    // Reset success after a delay for UX cleanliness
    setTimeout(() => setStatus({ loading: false, error: '', success: '' }), 1500);
  };

  return (
    <div className="card-surface p-5">
      <h3 className="text-lg font-semibold text-text">Add a Movie</h3>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm text-secondary mb-1">Title</label>
          <input
            type="text"
            className="w-full rounded-lgx border border-purple-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., The Matrix"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={status.loading}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Overview (optional)</label>
          <textarea
            className="w-full rounded-lgx border border-purple-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Short description..."
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            disabled={status.loading}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm text-secondary mb-1">Poster URL (optional)</label>
          <input
            type="url"
            className="w-full rounded-lgx border border-purple-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://image.example.com/poster.jpg"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            disabled={status.loading}
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn-primary min-w-[140px]" disabled={status.loading}>
            {status.loading ? 'Adding...' : 'Add Movie'}
          </button>
        </div>

        {status.error && <p className="text-error text-sm">{status.error}</p>}
        {status.success && <p className="text-success text-sm">{status.success}</p>}
      </form>
    </div>
  );
}
