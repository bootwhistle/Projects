/**
 * formatters.js
 * Utility functions for formatting numbers, currencies, and dates
 * used throughout the Stockotron application.
 */

/**
 * Format a number as USD currency.
 * @param {number} value
 * @param {number} decimals - decimal places (default 2)
 * @returns {string} e.g. "$1,234.56"
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value == null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a large number with compact notation (e.g. 1.2B, 345M).
 * Used for market cap and volume display.
 * @param {number} value
 * @returns {string}
 */
export const formatCompact = (value) => {
  if (value == null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a percentage change value with a + or - prefix.
 * @param {number} value
 * @returns {string} e.g. "+1.23%" or "-0.45%"
 */
export const formatPercent = (value) => {
  if (value == null || isNaN(value)) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(2)}%`;
};

/**
 * Return 'success' or 'error' MUI color string based on positive/negative value.
 * @param {number} value
 * @returns {'success' | 'error'}
 */
export const getChangeColor = (value) => {
  return Number(value) >= 0 ? 'success' : 'error';
};

/**
 * Format a Unix timestamp or ISO date string as a readable short date.
 * @param {number|string} timestamp
 * @returns {string} e.g. "Apr 12"
 */
export const formatShortDate = (timestamp) => {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp)
    : new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Format a Unix timestamp as a full readable date + time.
 * @param {number} timestamp - milliseconds since epoch
 * @returns {string}
 */
export const formatDateTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate total portfolio value from holdings.
 * @param {Array} holdings - [{currentPrice, quantity}]
 * @returns {number}
 */
export const calcPortfolioValue = (holdings) => {
  return holdings.reduce((sum, h) => sum + (h.currentPrice || 0) * (h.quantity || 0), 0);
};

/**
 * Calculate total gain/loss for a portfolio holding.
 * @param {object} holding - {purchasePrice, currentPrice, quantity}
 * @returns {number}
 */
export const calcGainLoss = ({ purchasePrice, currentPrice, quantity }) => {
  return (currentPrice - purchasePrice) * quantity;
};

/**
 * Calculate percentage gain/loss.
 * @param {number} purchasePrice
 * @param {number} currentPrice
 * @returns {number}
 */
export const calcGainLossPercent = (purchasePrice, currentPrice) => {
  if (!purchasePrice) return 0;
  return ((currentPrice - purchasePrice) / purchasePrice) * 100;
};
