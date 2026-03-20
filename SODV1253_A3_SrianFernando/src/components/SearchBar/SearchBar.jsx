/**
 * SearchBar — controlled text input with a clear button.
 *
 * Props:
 *   value      {string}   — current search query (controlled)
 *   onChange   {function} — called with the new string value
 *   placeholder {string}  — input placeholder text
 */
import styles from './SearchBar.module.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search movies by title…',
}) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">🔍</span>

      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
      />

      {value && (
        <button
          className={styles.clearBtn}
          onClick={() => onChange('')}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}
