import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';

const LandingPage      = lazy(() => import('./pages/LandingPage'));
const StockDetailsPage = lazy(() => import('./pages/StockDetailsPage'));
const WatchlistPage    = lazy(() => import('./pages/WatchlistPage'));
const PortfolioPage    = lazy(() => import('./pages/PortfolioPage'));
const ChatPage         = lazy(() => import('./pages/ChatPage'));
const ComparePage      = lazy(() => import('./pages/ComparePage'));

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    <CircularProgress />
  </Box>
);

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"            element={<LandingPage />} />
          <Route path="/stock/:symbol" element={<StockDetailsPage />} />
          <Route path="/watchlist"   element={<WatchlistPage />} />
          <Route path="/portfolio"   element={<PortfolioPage />} />
          <Route path="/chat"        element={<ChatPage />} />
          <Route path="/compare"     element={<ComparePage />} />
        </Routes>
      </Suspense>
    </Box>
  );
}
