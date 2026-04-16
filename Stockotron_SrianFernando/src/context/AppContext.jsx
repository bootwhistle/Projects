/**
 * AppContext.jsx
 * Global state for Stockotron: watchlist, portfolio holdings, and username.
 * All state is persisted to localStorage so it survives page refreshes.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

// ─── localStorage helpers ─────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  const [watchlist, setWatchlistState] = useState(() => load('ss_watchlist', []));
  const [portfolio, setPortfolioState] = useState(() => load('ss_portfolio', []));
  const [username,  setUsernameState]  = useState(() => load('ss_username',  ''));

  // Watchlist
  const addToWatchlist = useCallback((symbol) => {
    setWatchlistState(prev => {
      if (prev.includes(symbol)) return prev;
      const next = [...prev, symbol];
      save('ss_watchlist', next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlistState(prev => {
      const next = prev.filter(s => s !== symbol);
      save('ss_watchlist', next);
      return next;
    });
  }, []);

  const isWatched = useCallback(
    (symbol) => watchlist.includes(symbol),
    [watchlist],
  );

  // Portfolio
  /**
   * Add or update a holding.
   * @param {{ symbol, name, quantity, purchasePrice }} holding
   */
  const addHolding = useCallback((holding) => {
    setPortfolioState(prev => {
      const exists = prev.find(h => h.symbol === holding.symbol);
      let next;
      if (exists) {
        // Average down/up: weighted average purchase price
        const totalQty  = exists.quantity + holding.quantity;
        const avgPrice  = (exists.purchasePrice * exists.quantity + holding.purchasePrice * holding.quantity) / totalQty;
        next = prev.map(h =>
          h.symbol === holding.symbol
            ? { ...h, quantity: totalQty, purchasePrice: parseFloat(avgPrice.toFixed(4)) }
            : h
        );
      } else {
        next = [...prev, { ...holding, addedAt: Date.now() }];
      }
      save('ss_portfolio', next);
      return next;
    });
  }, []);

  const removeHolding = useCallback((symbol) => {
    setPortfolioState(prev => {
      const next = prev.filter(h => h.symbol !== symbol);
      save('ss_portfolio', next);
      return next;
    });
  }, []);

  const isInPortfolio = useCallback(
    (symbol) => portfolio.some(h => h.symbol === symbol),
    [portfolio],
  );

  // Username
  const setUsername = useCallback((name) => {
    setUsernameState(name);
    save('ss_username', name);
  }, []);

  return (
    <AppContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isWatched,
      portfolio,
      addHolding,
      removeHolding,
      isInPortfolio,
      username,
      setUsername,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};
