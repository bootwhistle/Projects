/**
 * tmdb.js — Thin wrapper around the TMDB v3 REST API.
 *
 * All requests attach the api_key from the VITE_TMDB_API_KEY environment
 * variable. Set this in a .env file (see .env.example).
 *
 * TMDB API base URL: https://api.themoviedb.org/3
 * Image base URL:    https://image.tmdb.org/t/p/{size}{poster_path}
 *   Common sizes: w92, w185, w342, w500, w780, original
 */

const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Core fetch helper — builds the URL, appends api_key + language, fires the
 * request, and throws on non-2xx responses.
 */
async function request(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key not configured. Copy .env.example to .env and add your key.'
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.status_message || `TMDB error ${res.status}`);
  }

  return res.json();
}

/** Fetch the list of official movie genres. */
export const getGenres = () => request('/genre/movie/list');

/** Fetch a page of top-rated movies. */
export const getTopRatedMovies = (page = 1) =>
  request('/movie/top_rated', { page });

/**
 * Search movies by title.
 * Returns { page, results, total_pages, total_results }
 */
export const searchMovies = (query, page = 1) =>
  request('/search/movie', { query, page, include_adult: false });

/**
 * Discover movies by genre, sorted by rating (vote_count threshold avoids
 * obscure films with a single perfect vote).
 */
export const discoverMovies = (genreId, page = 1) =>
  request('/discover/movie', {
    with_genres:       genreId,
    sort_by:           'vote_average.desc',
    'vote_count.gte':  300,
    page,
  });

/** Fetch full details for a single movie (includes genres array). */
export const getMovieDetails = (id) => request(`/movie/${id}`);

/** Fetch cast and crew for a movie. */
export const getMovieCredits = (id) => request(`/movie/${id}/credits`);
