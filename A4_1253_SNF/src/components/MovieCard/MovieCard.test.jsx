/**
 * MovieCard.test.jsx
 *
 * Tests for the MovieCard component.
 * We check rendering, click handling, keyboard access, and missing-image fallback.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from './MovieCard';

// ── Mock movie data ──────────────────────────────────────────────────────────
const mockMovie = {
  id:            550,
  title:         'Fight Club',
  release_date:  '1999-10-15',
  vote_average:  8.4,
  poster_path:   '/poster.jpg',
};

const mockMovieNoPoster = {
  id:            551,
  title:         'No Image Film',
  release_date:  '2020-01-01',
  vote_average:  5.5,
  poster_path:   null,       // no image available
};

function setup(movie = mockMovie, onClick = vi.fn()) {
  render(<MovieCard movie={movie} onClick={onClick} />);
  return { onClick };
}

describe('MovieCard', () => {

  it('renders the movie title', () => {
    setup();
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  it('renders the release year extracted from the date', () => {
    setup();
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('renders the rating value', () => {
    setup();
    // vote_average 8.4 → "★ 8.4"
    expect(screen.getByText('★ 8.4')).toBeInTheDocument();
  });

  it('renders the poster image when poster_path is provided', () => {
    setup();
    // getByAltText finds <img> by its alt attribute
    const img = screen.getByAltText('Fight Club poster');
    expect(img).toBeInTheDocument();
    // The image URL should include the poster path
    expect(img).toHaveAttribute('src', expect.stringContaining('/poster.jpg'));
  });

  it('shows the no-image placeholder when poster_path is null', () => {
    setup(mockMovieNoPoster);
    // No <img> element should be rendered
    expect(screen.queryByAltText('No Image Film poster')).not.toBeInTheDocument();
    // The text fallback "No Image" should be visible
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });

  it('calls onClick with the movie id when card is clicked', async () => {
    const user = userEvent.setup();
    const { onClick } = setup();

    // The article has role="button" so we query by that role + the aria-label
    await user.click(screen.getByRole('button', { name: /Fight Club/i }));

    expect(onClick).toHaveBeenCalledWith(550);
  });

  it('calls onClick when the Enter key is pressed on the card', async () => {
    const user = userEvent.setup();
    const { onClick } = setup();

    // Tab to focus the card, then press Enter
    await user.tab();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledWith(550);
  });

  it('shows "N/A" for year when release_date is missing', () => {
    setup({ ...mockMovie, release_date: undefined });
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

});
