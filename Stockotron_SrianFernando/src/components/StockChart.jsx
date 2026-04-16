import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { formatCurrency, formatShortDate } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      p: 1.5,
      fontSize: '0.82rem',
    }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>
        {formatCurrency(payload[0].value)}
      </Typography>
    </Box>
  );
};

/**
 * Area chart for 30-day price history.
 *
 * Props:
 *   data: [{ date: 'YYYY-MM-DD', close: number }]
 *   height?: number (default 240)
 *   color?: string (MUI palette key or hex) — defaults to theme primary
 */
export default function StockChart({ data = [], height = 240, color }) {
  const theme = useTheme();
  const chartColor = color || theme.palette.primary.main;

  if (!data.length) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">No price data available</Typography>
      </Box>
    );
  }

  // Determine if the stock trended up or down over the period
  const first = data[0]?.close ?? 0;
  const last  = data[data.length - 1]?.close ?? 0;
  const trendColor = last >= first ? theme.palette.success.main : theme.palette.error.main;
  const lineColor  = color || trendColor;

  const formatted = data.map(d => ({
    ...d,
    label: formatShortDate(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={formatted} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={lineColor} stopOpacity={0.25} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />

        <XAxis
          dataKey="label"
          tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />

        <YAxis
          domain={['auto', 'auto']}
          tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v.toFixed(0)}`}
          width={55}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="close"
          stroke={lineColor}
          strokeWidth={2}
          fill="url(#colorGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
