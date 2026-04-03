import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from './MovieCard';

const movie = {
  id: 550,
  title: 'Fight Club',
  release_date: '1999-10-15',
  vote_average: 8.4,
  poster_path: '/poster.jpg',
  genre_ids: [18],
};

const movieNoPoster = {
  id: 551,
  title: 'No Poster Movie',
  release_date: '2000-06-01',
  vote_average: 6.0,
  poster_path: null,
  genre_ids: [],
};

const movieNoDate = {
  id: 552,
  title: 'Dateless Film',
  release_date: undefined,
  vote_average: 5.0,
  poster_path: null,
  genre_ids: [],
};

describe('MovieCard', () => {
  it('renders the movie title', () => {
    render(<MovieCard movie={movie} onClick={() => {}} />);
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  it('renders the release year extracted from release_date', () => {
    render(<MovieCard movie={movie} onClick={() => {}} />);
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('renders the rating badge', () => {
    render(<MovieCard movie={movie} onClick={() => {}} />);
    expect(screen.getByText(/8\.4/)).toBeInTheDocument();
  });

  it('renders the poster image when poster_path is provided', () => {
    render(<MovieCard movie={movie} onClick={() => {}} />);
    const img = screen.getByAltText('Fight Club poster');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('/poster.jpg'));
  });

  it('shows the "No Image" fallback when poster_path is null', () => {
    render(<MovieCard movie={movieNoPoster} onClick={() => {}} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('shows N/A when release_date is missing', () => {
    render(<MovieCard movie={movieNoDate} onClick={() => {}} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('calls onClick with the correct movie id when the card is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<MovieCard movie={movie} onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: /Fight Club/i }));
    expect(handleClick).toHaveBeenCalledWith(550);
  });

  it('calls onClick when the Enter key is pressed while the card is focused', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<MovieCard movie={movie} onClick={handleClick} />);
    screen.getByRole('button', { name: /Fight Club/i }).focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledWith(550);
  });
});
