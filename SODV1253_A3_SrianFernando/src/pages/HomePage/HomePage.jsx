/**
 * HomePage — the main SPA shell.
 *
 * Responsibilities:
 *   - Fetch and display top-rated movies from TMDB.
 *   - Allow searching by title (debounced).
 *   - Allow filtering by genre.
 *   - Paginate results.
 *   - Navigate to /movie/:id when a card is clicked.
 *
 * Fetch strategy:
 *   - Text search active          → /search/movie  (genre filtered client-side)
 *   - Genre filter only           → /discover/movie?with_genres=...
 *   - Neither                     → /movie/top_rated
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { getGenres, getTopRatedMovies, searchMovies, discoverMovies } from '../../api/tmdb';
import useDebounce from '../../hooks/useDebounce';

import SearchBar    from '../../components/SearchBar/SearchBar';
import GenreFilter  from '../../components/GenreFilter/GenreFilter';
import MovieList    from '../../components/MovieList/MovieList';
import Pagination   from '../../components/Pagination/Pagination';

import styles from './HomePage.module.css';

const MAX_PAGES = 500; // TMDB caps at 500 pages

export default function HomePage() {
  const navigate = useNavigate();

  // ── Filter / search state ───────────────────────────────────────────────
  const [query,         setQuery]         = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  // ── Pagination state ────────────────────────────────────────────────────
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Data state ──────────────────────────────────────────────────────────
  const [movies,  setMovies]  = useState([]);
  const [genres,  setGenres]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── Load genre list once on mount ────────────────────────────────────────
  useEffect(() => {
    getGenres()
      .then((data) => setGenres(data.genres))
      .catch(() => setGenres([]));
  }, []);

  // ── Reset to page 1 whenever search or genre filter changes ─────────────
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, selectedGenre]);

  // ── Fetch movies whenever query / genre / page changes ──────────────────
  useEffect(() => {
    let cancelled = false;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;

        if (debouncedQuery) {
          // Search by text; filter by genre client-side if needed
          data = await searchMovies(debouncedQuery, page);
          if (selectedGenre) {
            data.results = data.results.filter((m) =>
              m.genre_ids.includes(Number(selectedGenre))
            );
          }
        } else if (selectedGenre) {
          data = await discoverMovies(selectedGenre, page);
        } else {
          data = await getTopRatedMovies(page);
        }

        if (!cancelled) {
          setMovies(data.results);
          setTotalPages(Math.min(data.total_pages, MAX_PAGES));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMovies();
    return () => { cancelled = true; };
  }, [debouncedQuery, selectedGenre, page]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMovieClick = useCallback(
    (id) => navigate(`/movie/${id}`),
    [navigate]
  );

  const handleGenreChange = useCallback((genreId) => {
    setSelectedGenre(genreId);
  }, []);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ── Header ───────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🎬</span>
            <h1 className={styles.brandName}>Movie Portal</h1>
          </div>
          <p className={styles.brandSub}>Powered by TMDB</p>
        </div>
      </header>

      {/* ── Controls bar ─────────────────────────────────────── */}
      <div className={styles.controls}>
        <SearchBar
          value={query}
          onChange={handleQueryChange}
        />
        <GenreFilter
          genres={genres}
          selected={selectedGenre}
          onChange={handleGenreChange}
        />
      </div>

      {/* ── Section title ────────────────────────────────────── */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {debouncedQuery
            ? `Search results for "${debouncedQuery}"`
            : selectedGenre
            ? `${genres.find((g) => String(g.id) === selectedGenre)?.name ?? ''} Movies`
            : 'Top Rated Movies'}
        </h2>
        {!loading && (
          <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
        )}
      </div>

      {/* ── Movie grid ───────────────────────────────────────── */}
      <main className={styles.main}>
        <MovieList
          movies={movies}
          loading={loading}
          error={error}
          onMovieClick={handleMovieClick}
        />
      </main>

      {/* ── Pagination ───────────────────────────────────────── */}
      {!loading && !error && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>Movie data provided by <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">The Movie Database (TMDB)</a></p>
      </footer>
    </div>
  );
}
