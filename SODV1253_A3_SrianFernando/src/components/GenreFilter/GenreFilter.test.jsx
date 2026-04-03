import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenreFilter from './GenreFilter';

const genres = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
];

describe('GenreFilter', () => {
  it('always renders the "All Genres" default option', () => {
    render(<GenreFilter genres={genres} selected="" onChange={() => {}} />);
    expect(screen.getByRole('option', { name: 'All Genres' })).toBeInTheDocument();
  });

  it('renders one option per genre', () => {
    render(<GenreFilter genres={genres} selected="" onChange={() => {}} />);
    expect(screen.getByRole('option', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Comedy' })).toBeInTheDocument();
  });

  it('shows the currently selected genre in the dropdown', () => {
    render(<GenreFilter genres={genres} selected="28" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('28');
  });

  it('calls onChange with the new genre id when a genre is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<GenreFilter genres={genres} selected="" onChange={handleChange} />);
    await user.selectOptions(screen.getByRole('combobox'), '28');
    expect(handleChange).toHaveBeenCalledWith('28');
  });

  it('renders an accessible Genre label linked to the select', () => {
    render(<GenreFilter genres={genres} selected="" onChange={() => {}} />);
    expect(screen.getByLabelText('Genre')).toBeInTheDocument();
  });
});
