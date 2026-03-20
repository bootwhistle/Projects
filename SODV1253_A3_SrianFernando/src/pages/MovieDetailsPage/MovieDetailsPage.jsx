/**
 * MovieDetailsPage — rendered via React Portal as a full-screen overlay.
 *
 * React Portal usage:
 *   createPortal(content, document.getElementById('portal-root'))
 *   Renders into #portal-root (outside #root) so the overlay sits above the
 *   entire home page without DOM nesting constraints.
 *
 * React Router usage:
 *   useParams()   — reads the movie ID from the URL (/movie/:id)
 *   useNavigate() — navigates back to '/' when the user closes the overlay
 *
 * Data fetched in parallel:
 *   - /movie/:id          → full movie details (genres, overview, rating)
 *   - /movie/:id/credits  → top 10 cast members with photos
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieCredits } from '../../api/tmdb';
import styles from './MovieDetailsPage.module.css';

const IMG_BASE_W342 = 'https://image.tmdb.org/t/p/w342';
const IMG_BASE_W185 = 'https://image.tmdb.org/t/p/w185';

export default function MovieDetailsPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [movie,   setMovie]   = useState(null);
  const [cast,    setCast]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Lock body scroll while overlay is open ────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Fetch movie details + credits in parallel ─────────────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [movieData, creditsData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
        ]);
        if (!cancelled) {
          setMovie(movieData);
          setCast(creditsData.cast.slice(0, 10));
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  // ── Close on backdrop click ───────────────────────────────────────────
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) navigate('/');
  };

  // ── Helpers ───────────────────────────────────────────────────────────
  const year       = movie?.release_date?.split('-')[0] ?? 'N/A';
  const rating     = movie?.vote_average != null ? movie.vote_average.toFixed(1) : 'N/A';
  const runtimeFmt = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  // ── Portal content ────────────────────────────────────────────────────
  const content = (
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={movie ? `${movie.title} details` : 'Movie details'}
    >
      <div className={styles.modal}>
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={() => navigate('/')}
          aria-label="Back to home"
        >
          ← Back to Home
        </button>

        {/* ── Loading state ─────────────────────────────────── */}
        {loading && (
          <div className={styles.centered}>
            <div className={styles.spinner} aria-label="Loading" />
            <p>Loading movie details…</p>
          </div>
        )}

        {/* ── Error state ───────────────────────────────────── */}
        {error && (
          <div className={styles.centered}>
            <span style={{ fontSize: '2.5rem' }}>⚠️</span>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {/* ── Movie content ─────────────────────────────────── */}
        {movie && !loading && (
          <div className={styles.content}>

            {/* Backdrop image (blurred background) */}
            {movie.backdrop_path && (
              <div
                className={styles.backdrop}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
                }}
                aria-hidden="true"
              />
            )}

            {/* ── Hero section: poster + key info ───────────── */}
            <div className={styles.hero}>
              {movie.poster_path ? (
                <img
                  src={`${IMG_BASE_W342}${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  className={styles.poster}
                />
              ) : (
                <div className={styles.noPoster}>🎬</div>
              )}

              <div className={styles.heroInfo}>
                <h1 className={styles.title}>{movie.title}</h1>

                <div className={styles.meta}>
                  <span className={styles.metaItem}>{year}</span>
                  {runtimeFmt && (
                    <span className={styles.metaItem}>{runtimeFmt}</span>
                  )}
                  {movie.original_language && (
                    <span className={styles.metaItem}>
                      {movie.original_language.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className={styles.rating}>
                  <span className={styles.star}>★</span>
                  <span className={styles.ratingValue}>{rating}</span>
                  <span className={styles.ratingMax}>/10</span>
                  <span className={styles.voteCount}>
                    ({(movie.vote_count ?? 0).toLocaleString()} votes)
                  </span>
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className={styles.genres}>
                    {movie.genres.map((g) => (
                      <span key={g.id} className={styles.genreTag}>
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Plot summary */}
                {movie.overview && (
                  <div className={styles.overview}>
                    <h2 className={styles.sectionTitle}>Overview</h2>
                    <p className={styles.overviewText}>{movie.overview}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Cast section ──────────────────────────────── */}
            {cast.length > 0 && (
              <div className={styles.castSection}>
                <h2 className={styles.sectionTitle}>Top Cast</h2>
                <div className={styles.castGrid}>
                  {cast.map((actor) => (
                    <div key={actor.cast_id ?? actor.id} className={styles.castCard}>
                      <div className={styles.castPhoto}>
                        {actor.profile_path ? (
                          <img
                            src={`${IMG_BASE_W185}${actor.profile_path}`}
                            alt={actor.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className={styles.castInitials} aria-hidden="true">
                            {actor.name
                              .split(' ')
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <p className={styles.castName}>{actor.name}</p>
                      <p className={styles.castCharacter}>{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // createPortal renders `content` into #portal-root instead of #root
  return createPortal(content, document.getElementById('portal-root'));
}
