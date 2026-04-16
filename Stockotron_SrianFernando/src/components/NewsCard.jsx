import React from 'react';
import {
  Card, CardContent, CardActionArea,
  Typography, Box, Chip,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { formatDateTime } from '../utils/formatters';

const SENTIMENT_COLORS = {
  bullish: 'success',
  bearish: 'error',
  neutral: 'default',
};

/**
 * News article card.
 * Props:
 *   article: { id, title, summary, source, url, publishedAt, sentiment, isBreaking }
 */
export default function NewsCard({ article }) {
  const sentimentColor = SENTIMENT_COLORS[article.sentiment] || 'default';

  return (
    <Card>
      <CardActionArea
        component="a"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent>
          {/* Header row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {article.isBreaking && (
              <Chip
                icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important' }} />}
                label="BREAKING"
                color="error"
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.68rem', height: 20 }}
              />
            )}
            <Chip
              label={article.sentiment?.toUpperCase()}
              color={sentimentColor}
              size="small"
              sx={{ fontWeight: 600, fontSize: '0.68rem', height: 20 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {article.source} · {formatDateTime(article.publishedAt)}
            </Typography>
          </Box>

          {/* Title */}
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            {article.title}
          </Typography>

          {/* Summary */}
          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.summary}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
