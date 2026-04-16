/**
 * alphaVantage.js
 * Alpha Vantage API service with localStorage caching and mock data fallback.
 *
 * Cache TTL: 5 minutes for quotes, 24 hours for overviews.
 * Falls back to mock data if the API key is "demo", rate limited, or offline.
 */

import {
  MOCK_QUOTES,
  MOCK_OVERVIEW,
  generateMockHistory,
  MOCK_NEWS,
  getNewsForSymbol,
} from '../utils/mockData';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';
const CACHE_PREFIX = 'ss_av_';

// Cache TTLs in milliseconds
const TTL_QUOTE    = 5  * 60 * 1000;  //  5 min
const TTL_OVERVIEW = 24 * 60 * 60 * 1000; // 24 hr
const TTL_HISTORY  = 60 * 60 * 1000;  //  1 hr
const TTL_SEARCH   = 10 * 60 * 1000;  // 10 min
const TTL_NEWS     = 15 * 60 * 1000;  // 15 min

// ─── Cache helpers ────────────────────────────────────────────────────────────
const cacheSet = (key, data) => {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ ts: Date.now(), data }));
  } catch (_) { /* storage quota — silently ignore */ }
};

const cacheGet = (key, ttl) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > ttl) return null;
    return data;
  } catch (_) {
    return null;
  }
};

// ─── Fetch with error handling ────────────────────────────────────────────────
const avFetch = async (params) => {
  const url = new URL(BASE_URL);
  url.searchParams.set('apikey', API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();

  // Alpha Vantage returns these strings on errors / rate limiting
  if (json['Note'] || json['Information'] || json['Error Message']) {
    throw new Error(json['Note'] || json['Information'] || json['Error Message']);
  }
  return json;
};

const isDemoKey = () => !API_KEY || API_KEY === 'demo';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch real-time quote for a symbol.
 * Returns a normalised object: { symbol, name, price, change, changePercent, volume }
 */
export const fetchQuote = async (symbol) => {
  const cacheKey = `quote_${symbol}`;
  const cached = cacheGet(cacheKey, TTL_QUOTE);
  if (cached) return cached;

  if (isDemoKey()) return MOCK_QUOTES[symbol] || null;

  try {
    const json = await avFetch({ function: 'GLOBAL_QUOTE', symbol });
    const q = json['Global Quote'];
    if (!q || !q['05. price']) throw new Error('Empty quote');

    const result = {
      symbol,
      name: symbol,
      price:         parseFloat(q['05. price']),
      change:        parseFloat(q['09. change']),
      changePercent: parseFloat(q['10. change percent']),
      volume:        parseInt(q['06. volume'], 10),
    };
    cacheSet(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[AlphaVantage] quote fallback for ${symbol}:`, err.message);
    return MOCK_QUOTES[symbol] || null;
  }
};

/**
 * Fetch multiple quotes in parallel (rate-limit friendly by caching).
 * @param {string[]} symbols
 */
export const fetchQuotes = async (symbols) => {
  const results = await Promise.all(symbols.map(fetchQuote));
  return results.filter(Boolean);
};

/**
 * Fetch company overview (sector, PE, market cap, description, etc.)
 */
export const fetchOverview = async (symbol) => {
  const cacheKey = `overview_${symbol}`;
  const cached = cacheGet(cacheKey, TTL_OVERVIEW);
  if (cached) return cached;

  if (isDemoKey()) return MOCK_OVERVIEW[symbol] || null;

  try {
    const json = await avFetch({ function: 'OVERVIEW', symbol });
    if (!json.Symbol) throw new Error('Empty overview');

    const result = {
      symbol:        json.Symbol,
      name:          json.Name,
      description:   json.Description,
      sector:        json.Sector,
      industry:      json.Industry,
      marketCap:     parseFloat(json.MarketCapitalization) || 0,
      peRatio:       parseFloat(json.PERatio) || 0,
      eps:           parseFloat(json.EPS) || 0,
      week52High:    parseFloat(json['52WeekHigh']) || 0,
      week52Low:     parseFloat(json['52WeekLow']) || 0,
      dividendYield: parseFloat(json.DividendYield) || 0,
    };
    cacheSet(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[AlphaVantage] overview fallback for ${symbol}:`, err.message);
    return MOCK_OVERVIEW[symbol] || null;
  }
};

/**
 * Fetch 30-day daily close history for a symbol.
 * Returns an array of { date, close, open, high, low } sorted oldest-first.
 */
export const fetchHistory = async (symbol) => {
  const cacheKey = `history_${symbol}`;
  const cached = cacheGet(cacheKey, TTL_HISTORY);
  if (cached) return cached;

  if (isDemoKey()) {
    const mock = generateMockHistory(symbol);
    cacheSet(cacheKey, mock);
    return mock;
  }

  try {
    const json = await avFetch({ function: 'TIME_SERIES_DAILY', symbol, outputsize: 'compact' });
    const ts = json['Time Series (Daily)'];
    if (!ts) throw new Error('No time series data');

    const result = Object.entries(ts)
      .slice(0, 30)
      .map(([date, v]) => ({
        date,
        close: parseFloat(v['4. close']),
        open:  parseFloat(v['1. open']),
        high:  parseFloat(v['2. high']),
        low:   parseFloat(v['3. low']),
      }))
      .reverse(); // oldest first

    cacheSet(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[AlphaVantage] history fallback for ${symbol}:`, err.message);
    const mock = generateMockHistory(symbol);
    cacheSet(cacheKey, mock);
    return mock;
  }
};

/**
 * Search for stocks by keyword.
 * Returns [{ symbol, name, type, region, currency }]
 */
export const searchSymbols = async (query) => {
  if (!query || query.length < 1) return [];

  const cacheKey = `search_${query.toLowerCase()}`;
  const cached = cacheGet(cacheKey, TTL_SEARCH);
  if (cached) return cached;

  if (isDemoKey()) {
    // Simple local filter against known mock symbols
    const q = query.toUpperCase();
    return Object.values(MOCK_QUOTES)
      .filter(s => s.symbol.includes(q) || s.name.toUpperCase().includes(q))
      .map(s => ({ symbol: s.symbol, name: s.name, type: 'Equity', region: 'United States', currency: 'USD' }));
  }

  try {
    const json = await avFetch({ function: 'SYMBOL_SEARCH', keywords: query });
    const matches = (json.bestMatches || []).map(m => ({
      symbol:   m['1. symbol'],
      name:     m['2. name'],
      type:     m['3. type'],
      region:   m['4. region'],
      currency: m['8. currency'],
    }));
    cacheSet(cacheKey, matches);
    return matches;
  } catch (err) {
    console.warn('[AlphaVantage] search fallback:', err.message);
    return [];
  }
};

/**
 * Fetch market news. If a symbol is provided, filters to relevant articles.
 * Returns array of news article objects.
 */
export const fetchNews = async (symbol = null) => {
  const cacheKey = `news_${symbol || 'general'}`;
  const cached = cacheGet(cacheKey, TTL_NEWS);
  if (cached) return cached;

  if (isDemoKey()) {
    return symbol ? getNewsForSymbol(symbol) : MOCK_NEWS;
  }

  try {
    const params = { function: 'NEWS_SENTIMENT' };
    if (symbol) params.tickers = symbol;
    const json = await avFetch(params);
    const feed = (json.feed || []).slice(0, 10).map((a, i) => ({
      id:             i + 1,
      title:          a.title,
      summary:        a.summary,
      source:         a.source,
      url:            a.url,
      publishedAt:    new Date(a.time_published).getTime(),
      sentiment:      a.overall_sentiment_label?.toLowerCase().includes('bull') ? 'bullish'
                    : a.overall_sentiment_label?.toLowerCase().includes('bear') ? 'bearish'
                    : 'neutral',
      isBreaking:     false,
      relatedSymbols: (a.ticker_sentiment || []).map(t => t.ticker),
    }));
    cacheSet(cacheKey, feed);
    return feed;
  } catch (err) {
    console.warn('[AlphaVantage] news fallback:', err.message);
    return symbol ? getNewsForSymbol(symbol) : MOCK_NEWS;
  }
};
