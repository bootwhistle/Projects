/**
 * MovieDetailsPage.test.jsx
 *
 * Tests for the MovieDetailsPage component.
 *
 * This component uses React.createPortal to render into #portal-root.
 * We must create that DOM node in beforeEach and remove it in afterEach,
 * otherwise the portal has nowhere to render and will throw.
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MovieDetailsPage from './MovieDetailsPage';

// ── Mock the API module ───────────────────────────────────────────────────────
vi.mock('../../api/tmdb', () => ({
  getMovieDetails: vi.fn().mockResolvedValue({
    id:               550,
    title:            'Fight Club',
    release_date:     '1999-10-15',
    vote_average:     8.4,
    vote_count:       25000,
    runtime:          139,
    overview:         'A bored office worker starts an underground fight club.',
    original_language:'en',
    poster_path:      null,
    backdrop_path:    null,
    genres:           [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
  }),
  getMovieCredits: vi.fn().mockResolvedValue({
    cast: [
      { cast_id: 1, id: 101, name: 'Brad Pitt',    character: 'Tyler Durden',   profile_path: null },
      { cast_id: 2, id: 102, name: 'Edward Norton', character: 'The Narrator',   profile_path: null },
    ],
  }),
}));

// ── Portal setup ──────────────────────────────────────────────────────────────
// MovieDetailsPage renders into #portal-root via createPortal.
// We must add this div to the DOM before each test.
let portalRoot;

beforeEach(() => {
  portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  document.body.removeChild(portalRoot);
});

// ── Helper ────────────────────────────────────────────────────────────────────
function renderPage(movieId = '550') {
  return render(
    <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('MovieDetailsPage', () => {

  it('shows a loading indicator while data is being fetched', () => {
    renderPage();
    // The spinner has aria-label="Loading"
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('displays the movie title after data loads', async () => {
    renderPage();
    expect(await screen.findByText('Fight Club')).toBeInTheDocument();
  });

  it('displays the release year', async () => {
    renderPage();
    await screen.findByText('Fight Club');
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('displays the movie rating', async () => {
    renderPage();
    await screen.findByText('Fight Club');
    expect(screen.getByText('8.4')).toBeInTheDocument();
  });

  it('displays genre tags', async () => {
    renderPage();
    await screen.findByText('Fight Club');
    expect(screen.getByText('Drama')).toBeInTheDocument();
    expect(screen.getByText('Thriller')).toBeInTheDocument();
  });

  it('displays the top cast section', async () => {
    renderPage();
    await screen.findByText('Fight Club');
    expect(screen.getByText('Brad Pitt')).toBeInTheDocument();
    expect(screen.getByText('Edward Norton')).toBeInTheDocument();
  });

  it('renders the Back to Home close button', async () => {
    renderPage();
    await screen.findByText('Fight Club');
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('shows the movie overview', async () => {
    renderPage();
    await screen.findByText('Fight Club');
    expect(
      screen.getByText('A bored office worker starts an underground fight club.')
    ).toBeInTheDocument();
  });

});
