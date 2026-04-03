import {
  getGenres,
  getTopRatedMovies,
  searchMovies,
  discoverMovies,
  getMovieDetails,
  getMovieCredits,
} from './tmdb';

// Helper: creates a fake fetch that resolves with the given data
function mockFetch(data, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  // Provide a fake API key so the tmdb module doesn't throw "not configured"
  vi.stubEnv('VITE_TMDB_API_KEY', 'test_key');
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('tmdb API module', () => {
  it('getGenres calls the /genre/movie/list endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch({ genres: [] }));
    await getGenres();
    expect(fetch.mock.calls[0][0]).toContain('/genre/movie/list');
  });

  it('getTopRatedMovies calls the /movie/top_rated endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch({ results: [], total_pages: 1 }));
    await getTopRatedMovies(1);
    expect(fetch.mock.calls[0][0]).toContain('/movie/top_rated');
  });

  it('searchMovies calls /search/movie and includes the query in the URL', async () => {
    vi.stubGlobal('fetch', mockFetch({ results: [], total_pages: 1 }));
    await searchMovies('batman', 1);
    const url = fetch.mock.calls[0][0];
    expect(url).toContain('/search/movie');
    expect(url).toContain('batman');
  });

  it('discoverMovies calls the /discover/movie endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch({ results: [], total_pages: 1 }));
    await discoverMovies('28', 1);
    expect(fetch.mock.calls[0][0]).toContain('/discover/movie');
  });

  it('getMovieDetails calls the correct /movie/:id endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch({ id: 550, title: 'Fight Club' }));
    await getMovieDetails(550);
    expect(fetch.mock.calls[0][0]).toContain('/movie/550');
  });

  it('getMovieCredits calls the /movie/:id/credits endpoint', async () => {
    vi.stubGlobal('fetch', mockFetch({ cast: [] }));
    await getMovieCredits(550);
    expect(fetch.mock.calls[0][0]).toContain('/movie/550/credits');
  });

  it('throws an error with the API message when the response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ status_message: 'Invalid API key' }),
    }));
    await expect(getGenres()).rejects.toThrow('Invalid API key');
  });
});
