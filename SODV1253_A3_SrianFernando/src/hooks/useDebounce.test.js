import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the initial value immediately without waiting', () => {
    const { result } = renderHook(() => useDebounce('hello', 400));
    expect(result.current).toBe('hello');
  });

  it('does NOT update the value before the delay has passed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'hello' } }
    );
    rerender({ value: 'world' });
    act(() => vi.advanceTimersByTime(300)); // only 300ms — not yet
    expect(result.current).toBe('hello');
  });

  it('updates the value after the delay has fully passed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'hello' } }
    );
    rerender({ value: 'world' });
    act(() => vi.advanceTimersByTime(400)); // exactly 400ms
    expect(result.current).toBe('world');
  });

  it('resets the delay timer when the value changes quickly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'a' } }
    );
    rerender({ value: 'b' });
    act(() => vi.advanceTimersByTime(200)); // 200ms after 'b'
    rerender({ value: 'c' });
    act(() => vi.advanceTimersByTime(200)); // only 200ms since 'c' — timer reset
    expect(result.current).toBe('a');       // still original value

    act(() => vi.advanceTimersByTime(200)); // now 400ms since 'c'
    expect(result.current).toBe('c');       // updated to final value
  });
});
