import React, { useEffect, useState } from 'react';
import {
  Container, Grid, Box, Typography, Button, Chip,
  Paper, Divider, Skeleton, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon       from '@mui/icons-material/ArrowBack';
import StarIcon            from '@mui/icons-material/Star';
import StarBorderIcon      from '@mui/icons-material/StarBorder';
import AddIcon             from '@mui/icons-material/Add';
import ShareIcon           from '@mui/icons-material/Share';
import TrendingUpIcon      from '@mui/icons-material/TrendingUp';
import TrendingDownIcon    from '@mui/icons-material/TrendingDown';

import StockChart          from '../components/StockChart';
import NewsCard            from '../components/NewsCard';
import ChatWidget          from '../components/ChatWidget';
import { fetchQuote, fetchOverview, fetchHistory, fetchNews } from '../services/alphaVantage';
import { shareStockToChat } from '../services/firebase';
import { useApp }          from '../context/AppContext';
import { formatCurrency, formatCompact, formatPercent, getChangeColor } from '../utils/formatters';

const StatRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={600}>{value}</Typography>
  </Box>
);

export default function StockDetailsPage() {
  const { symbol }   = useParams();
  const navigate     = useNavigate();
  const { addToWatchlist, removeFromWatchlist, isWatched, addHolding, isInPortfolio, username } = useApp();

  const [quote,   setQuote]   = useState(null);
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [news,    setNews]    = useState([]);
  const [loading, setLoading] = useState(true);

  // Add to portfolio dialog
  const [dlgOpen,   setDlgOpen]   = useState(false);
  const [qty,       setQty]       = useState('');
  const [buyPrice,  setBuyPrice]  = useState('');

  // Share snackbar
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setLoading(true);
    const sym = symbol.toUpperCase();
    Promise.all([
      fetchQuote(sym),
      fetchOverview(sym),
      fetchHistory(sym),
      fetchNews(sym),
    ]).then(([q, ov, hist, n]) => {
      setQuote(q);
      setOverview(ov);
      setHistory(hist);
      setNews(n);
      setLoading(false);
    });
  }, [symbol]);

  const handleAddHolding = () => {
    if (!qty || !buyPrice) return;
    addHolding({
      symbol:        symbol.toUpperCase(),
      name:          overview?.name || symbol.toUpperCase(),
      quantity:      parseFloat(qty),
      purchasePrice: parseFloat(buyPrice),
      currentPrice:  quote?.price || parseFloat(buyPrice),
    });
    setDlgOpen(false);
    setQty('');
    setBuyPrice('');
  };

  const handleShare = async () => {
    if (!quote || !username) return;
    try {
      await shareStockToChat('general', username, quote);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch (_) {}
  };

  const sym = symbol.toUpperCase();
  const color = quote ? getChangeColor(quote.changePercent) : 'default';
  const isPos = quote ? quote.changePercent >= 0 : true;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back button */}
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2, color: 'text.secondary' }}>
        Back
      </Button>

      {loading ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rounded" height={380} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rounded" height={380} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {/* ── Left column ── */}
          <Grid item xs={12} md={8}>
            {/* Price header */}
            <Paper sx={{ p: 3, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" fontWeight={800}>{sym}</Typography>
                    <Chip label={overview?.sector || 'Equity'} size="small" variant="outlined" />
                  </Box>
                  <Typography color="text.secondary">{overview?.name}</Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={isWatched(sym) ? 'Remove from watchlist' : 'Add to watchlist'}>
                    <IconButton color="primary" onClick={() =>
                      isWatched(sym) ? removeFromWatchlist(sym) : addToWatchlist(sym)
                    }>
                      {isWatched(sym) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isInPortfolio(sym) ? 'Already in portfolio' : 'Add to portfolio'}>
                    <IconButton color="secondary" onClick={() => setDlgOpen(true)}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={shared ? 'Shared to #general!' : 'Share to chat'}>
                    <IconButton color={shared ? 'success' : 'default'} onClick={handleShare}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Price */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="h3" fontWeight={800}>
                  {formatCurrency(quote?.price)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isPos ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                  <Typography color={`${color}.main`} fontWeight={700} variant="h6">
                    {isPos ? '+' : ''}{formatCurrency(quote?.change, 2)} ({formatPercent(quote?.changePercent)})
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Chart */}
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>30-Day Price History</Typography>
              <StockChart data={history} height={260} />
            </Paper>

            {/* About */}
            {overview?.description && (
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>About {overview.name}</Typography>
                <Typography variant="body2" color="text.secondary">{overview.description}</Typography>
              </Paper>
            )}

            {/* News */}
            {news.length > 0 && (
              <Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>Related News</Typography>
                <Grid container spacing={2}>
                  {news.map(a => (
                    <Grid item xs={12} key={a.id}>
                      <NewsCard article={a} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* ── Right column ── */}
          <Grid item xs={12} md={4}>
            {/* Key stats */}
            {overview && (
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>Key Statistics</Typography>
                <Divider sx={{ mb: 1 }} />
                <StatRow label="Market Cap"      value={formatCompact(overview.marketCap)} />
                <StatRow label="P/E Ratio"       value={overview.peRatio?.toFixed(1) || 'N/A'} />
                <StatRow label="EPS"             value={formatCurrency(overview.eps)} />
                <StatRow label="52W High"        value={formatCurrency(overview.week52High)} />
                <StatRow label="52W Low"         value={formatCurrency(overview.week52Low)} />
                <StatRow label="Volume"          value={formatCompact(quote?.volume)} />
                <StatRow label="Dividend Yield"  value={overview.dividendYield ? `${overview.dividendYield}%` : 'None'} />
                <StatRow label="Industry"        value={overview.industry || '—'} />
              </Paper>
            )}

            {/* Chat widget */}
            <ChatWidget symbol={sym} />
          </Grid>
        </Grid>
      )}

      {/* Add to Portfolio Dialog */}
      <Dialog open={dlgOpen} onClose={() => setDlgOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add {sym} to Portfolio</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Quantity (shares)"
            type="number"
            value={qty}
            onChange={e => setQty(e.target.value)}
            inputProps={{ min: 0.001, step: 0.001 }}
            fullWidth
          />
          <TextField
            label="Purchase Price (USD)"
            type="number"
            value={buyPrice}
            onChange={e => setBuyPrice(e.target.value)}
            placeholder={quote?.price?.toFixed(2)}
            inputProps={{ min: 0, step: 0.01 }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDlgOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddHolding} disabled={!qty || !buyPrice}>
            Add Holding
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
