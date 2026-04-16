import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, TextField, InputAdornment,
  Grid, IconButton, Skeleton, Tooltip, Paper,
} from '@mui/material';
import SearchIcon   from '@mui/icons-material/Search';
import StarIcon     from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useNavigate } from 'react-router-dom';

import StockCard from '../components/StockCard';
import NewsCard  from '../components/NewsCard';
import { fetchQuotes, searchSymbols, fetchNews } from '../services/alphaVantage';
import { useApp } from '../context/AppContext';
import { POPULAR_SYMBOLS } from '../utils/mockData';

export default function LandingPage() {
  const navigate = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isWatched } = useApp();

  const [popularStocks, setPopularStocks] = useState([]);
  const [news,          setNews]          = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingNews,   setLoadingNews]   = useState(true);

  const [query,         setQuery]         = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching,     setSearching]     = useState(false);

  // Load popular stocks on mount
  useEffect(() => {
    fetchQuotes(POPULAR_SYMBOLS).then(quotes => {
      setPopularStocks(quotes);
      setLoadingStocks(false);
    });
    fetchNews().then(articles => {
      setNews(articles);
      setLoadingNews(false);
    });
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchSymbols(query);
      setSearchResults(results.slice(0, 6));
      setSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleWatch = useCallback((symbol, e) => {
    e.stopPropagation();
    isWatched(symbol) ? removeFromWatchlist(symbol) : addToWatchlist(symbol);
  }, [isWatched, addToWatchlist, removeFromWatchlist]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          Your <span style={{ color: '#3d8ef8' }}>Stock</span>otron
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 560, mx: 'auto' }}>
          Real-time market data, portfolio tracking, and social stock discussion — all in one place.
        </Typography>

        {/* Search bar */}
        <Box sx={{ position: 'relative', maxWidth: 500, mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search stocks by symbol or name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) {
                navigate(`/stock/${query.trim().toUpperCase()}`);
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Search results dropdown */}
          {(searchResults.length > 0 || searching) && (
            <Paper sx={{
              position: 'absolute', top: '110%', left: 0, right: 0,
              zIndex: 20, borderRadius: 2, border: '1px solid',
              borderColor: 'divider', overflow: 'hidden',
            }}>
              {searching ? (
                [1,2,3].map(i => <Skeleton key={i} height={44} sx={{ mx: 2 }} />)
              ) : (
                searchResults.map(r => (
                  <Box
                    key={r.symbol}
                    sx={{
                      px: 2, py: 1.2,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => { setQuery(''); setSearchResults([]); navigate(`/stock/${r.symbol}`); }}
                  >
                    <Typography fontWeight={700} variant="body2">{r.symbol}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 260 }}>{r.name}</Typography>
                  </Box>
                ))
              )}
            </Paper>
          )}
        </Box>
      </Box>

      {/* Popular Stocks */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Popular Stocks
      </Typography>
      <Grid container spacing={2} sx={{ mb: 5 }}>
        {loadingStocks
          ? POPULAR_SYMBOLS.map(s => (
              <Grid item xs={12} sm={6} md={3} key={s}>
                <Skeleton variant="rounded" height={130} />
              </Grid>
            ))
          : popularStocks.map(stock => (
              <Grid item xs={12} sm={6} md={3} key={stock.symbol}>
                <StockCard
                  stock={stock}
                  actions={
                    <Tooltip title={isWatched(stock.symbol) ? 'Remove from watchlist' : 'Add to watchlist'}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => toggleWatch(stock.symbol, e)}
                      >
                        {isWatched(stock.symbol) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  }
                />
              </Grid>
            ))
        }
      </Grid>

      {/* Market News */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Market News
      </Typography>
      <Grid container spacing={2}>
        {loadingNews
          ? [1,2,3,4].map(i => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rounded" height={130} />
              </Grid>
            ))
          : news.map(article => (
              <Grid item xs={12} sm={6} key={article.id}>
                <NewsCard article={article} />
              </Grid>
            ))
        }
      </Grid>
    </Container>
  );
}
