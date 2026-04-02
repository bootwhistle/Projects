/**
 * HomePage.test.jsx
 *
 * Tests for the HomePage component.
 *
 * Because HomePage makes API calls on mount, we mock the entire tmdb module
 * so no real network requests are made. We use waitFor / findBy queries to
 * handle async state updates after the "fetch" resolves.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

// ── Mock the API module ───────────────────────────────────────────────────────
// vi.mock replaces the entire module with our fake versions.
// Each function returns a resolved Promise with minimal fake data.
vi.mock('../../api/tmdb', () => ({
  getGenres: vi.fn().mockResolvedValue({
    genres: [
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
    ],
  }),
  getTopRatedMovies: vi.fn().mockResolvedValue({
    results: [
      { id: 1, title: 'Top Movie',    release_date: '2020-01-01', vote_average: 8.5, poster_path: null },
      { id: 2, title: 'Second Movie', release_date: '2021-06-01', vote_average: 7.0, poster_path: null },
    ],
    total_pages: 3,
  }),
  searchMovies: vi.fn().mockResolvedValue({
    results: [
      { id: 3, title: 'Search Result', release_date: '2019-03-01', vote_average: 6.5, poster_path: null },
    ],
    total_pages: 1,
  }),
  discoverMovies: vi.fn().mockResolvedValue({
    results: [
      { id: 4, title: 'Action Movie', release_date: '2018-05-01', vote_average: 7.8, poster_path: null },
    ],
    total_pages: 2,
  }),
}));

// ── Helper ────────────────────────────────────────────────────────────────────
// HomePage uses useNavigate which requires a Router context
function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('HomePage', () => {

  it('renders the Movie Portal heading', () => {
    renderHomePage();
    expect(screen.getByText('Movie Portal')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    renderHomePage();
    expect(screen.getByRole('textbox', { name: /search movies/i })).toBeInTheDocument();
  });

  it('renders the genre dropdown', () => {
    renderHomePage();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows "Top Rated Movies" heading by default', async () => {
    renderHomePage();
    // findByText waits for the element to appear (handles async render)
    expect(await screen.findByText('Top Rated Movies')).toBeInTheDocument();
  });

  it('loads and displays movies after fetching', async () => {
    renderHomePage();
    // The mock getTopRatedMovies resolves with 'Top Movie' and 'Second Movie'
    expect(await screen.findByText('Top Movie')).toBeInTheDocument();
    expect(await screen.findByText('Second Movie')).toBeInTheDocument();
  });

  it('loads genre options into the dropdown', async () => {
    renderHomePage();
    // Wait for genres to load
    expect(await screen.findByRole('option', { name: 'Action' })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'Comedy' })).toBeInTheDocument();
  });

  it('updates the section title when user types a search query', async () => {
    const user = userEvent.setup();
    // Use fake timers so the 400ms debounce resolves immediately
    vi.useFakeTimers();

    renderHomePage();

    const input = screen.getByRole('textbox', { name: /search movies/i });
    await user.type(input, 'batman');

    // Advance past the 400ms debounce delay
    vi.advanceTimersByTime(400);
    vi.useRealTimers();

    // After debounce resolves, section title should change
    await waitFor(() => {
      expect(screen.getByText(/search results for "batman"/i)).toBeInTheDocument();
    });
  });

});
