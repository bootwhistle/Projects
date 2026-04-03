import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MovieDetailsPage from './MovieDetailsPage';

// Replace the real API calls with instant fake data
vi.mock('../../api/tmdb', () => ({
  getMovieDetails: vi.fn().mockResolvedValue({
    id: 550,
    title: 'Fight Club',
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 26000,
    overview: 'An insomniac office worker forms a fight club.',
    runtime: 139,
    original_language: 'en',
    genres: [{ id: 18, name: 'Drama' }],
    poster_path: null,
    backdrop_path: null,
  }),
  getMovieCredits: vi.fn().mockResolvedValue({
    cast: [
      { cast_id: 1, name: 'Brad Pitt', character: 'Tyler Durden', profile_path: null },
    ],
  }),
}));

// MovieDetailsPage renders via React Portal into #portal-root.
// We need to create and remove that DOM node for each test.
let portalRoot;

beforeEach(() => {
  portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
});

afterEach(() => {
  document.body.removeChild(portalRoot);
});

function renderDetailsPage(id = '550') {
  return render(
    <MemoryRouter initialEntries={[`/movie/${id}`]}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('MovieDetailsPage', () => {
  it('shows the Back to Home close button', async () => {
    renderDetailsPage();
    expect(await screen.findByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('shows the movie title after data loads', async () => {
    renderDetailsPage();
    expect(await screen.findByText('Fight Club')).toBeInTheDocument();
  });

  it('shows the movie overview text', async () => {
    renderDetailsPage();
    expect(await screen.findByText(/An insomniac office worker/i)).toBeInTheDocument();
  });

  it('shows the genre tag', async () => {
    renderDetailsPage();
    expect(await screen.findByText('Drama')).toBeInTheDocument();
  });

  it('shows the "Top Cast" section heading', async () => {
    renderDetailsPage();
    expect(await screen.findByText('Top Cast')).toBeInTheDocument();
  });

  it('shows the actor name in the cast section', async () => {
    renderDetailsPage();
    expect(await screen.findByText('Brad Pitt')).toBeInTheDocument();
  });

  it('shows the character name in the cast section', async () => {
    renderDetailsPage();
    expect(await screen.findByText('Tyler Durden')).toBeInTheDocument();
  });

  it('renders the overlay dialog inside #portal-root', async () => {
    renderDetailsPage();
    await screen.findByText('Fight Club');
    expect(portalRoot.querySelector('[role="dialog"]')).toBeInTheDocument();
  });
});
