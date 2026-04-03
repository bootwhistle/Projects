import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Replace the real TMDB API calls with fake versions that return immediately
vi.mock('../../api/tmdb', () => ({
  getGenres: vi.fn().mockResolvedValue({
    genres: [{ id: 28, name: 'Action' }],
  }),
  getTopRatedMovies: vi.fn().mockResolvedValue({
    results: [
      {
        id: 1,
        title: 'Fake Movie',
        release_date: '2020-01-01',
        vote_average: 7.5,
        poster_path: null,
        genre_ids: [],
      },
    ],
    total_pages: 1,
  }),
  searchMovies: vi.fn().mockResolvedValue({ results: [], total_pages: 1 }),
  discoverMovies: vi.fn().mockResolvedValue({ results: [], total_pages: 1 }),
}));

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  it('renders the "Movie Portal" brand name in the header', () => {
    renderHomePage();
    expect(screen.getByText('Movie Portal')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    renderHomePage();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders the genre dropdown', () => {
    renderHomePage();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('loads and shows movies after the API resolves', async () => {
    renderHomePage();
    expect(await screen.findByText('Fake Movie')).toBeInTheDocument();
  });

  it('loads genres into the dropdown', async () => {
    renderHomePage();
    expect(await screen.findByRole('option', { name: 'Action' })).toBeInTheDocument();
  });

  it('shows "Top Rated Movies" as the default section title', async () => {
    renderHomePage();
    expect(await screen.findByText('Top Rated Movies')).toBeInTheDocument();
  });

  it('renders the footer with TMDB attribution', () => {
    renderHomePage();
    expect(screen.getByText(/The Movie Database/i)).toBeInTheDocument();
  });
});
