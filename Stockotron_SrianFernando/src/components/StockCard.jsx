import React from 'react';
import {
  Card, CardActionArea, CardContent,
  Typography, Box, Chip,
} from '@mui/material';
import TrendingUpIcon   from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatters';

/**
 * Compact card showing a single stock quote.
 * Clicking navigates to /stock/:symbol.
 *
 * Props:
 *   stock: { symbol, name, price, change, changePercent }
 *   actions?: React node rendered in the card footer (e.g. watchlist button)
 */
export default function StockCard({ stock, actions }) {
  const navigate    = useNavigate();
  const isPositive  = stock.changePercent >= 0;
  const color       = getChangeColor(stock.changePercent);
  const TrendIcon   = isPositive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/stock/${stock.symbol}`)}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {stock.symbol}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140, display: 'block' }}>
                {stock.name}
              </Typography>
            </Box>
            <Chip
              icon={<TrendIcon fontSize="small" />}
              label={formatPercent(stock.changePercent)}
              color={color}
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>

          <Typography variant="h5" fontWeight={700} sx={{ mt: 1.5 }}>
            {formatCurrency(stock.price)}
          </Typography>

          <Typography variant="body2" color={`${color}.main`} sx={{ mt: 0.5 }}>
            {isPositive ? '+' : ''}{formatCurrency(stock.change, 2)} today
          </Typography>
        </CardContent>
      </CardActionArea>

      {actions && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          {actions}
        </Box>
      )}
    </Card>
  );
}
