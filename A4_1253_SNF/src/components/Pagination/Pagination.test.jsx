/**
 * Pagination.test.jsx
 *
 * Tests for the Pagination component.
 * We check: hidden on 1 page, prev/next buttons, disabled states, active page.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

function setup(currentPage, totalPages, onPageChange = vi.fn()) {
  render(
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
  return { onPageChange };
}

describe('Pagination', () => {

  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    // Component returns null — container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders Prev and Next buttons when there are multiple pages', () => {
    setup(3, 10);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
  });

  it('disables the Prev button on the first page', () => {
    setup(1, 5);
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    setup(5, 5);
    expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
  });

  it('calls onPageChange with currentPage - 1 when Prev is clicked', async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup(3, 10);

    await user.click(screen.getByRole('button', { name: /previous page/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with currentPage + 1 when Next is clicked', async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup(3, 10);

    await user.click(screen.getByRole('button', { name: /next page/i }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange with the page number when a page button is clicked', async () => {
    const user = userEvent.setup();
    const { onPageChange } = setup(1, 5);

    // Page 3 button should be rendered (total ≤ 7 shows all pages)
    await user.click(screen.getByRole('button', { name: /page 3/i }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('marks the current page button with aria-current="page"', () => {
    setup(2, 5);
    const activeBtn = screen.getByRole('button', { name: /page 2/i });
    expect(activeBtn).toHaveAttribute('aria-current', 'page');
  });

});
