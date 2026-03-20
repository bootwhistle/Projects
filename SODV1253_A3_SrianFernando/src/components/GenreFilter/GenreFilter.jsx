/**
 * GenreFilter — a select dropdown for filtering movies by genre.
 *
 * Props:
 *   genres   {Array}    — [{ id, name }] from TMDB genre list
 *   selected {string}   — currently selected genre id ('' for all)
 *   onChange {function} — called with new genre id string
 */
import styles from './GenreFilter.module.css';

export default function GenreFilter({ genres, selected, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="genre-select" className={styles.label}>
        Genre
      </label>
      <select
        id="genre-select"
        className={styles.select}
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={String(genre.id)}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}
