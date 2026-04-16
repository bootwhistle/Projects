/**
 * ComparePage.jsx — BONUS FEATURE
 * Compare multiple stocks on a single normalized performance chart.
 * Normalises each stock to 100 at day 0 so you can compare growth %.
 */
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Chip,
  TextField, IconButton, Tooltip, Skeleton, Button, Grid,
} from '@mui/material';
import AddIcon    from '@mui/icons-material/Add';
import CloseIcon  from '@mui/icons-material/Close';
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend,
} from 'recharts';
import { useTheme } from '@mui/material/styles';

import { fetchHistory }   from '../services/alphaVantage';
import { formatShortDate } from '../utils/formatters';
import { POPULAR_SYMBOLS } from '../utils/mockData';

// Distinct colors for each series
const SERIES_COLORS = [
  '#3d8ef8', '#00c9a7', '#ffc107', '#ff5252',
  '#e040fb', '#26c97a', '#ff9800', '#00bcd4',
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 140 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      {payload.map(p => (
        <Box key={p.dataKey} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" fontWeight={700} sx={{ color: p.color }}>{p.dataKey}</Typography>
          <Typography variant="caption">{p.value?.toFixed(2)}%</Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default function ComparePage() {
  const theme = useTheme();
  const [symbols,   setSymbols]   = useState(['AAPL', 'MSFT']);
  const [inputSym,  setInputSym]  = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading,   setLoading]   = useState(false);

  // Re-fetch whenever symbol list changes
  useEffect(() => {
    if (!symbols.length) { setChartData([]); return; }
    setLoading(true);

    Promise.all(symbols.map(s => fetchHistory(s).then(hist => ({ symbol: s, hist }))))
      .then(results => {
        // Build a date-indexed map
        const dateMap = {};
        results.forEach(({ symbol, hist }) => {
          hist.forEach(d => {
            if (!dateMap[d.date]) dateMap[d.date] = { date: d.date, label: formatShortDate(d.date) };
            dateMap[d.date][symbol] = d.close;
          });
        });

        const sorted = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

        // Normalise to 100 at first data point
        const baselines = {};
        results.forEach(({ symbol, hist }) => {
          baselines[symbol] = hist[0]?.close || 1;
        });

        const normalised = sorted.map(d => {
          const row = { date: d.date, label: d.label };
          symbols.forEach(s => {
            if (d[s] != null) row[s] = parseFloat(((d[s] / baselines[s]) * 100).toFixed(3));
          });
          return row;
        });

        setChartData(normalised);
        setLoading(false);
      });
  }, [symbols]);

  const addSymbol = () => {
    const s = inputSym.trim().toUpperCase();
    if (!s || symbols.includes(s) || symbols.length >= 8) return;
    setSymbols(prev => [...prev, s]);
    setInputSym('');
  };

  const removeSymbol = (s) => setSymbols(prev => prev.filter(x => x !== s));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h4" fontWeight={700}>Compare Stocks</Typography>
        <Typography variant="body2" color="text.secondary">
          Normalized to 100 at day 0 — shows relative performance over 30 days
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {symbols.map((s, i) => (
            <Chip
              key={s}
              label={s}
              onDelete={() => removeSymbol(s)}
              deleteIcon={<CloseIcon />}
              sx={{ bgcolor: SERIES_COLORS[i % SERIES_COLORS.length], color: '#fff', fontWeight: 700 }}
            />
          ))}

          {symbols.length < 8 && (
            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
              <TextField
                size="small"
                placeholder="Add symbol…"
                value={inputSym}
                onChange={e => setInputSym(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && addSymbol()}
                sx={{ width: 130 }}
                inputProps={{ maxLength: 5 }}
              />
              <Tooltip title="Add to comparison">
                <IconButton color="primary" onClick={addSymbol} disabled={!inputSym.trim()}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Quick-add popular */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>Quick add:</Typography>
          {POPULAR_SYMBOLS.filter(s => !symbols.includes(s)).map(s => (
            <Chip key={s} label={s} size="small" onClick={() => setSymbols(prev => [...prev, s])} clickable variant="outlined" />
          ))}
        </Box>
      </Paper>

      {/* Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Performance (Indexed, Base = 100)
        </Typography>

        {loading ? (
          <Skeleton variant="rounded" height={380} />
        ) : chartData.length === 0 ? (
          <Box sx={{ height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Add at least one symbol to compare</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="label"
                tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v.toFixed(0)}`}
                width={48}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 16, fontSize: 13 }} />
              {symbols.map((s, i) => (
                <Line
                  key={s}
                  type="monotone"
                  dataKey={s}
                  stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Explanation */}
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'action.hover' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>How to read this chart:</strong> All stocks start at 100 on the first date.
          A value of 110 means +10% growth from that baseline; 90 means −10%.
          This lets you compare percentage performance regardless of share price.
        </Typography>
      </Paper>
    </Container>
  );
}
