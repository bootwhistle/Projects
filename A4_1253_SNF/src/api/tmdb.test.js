/**
 * tmdb.test.js
 *
 * Tests for the TMDB API helper module.
 *
 * We use vi.stubGlobal to replace the browser's fetch() with a mock so we
 * never make real network requests during tests. This keeps tests fast,
 * offline-safe, and deterministic.
 */
import {
  getGenres,
  getTopRatedMovies,
  searchMovies,
  discoverMovies,
  getMovieDetails,
  getMovieCredits,
} from './tmdb';

// ── Setup ────────────────────────────────────────────────────────────────────

// Helper: create a fake fetch response that returns the given data as JSON
function mockFetch(data) {
  return vi.fn().mockResolvedValue({
    ok:   true,
    json: () => Promise.resolve(data),
  });
}

// Before every test, inject a fake API key so the guard check passes
beforeEach(() => {
  vi.stubEnv('VITE_TMDB_API_KEY', 'test-key-123');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('tmdb API helpers', () => {

  it('getGenres calls the correct endpoint', async () => {
    const fakeGenres = { genres: [{ id: 28, name: 'Action' }] };
    vi.stubGlobal('fetch', mockFetch(fakeGenres));

    const result = await getGenres();

    expect(result).toEqual(fakeGenres);
    // Verify the URL contains the correct path
    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('/genre/movie/list');
  });

  it('getTopRatedMovies calls /movie/top_rated with the correct page', async () => {
    const fakeMovies = { results: [], total_pages: 10, page: 2 };
    vi.stubGlobal('fetch', mockFetch(fakeMovies));

    await getTopRatedMovies(2);

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('/movie/top_rated');
    expect(calledUrl).toContain('page=2');
  });

  it('searchMovies calls /search/movie with query and page', async () => {
    const fakeResults = { results: [], total_pages: 5, page: 1 };
    vi.stubGlobal('fetch', mockFetch(fakeResults));

    await searchMovies('inception', 1);

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('/search/movie');
    expect(calledUrl).toContain('query=inception');
    expect(calledUrl).toContain('page=1');
  });

  it('discoverMovies calls /discover/movie with the genre id', async () => {
    vi.stubGlobal('fetch', mockFetch({ results: [], total_pages: 3 }));

    await discoverMovies(28, 1); // genre 28 = Action

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('/discover/movie');
    expect(calledUrl).toContain('with_genres=28');
  });

  it('getMovieDetails calls /movie/:id', async () => {
    const fakeMovie = { id: 550, title: 'Fight Club' };
    vi.stubGlobal('fetch', mockFetch(fakeMovie));

    const result = await getMovieDetails(550);

    expect(result).toEqual(fakeMovie);
    expect(fetch.mock.calls[0][0]).toContain('/movie/550');
  });

  it('throws an error when the API returns a non-2xx status', async () => {
    // Simulate a 404 response from TMDB
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok:   false,
      json: () => Promise.resolve({ status_message: 'The resource you requested could not be found.' }),
    }));

    // The request() helper should throw with the TMDB error message
    await expect(getMovieDetails(99999999)).rejects.toThrow(
      'The resource you requested could not be found.'
    );
  });

});
