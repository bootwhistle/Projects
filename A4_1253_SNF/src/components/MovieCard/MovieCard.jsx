/**
 * MovieCard.jsx — A4 optimized
 *
 * PERFORMANCE FIX: Wrapped in React.memo so the card only re-renders when
 * its own `movie` or `onClick` prop actually changes. Without memo, every
 * keystroke in the search bar re-renders all 20 cards unnecessarily because
 * the parent (HomePage) re-renders with each state change.
 */
import { memo } from 'react';
import styles from './MovieCard.module.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null;
  const year      = movie.release_date?.split('-')[0] ?? 'N/A';
  const rating    = movie.vote_average != null ? movie.vote_average.toFixed(1) : 'N/A';

  const handleActivate = () => onClick(movie.id);

  return (
    <article
      className={styles.card}
      onClick={handleActivate}
      onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
      role="button"
      tabIndex={0}
      aria-label={`${movie.title} (${year}), rated ${rating}`}
    >
      <div className={styles.posterWrapper}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className={styles.poster}
            loading="lazy"
          />
        ) : (
          <div className={styles.noPoster}>
            <span>🎬</span>
            <span>No Image</span>
          </div>
        )}

        {/* Rating badge overlaid on the poster */}
        <div
          className={`${styles.ratingBadge} ${getRatingClass(movie.vote_average)}`}
          aria-label={`Rating: ${rating}`}
        >
          ★ {rating}
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <span className={styles.year}>{year}</span>
      </div>
    </article>
  );
}

/** Returns a CSS module class name based on the rating value. */
function getRatingClass(rating) {
  if (rating >= 8)  return styles.ratingHigh;
  if (rating >= 6)  return styles.ratingMid;
  return styles.ratingLow;
}

export default memo(MovieCard);
