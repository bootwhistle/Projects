import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Skeleton, Button, Chip,
} from '@mui/material';
import DeleteIcon        from '@mui/icons-material/Delete';
import OpenInNewIcon     from '@mui/icons-material/OpenInNew';
import StarIcon          from '@mui/icons-material/Star';
import TrendingUpIcon    from '@mui/icons-material/TrendingUp';
import TrendingDownIcon  from '@mui/icons-material/TrendingDown';
import { useNavigate }   from 'react-router-dom';

import { useApp }        from '../context/AppContext';
import { fetchQuotes }   from '../services/alphaVantage';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatters';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useApp();
  const navigate = useNavigate();
  const [quotes,  setQuotes]  = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!watchlist.length) return;
    setLoading(true);
    fetchQuotes(watchlist).then(data => {
      setQuotes(data);
      setLoading(false);
    });
  }, [watchlist]);

  if (!watchlist.length) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <StarIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Your watchlist is empty</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Search for a stock and click the star icon to track it here.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>Browse Stocks</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Watchlist <Chip label={`${watchlist.length} stocks`} size="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell>
              <TableCell align="right">Change %</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? watchlist.map(sym => (
                  <TableRow key={sym}>
                    {[1,2,3,4,5].map(i => (
                      <TableCell key={i}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              : quotes.map(q => {
                  const isPos  = q.changePercent >= 0;
                  const color  = getChangeColor(q.changePercent);
                  return (
                    <TableRow
                      key={q.symbol}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/stock/${q.symbol}`)}
                    >
                      <TableCell>
                        <Box>
                          <Typography fontWeight={700}>{q.symbol}</Typography>
                          <Typography variant="caption" color="text.secondary">{q.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>{formatCurrency(q.price)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                          {isPos ? <TrendingUpIcon color="success" fontSize="small" /> : <TrendingDownIcon color="error" fontSize="small" />}
                          <Typography color={`${color}.main`} fontWeight={600}>
                            {isPos ? '+' : ''}{formatCurrency(q.change, 2)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={formatPercent(q.changePercent)}
                          color={color}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => navigate(`/stock/${q.symbol}`)}>
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove from watchlist">
                          <IconButton size="small" color="error" onClick={() => removeFromWatchlist(q.symbol)}>
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
    </Container>
  );
}
