/**
 * MovieList — renders a responsive grid of MovieCard components.
 * Handles loading, error, and empty states.
 *
 * Props:
 *   movies      {Array}    — array of TMDB movie objects
 *   loading     {boolean}  — show loading skeleton
 *   error       {string}   — error message to display (or null)
 *   onMovieClick {function} — passed down to each MovieCard
 */
import MovieCard from '../MovieCard/MovieCard';
import styles from './MovieList.module.css';

export default function MovieList({ movies, loading, error, onMovieClick }) {
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
