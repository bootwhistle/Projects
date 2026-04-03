import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows the current value inside the input', () => {
    render(<SearchBar value="batman" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('batman');
  });

  it('does NOT show the clear button when value is empty', () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
  });

  it('shows the clear button when value is not empty', () => {
    render(<SearchBar value="batman" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('calls onChange with the typed character', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).toHaveBeenCalledWith('a');
  });

  it('calls onChange with empty string when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<SearchBar value="batman" onChange={handleChange} />);
    await user.click(screen.getByRole('button', { name: /clear/i }));
    expect(handleChange).toHaveBeenCalledWith('');
  });

  it('uses the custom placeholder text when provided', () => {
    render(<SearchBar value="" onChange={() => {}} placeholder="Find a film…" />);
    expect(screen.getByPlaceholderText('Find a film…')).toBeInTheDocument();
  });
});
