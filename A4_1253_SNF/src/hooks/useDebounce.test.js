/**
 * useDebounce.test.js
 *
 * Tests for the useDebounce custom hook.
 *
 * We use Vitest's fake timer API (vi.useFakeTimers) to control time without
 * actually waiting. This makes debounce tests fast and deterministic.
 */
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {

  // Set up fake timers before each test so we can control setTimeout
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // Always restore real timers after each test to avoid side effects
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    // renderHook lets us test a hook in isolation without a component
    const { result } = renderHook(() => useDebounce('hello', 400));

    // The hook should return 'hello' right away before any delay
    expect(result.current).toBe('hello');
  });

  it('does NOT update the debounced value before the delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'hello' } }
    );

    // Change the value
    rerender({ value: 'world' });

    // Advance time by only 300ms — still within the 400ms window
    act(() => vi.advanceTimersByTime(300));

    // Should still show the OLD value because 400ms hasn't passed
    expect(result.current).toBe('hello');
  });

  it('updates the debounced value after the delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });

    // Advance time past the full 400ms delay
    act(() => vi.advanceTimersByTime(400));

    // Now the debounced value should have updated
    expect(result.current).toBe('world');
  });

  it('resets the timer when the value changes before the delay finishes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => vi.advanceTimersByTime(200)); // 200ms in — not done yet

    rerender({ value: 'abc' });            // new value resets the 400ms timer
    act(() => vi.advanceTimersByTime(200)); // only 200ms since 'abc' was set

    // 'abc' timer hasn't completed yet — debounced value stays at 'a'
    expect(result.current).toBe('a');

    // Advance the remaining 200ms to complete the 'abc' timer
    act(() => vi.advanceTimersByTime(200));

    expect(result.current).toBe('abc');
  });

});
