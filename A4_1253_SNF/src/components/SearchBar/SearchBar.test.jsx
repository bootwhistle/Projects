/**
 * SearchBar.test.jsx
 *
 * Tests for the SearchBar component.
 * We check: rendering, typing, clear button visibility, and clear action.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

// ── Helper ───────────────────────────────────────────────────────────────────
// A simple wrapper that renders SearchBar with a given starting value.
// We use vi.fn() to create a mock function that records calls.
function setup(value = '', onChange = vi.fn()) {
  render(<SearchBar value={value} onChange={onChange} />);
  return { onChange };
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('SearchBar', () => {

  it('renders the search input', () => {
    setup();
    // getByRole finds elements by their ARIA role.
    // A text input has role="textbox".
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays the current value inside the input', () => {
    setup('batman');
    // toHaveValue checks what is currently typed in the input
    expect(screen.getByRole('textbox')).toHaveValue('batman');
  });

  it('calls onChange with the new value when the user types', async () => {
    const user = userEvent.setup();
    const { onChange } = setup('');

    // userEvent.type simulates real keyboard events
    await user.type(screen.getByRole('textbox'), 'a');

    // onChange should have been called once for the letter 'a'
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('does NOT show the clear button when value is empty', () => {
    setup('');
    // queryByRole returns null instead of throwing when element is missing
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  it('shows the clear button when value is not empty', () => {
    setup('batman');
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    const { onChange } = setup('batman');

    await user.click(screen.getByRole('button', { name: /clear search/i }));

    // Clicking clear should call onChange('') to reset the input
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows the default placeholder text', () => {
    setup();
    expect(screen.getByPlaceholderText('Search movies by title…')).toBeInTheDocument();
  });

});
