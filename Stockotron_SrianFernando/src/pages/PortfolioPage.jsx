import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Paper, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Skeleton, Button, Chip, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Autocomplete,
} from '@mui/material';
import DeleteIcon        from '@mui/icons-material/Delete';
import AddIcon           from '@mui/icons-material/Add';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon    from '@mui/icons-material/TrendingUp';
import TrendingDownIcon  from '@mui/icons-material/TrendingDown';
import { useNavigate }   from 'react-router-dom';

import { useApp }         from '../context/AppContext';
import { fetchQuotes }    from '../services/alphaVantage';
import { POPULAR_SYMBOLS, MOCK_QUOTES } from '../utils/mockData';
import {
  formatCurrency, formatPercent, getChangeColor,
  calcPortfolioValue, calcGainLoss, calcGainLossPercent,
} from '../utils/formatters';

const SummaryCard = ({ label, value, color }) => (
  <Paper sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="h5" fontWeight={700} color={color || 'text.primary'} sx={{ mt: 0.5 }}>
      {value}
    </Typography>
  </Paper>
);

export default function PortfolioPage() {
  const { portfolio, addHolding, removeHolding } = useApp();
  const navigate = useNavigate();

  const [liveQuotes, setLiveQuotes] = useState({});
  const [loading,    setLoading]    = useState(false);
  const [dlgOpen,    setDlgOpen]    = useState(false);

  // New holding dialog state
  const [selSymbol,  setSelSymbol]  = useState(null);
  const [qty,        setQty]        = useState('');
  const [buyPrice,   setBuyPrice]   = useState('');

  useEffect(() => {
    if (!portfolio.length) return;
    setLoading(true);
    const symbols = portfolio.map(h => h.symbol);
    fetchQuotes(symbols).then(quotes => {
      const map = {};
      quotes.forEach(q => { map[q.symbol] = q; });
      setLiveQuotes(map);
      setLoading(false);
    });
  }, [portfolio]);

  const enriched = portfolio.map(h => {
    const live = liveQuotes[h.symbol];
    const currentPrice = live?.price ?? h.purchasePrice;
    return {
      ...h,
      currentPrice,
      gainLoss:        calcGainLoss({ ...h, currentPrice }),
      gainLossPercent: calcGainLossPercent(h.purchasePrice, currentPrice),
      totalValue:      currentPrice * h.quantity,
    };
  });

  const totalValue  = calcPortfolioValue(enriched.map(h => ({ currentPrice: h.currentPrice, quantity: h.quantity })));
  const totalCost   = enriched.reduce((s, h) => s + h.purchasePrice * h.quantity, 0);
  const totalGL     = totalValue - totalCost;
  const totalGLPct  = totalCost > 0 ? (totalGL / totalCost) * 100 : 0;

  const handleAdd = () => {
    if (!selSymbol || !qty || !buyPrice) return;
    const mock = MOCK_QUOTES[selSymbol.symbol];
    addHolding({
      symbol:        selSymbol.symbol,
      name:          mock?.name || selSymbol.name || selSymbol.symbol,
      quantity:      parseFloat(qty),
      purchasePrice: parseFloat(buyPrice),
      currentPrice:  mock?.price || parseFloat(buyPrice),
    });
    setDlgOpen(false);
    setSelSymbol(null); setQty(''); setBuyPrice('');
  };

  if (!portfolio.length) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <AccountBalanceIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Your portfolio is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Add your first holding to start tracking performance.
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDlgOpen(true)}>
          Add Holding
        </Button>

        <AddDialog
          open={dlgOpen} onClose={() => setDlgOpen(false)}
          selSymbol={selSymbol} setSelSymbol={setSelSymbol}
          qty={qty} setQty={setQty} buyPrice={buyPrice} setBuyPrice={setBuyPrice}
          onAdd={handleAdd}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Portfolio</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDlgOpen(true)}>
          Add Holding
        </Button>
      </Box>

      {/* Summary row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard label="Total Value"    value={formatCurrency(totalValue)} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            label="Total Gain / Loss"
            value={`${totalGL >= 0 ? '+' : ''}${formatCurrency(totalGL)}`}
            color={totalGL >= 0 ? 'success.main' : 'error.main'}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            label="Return"
            value={formatPercent(totalGLPct)}
            color={totalGLPct >= 0 ? 'success.main' : 'error.main'}
          />
        </Grid>
      </Grid>

      {/* Holdings table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Shares</TableCell>
              <TableCell align="right">Avg Cost</TableCell>
              <TableCell align="right">Current</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Gain/Loss</TableCell>
              <TableCell align="right">Return</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? portfolio.map(h => (
                  <TableRow key={h.symbol}>
                    {[1,2,3,4,5,6,7,8].map(i => <TableCell key={i}><Skeleton /></TableCell>)}
                  </TableRow>
                ))
              : enriched.map(h => {
                  const color = getChangeColor(h.gainLoss);
                  const isPos = h.gainLoss >= 0;
                  return (
                    <TableRow
                      key={h.symbol}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/stock/${h.symbol}`)}
                    >
                      <TableCell>
                        <Typography fontWeight={700}>{h.symbol}</Typography>
                        <Typography variant="caption" color="text.secondary">{h.name}</Typography>
                      </TableCell>
                      <TableCell align="right">{h.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(h.purchasePrice)}</TableCell>
                      <TableCell align="right">{formatCurrency(h.currentPrice)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(h.totalValue)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          {isPos ? <TrendingUpIcon color="success" fontSize="small" /> : <TrendingDownIcon color="error" fontSize="small" />}
                          <Typography color={`${color}.main`} fontWeight={600}>
                            {isPos ? '+' : ''}{formatCurrency(h.gainLoss)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={formatPercent(h.gainLossPercent)}
                          color={color}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <Tooltip title="Remove holding">
                          <IconButton size="small" color="error" onClick={() => removeHolding(h.symbol)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
            }
          </TableBody>
        </Table>
      </TableContainer>

      <AddDialog
        open={dlgOpen} onClose={() => setDlgOpen(false)}
        selSymbol={selSymbol} setSelSymbol={setSelSymbol}
        qty={qty} setQty={setQty} buyPrice={buyPrice} setBuyPrice={setBuyPrice}
        onAdd={handleAdd}
      />
    </Container>
  );
}

// ─── Add Holding Dialog ───────────────────────────────────────────────────────
function AddDialog({ open, onClose, selSymbol, setSelSymbol, qty, setQty, buyPrice, setBuyPrice, onAdd }) {
  const symbolOptions = POPULAR_SYMBOLS.map(s => ({ symbol: s, name: MOCK_QUOTES[s]?.name || s }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Add Holding</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Autocomplete
          options={symbolOptions}
          getOptionLabel={o => `${o.symbol} — ${o.name}`}
          value={selSymbol}
          onChange={(_, v) => setSelSymbol(v)}
          renderInput={params => <TextField {...params} label="Stock Symbol" fullWidth />}
          isOptionEqualToValue={(a, b) => a.symbol === b.symbol}
          freeSolo={false}
        />
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
          inputProps={{ min: 0, step: 0.01 }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onAdd} disabled={!selSymbol || !qty || !buyPrice}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
