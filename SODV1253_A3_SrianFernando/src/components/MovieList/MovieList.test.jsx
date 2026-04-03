import { render, screen } from '@testing-library/react';
import MovieList from './MovieList';

const movies = [
  { id: 1, title: 'Movie One', release_date: '2020-01-01', vote_average: 7.5, poster_path: null, genre_ids: [] },
  { id: 2, title: 'Movie Two', release_date: '2021-01-01', vote_average: 8.0, poster_path: null, genre_ids: [] },
];

describe('MovieList', () => {
  it('shows skeleton placeholders while loading (no movie cards)', () => {
    render(<MovieList movies={[]} loading={true} error={null} onMovieClick={() => {}} />);
    // Skeletons are aria-hidden — no clickable cards should appear
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows the error message when an error is passed', () => {
    render(<MovieList movies={[]} loading={false} error="Something went wrong" onMovieClick={() => {}} />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows the empty-state message when the movies array is empty', () => {
    render(<MovieList movies={[]} loading={false} error={null} onMovieClick={() => {}} />);
    expect(screen.getByText(/No movies found/i)).toBeInTheDocument();
  });

  it('renders a card for every movie in the array', () => {
    render(<MovieList movies={movies} loading={false} error={null} onMovieClick={() => {}} />);
    expect(screen.getByText('Movie One')).toBeInTheDocument();
    expect(screen.getByText('Movie Two')).toBeInTheDocument();
  });

  it('renders the correct count of movie cards', () => {
    render(<MovieList movies={movies} loading={false} error={null} onMovieClick={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
