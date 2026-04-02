/**
 * MovieList.jsx — A4 optimized
 *
 * PERFORMANCE FIX: Wrapped in React.memo. MovieList receives props from
 * HomePage. Without memo it re-renders on every parent state change even
 * when movies/loading/error/onMovieClick haven't changed.
 */
import { memo } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieList.module.css';

function MovieList({ movies, loading, error, onMovieClick }) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.skeleton} aria-hidden="true" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state}>
        <span className={styles.stateIcon}>⚠️</span>
        <p className={styles.stateText}>{error}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className={styles.state}>
        <span className={styles.stateIcon}>🎬</span>
        <p className={styles.stateText}>No movies found. Try a different search or genre.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
      ))}
    </div>
  );
}

export default memo(MovieList);
