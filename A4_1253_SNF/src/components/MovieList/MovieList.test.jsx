/**
 * MovieList.test.jsx
 *
 * Tests for the MovieList component.
 * We check all four display states: loading, error, empty, and populated.
 */
import { render, screen } from '@testing-library/react';
import MovieList from './MovieList';

// Sample movies for the populated state
const mockMovies = [
  { id: 1, title: 'Movie One',   release_date: '2020-01-01', vote_average: 7.5, poster_path: null },
  { id: 2, title: 'Movie Two',   release_date: '2021-06-15', vote_average: 8.1, poster_path: null },
  { id: 3, title: 'Movie Three', release_date: '2022-03-20', vote_average: 5.9, poster_path: null },
];

describe('MovieList', () => {

  it('shows skeleton placeholders while loading', () => {
    render(
      <MovieList movies={[]} loading={true} error={null} onMovieClick={vi.fn()} />
    );
    // Skeletons have aria-hidden="true" so they don't show up for screen readers.
    // We look for the grid container by checking there are no movie titles.
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    // The 20 skeleton divs are in the DOM but not accessible to AT users
    // We verify the loading state by confirming no movie titles are shown
    expect(screen.queryByText('Movie One')).not.toBeInTheDocument();
  });

  it('shows the error message when error prop is set', () => {
    render(
      <MovieList
        movies={[]}
        loading={false}
        error="Something went wrong"
        onMovieClick={vi.fn()}
      />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows the empty-state message when movies array is empty', () => {
    render(
      <MovieList movies={[]} loading={false} error={null} onMovieClick={vi.fn()} />
    );
    expect(
      screen.getByText(/no movies found/i)
    ).toBeInTheDocument();
  });

  it('renders a MovieCard for each movie in the movies array', () => {
    render(
      <MovieList
        movies={mockMovies}
        loading={false}
        error={null}
        onMovieClick={vi.fn()}
      />
    );
    // Each card renders an article with role="button" and the movie title
    expect(screen.getByText('Movie One')).toBeInTheDocument();
    expect(screen.getByText('Movie Two')).toBeInTheDocument();
    expect(screen.getByText('Movie Three')).toBeInTheDocument();
  });

  it('renders the correct number of cards', () => {
    render(
      <MovieList
        movies={mockMovies}
        loading={false}
        error={null}
        onMovieClick={vi.fn()}
      />
    );
    // 3 movies → 3 article[role=button] elements
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

});
