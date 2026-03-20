/**
 * MovieCard — displays a single movie as a clickable poster card.
 *
 * Shows: poster image, title, release year, average rating badge.
 * Navigates to the movie details page on click (via the onClick prop).
 *
 * Props:
 *   movie   {object}   — TMDB movie object
 *   onClick {function} — called with movie.id when the card is activated
 */
import styles from './MovieCard.module.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

export default function MovieCard({ movie, onClick }) {
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
