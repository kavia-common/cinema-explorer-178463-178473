import React from 'react';
import { getPosterUrl } from '../services/tmdb';

/**
 * PUBLIC_INTERFACE
 * MovieCard
 * Displays a movie poster, title, release year, and vote average.
 * Props:
 *  - movie: TMDB Movie object
 */
export default function MovieCard({ movie }) {
  const title = movie?.title || movie?.name || 'Untitled';
  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = typeof movie?.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A';
  const poster = getPosterUrl(movie?.poster_path, 'w342');

  return (
    <div className="card-surface overflow-hidden">
      <div className="h-56 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
        {poster ? (
          <img
            src={poster}
            alt={title}
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
        <h4 className="text-text font-semibold truncate">{title}</h4>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-secondary">{year}</span>
          <span className="font-medium text-text">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}
