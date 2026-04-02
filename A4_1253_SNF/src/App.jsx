/**
 * App.jsx 
 *
 * Architecture decision:
 *   HomePage is ALWAYS rendered 
 *   When the URL matches /movie/:id, React Router also renders MovieDetailsPage.
 *   MovieDetailsPage uses React.createPortal to render a full-screen overlay
 *   into #portal-root (outside #root), layering on top of the home page.
 *   
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage/MovieDetailsPage';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        {/* Home page is always mounted as the SPA shell */}
        <HomePage />

        {/* MovieDetailsPage only mounts when URL is /movie/:id.
            It renders via createPortal, so it visually overlays the home page. */}
        <Routes>
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
