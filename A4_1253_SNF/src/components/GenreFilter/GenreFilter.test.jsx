/**
 * GenreFilter.test.jsx
 *
 * Tests for the GenreFilter dropdown component.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenreFilter from './GenreFilter';

// Sample genre data that mirrors the TMDB API response shape
const mockGenres = [
  { id: 28,  name: 'Action'  },
  { id: 12,  name: 'Adventure' },
  { id: 35,  name: 'Comedy'  },
];

function setup(selected = '', onChange = vi.fn()) {
  render(
    <GenreFilter genres={mockGenres} selected={selected} onChange={onChange} />
  );
  return { onChange };
}

describe('GenreFilter', () => {

  it('renders the genre select dropdown', () => {
    setup();
    // The select element has an associated label "Genre"
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders an "All Genres" option as the first item', () => {
    setup();
    // getByRole('option') finds <option> elements
    expect(screen.getByRole('option', { name: 'All Genres' })).toBeInTheDocument();
  });

  it('renders an option for each genre in the genres prop', () => {
    setup();
    expect(screen.getByRole('option', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Adventure' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Comedy' })).toBeInTheDocument();
  });

  it('shows the currently selected genre', () => {
    setup('28'); // genre id 28 = Action
    expect(screen.getByRole('combobox')).toHaveValue('28');
  });

  it('calls onChange with the new genre id when selection changes', async () => {
    const user = userEvent.setup();
    const { onChange } = setup('');

    await user.selectOptions(screen.getByRole('combobox'), '35'); // Comedy

    expect(onChange).toHaveBeenCalledWith('35');
  });

});
