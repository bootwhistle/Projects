/**
 * mockData.js
 * Realistic fallback data used when the Alpha Vantage API is unavailable
 * (rate limited, no API key set, or offline).
 *
 * All prices approximate real values as of early 2026.
 */

// ─── Popular stocks shown on the landing page ──────────────────────────────
export const POPULAR_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

// ─── Stock quotes (current price snapshot) ─────────────────────────────────
export const MOCK_QUOTES = {
  AAPL:  { symbol: 'AAPL',  name: 'Apple Inc.',          price: 189.25, change: 2.34,  changePercent: 1.25,  volume: 58_420_100 },
  MSFT:  { symbol: 'MSFT',  name: 'Microsoft Corp.',      price: 415.32, change: 3.61,  changePercent: 0.88,  volume: 22_140_300 },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.',        price: 165.43, change: -0.57, changePercent: -0.34, volume: 19_850_200 },
  AMZN:  { symbol: 'AMZN',  name: 'Amazon.com Inc.',      price: 194.56, change: 4.10,  changePercent: 2.15,  volume: 35_760_800 },
  TSLA:  { symbol: 'TSLA',  name: 'Tesla Inc.',           price: 245.78, change: -3.89, changePercent: -1.56, volume: 98_320_500 },
  NVDA:  { symbol: 'NVDA',  name: 'NVIDIA Corp.',         price: 875.23, change: 29.14, changePercent: 3.45,  volume: 42_960_700 },
  META:  { symbol: 'META',  name: 'Meta Platforms Inc.',  price: 512.34, change: 5.70,  changePercent: 1.12,  volume: 15_430_100 },
  NFLX:  { symbol: 'NFLX',  name: 'Netflix Inc.',         price: 634.21, change: -5.01, changePercent: -0.78, volume: 8_120_400  },
};

// ─── Company overview data ──────────────────────────────────────────────────
export const MOCK_OVERVIEW = {
  AAPL: {
    symbol: 'AAPL', name: 'Apple Inc.', description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sector: 'Technology', industry: 'Consumer Electronics',
    marketCap: 2_950_000_000_000, peRatio: 28.4, eps: 6.67,
    week52High: 199.62, week52Low: 164.08, dividendYield: 0.52,
  },
  MSFT: {
    symbol: 'MSFT', name: 'Microsoft Corp.', description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    sector: 'Technology', industry: 'Software—Infrastructure',
    marketCap: 3_090_000_000_000, peRatio: 35.2, eps: 11.80,
    week52High: 430.82, week52Low: 309.45, dividendYield: 0.72,
  },
  GOOGL: {
    symbol: 'GOOGL', name: 'Alphabet Inc.', description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    sector: 'Technology', industry: 'Internet Content & Information',
    marketCap: 2_060_000_000_000, peRatio: 22.1, eps: 7.48,
    week52High: 193.31, week52Low: 130.67, dividendYield: 0,
  },
  AMZN: {
    symbol: 'AMZN', name: 'Amazon.com Inc.', description: 'Amazon.com, Inc. engages in the retail sale of consumer products, advertising, and subscriptions service through online and physical stores in North America and internationally.',
    sector: 'Consumer Cyclical', industry: 'Internet Retail',
    marketCap: 2_040_000_000_000, peRatio: 41.3, eps: 4.71,
    week52High: 215.90, week52Low: 151.61, dividendYield: 0,
  },
  TSLA: {
    symbol: 'TSLA', name: 'Tesla Inc.', description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
    sector: 'Consumer Cyclical', industry: 'Auto Manufacturers',
    marketCap: 783_000_000_000, peRatio: 58.7, eps: 4.19,
    week52High: 414.50, week52Low: 138.80, dividendYield: 0,
  },
  NVDA: {
    symbol: 'NVDA', name: 'NVIDIA Corp.', description: 'NVIDIA Corporation provides graphics and compute and networking solutions in the United States, Taiwan, China, and internationally.',
    sector: 'Technology', industry: 'Semiconductors',
    marketCap: 2_160_000_000_000, peRatio: 65.2, eps: 13.43,
    week52High: 974.00, week52Low: 462.33, dividendYield: 0.03,
  },
  META: {
    symbol: 'META', name: 'Meta Platforms Inc.', description: 'Meta Platforms, Inc. engages in the development of products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and wearables worldwide.',
    sector: 'Technology', industry: 'Internet Content & Information',
    marketCap: 1_320_000_000_000, peRatio: 26.8, eps: 19.11,
    week52High: 589.88, week52Low: 353.94, dividendYield: 0.40,
  },
  NFLX: {
    symbol: 'NFLX', name: 'Netflix Inc.', description: 'Netflix, Inc. provides entertainment services. It offers TV series, documentaries, feature films, and games across various genres and languages.',
    sector: 'Communication Services', industry: 'Entertainment',
    marketCap: 271_000_000_000, peRatio: 44.1, eps: 14.38,
    week52High: 700.99, week52Low: 542.01, dividendYield: 0,
  },
};

/**
 * Generate 30 days of realistic daily price history for a given stock.
 * Uses a random-walk algorithm seeded by the stock's current price.
 * @param {string} symbol
 * @returns {Array<{date: string, close: number, open: number, high: number, low: number}>}
 */
export const generateMockHistory = (symbol) => {
  const quote = MOCK_QUOTES[symbol] || { price: 100 };
  const basePrice = quote.price;
  const history = [];
  let price = basePrice * 0.92; // start ~8% lower 30 days ago

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyChange = (Math.random() - 0.47) * (price * 0.025);
    price = Math.max(price + dailyChange, 1);
    const open = price * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(price, open) * (1 + Math.random() * 0.012);
    const low  = Math.min(price, open) * (1 - Math.random() * 0.012);

    history.push({
      date: date.toISOString().split('T')[0],
      close: parseFloat(price.toFixed(2)),
      open:  parseFloat(open.toFixed(2)),
      high:  parseFloat(high.toFixed(2)),
      low:   parseFloat(low.toFixed(2)),
    });
  }
  return history;
};

// ─── News articles ──────────────────────────────────────────────────────────
export const MOCK_NEWS = [
  {
    id: 1,
    title: 'BREAKING: Federal Reserve Signals Potential Rate Cut in June',
    summary: 'Fed Chair signals a possible interest rate reduction following cooler inflation data, sending markets higher.',
    source: 'Reuters', url: '#', publishedAt: Date.now() - 3_600_000,
    sentiment: 'bullish', isBreaking: true,
    relatedSymbols: ['AAPL', 'MSFT', 'AMZN'],
  },
  {
    id: 2,
    title: 'NVIDIA Reports Record Q1 Revenue Driven by AI Chip Demand',
    summary: 'NVIDIA exceeded analyst expectations with $26B in quarterly revenue, primarily from its data center segment.',
    source: 'CNBC', url: '#', publishedAt: Date.now() - 7_200_000,
    sentiment: 'bullish', isBreaking: false,
    relatedSymbols: ['NVDA'],
  },
  {
    id: 3,
    title: 'Apple Unveils New AI Features for iPhone 17 Lineup',
    summary: 'Apple announced a suite of on-device AI capabilities, boosting investor confidence ahead of the product launch.',
    source: 'Bloomberg', url: '#', publishedAt: Date.now() - 14_400_000,
    sentiment: 'bullish', isBreaking: false,
    relatedSymbols: ['AAPL'],
  },
  {
    id: 4,
    title: 'Tesla Deliveries Miss Q1 Estimates Amid Production Challenges',
    summary: 'Tesla delivered fewer vehicles than expected in Q1, citing factory retooling and logistics issues in key markets.',
    source: 'Wall Street Journal', url: '#', publishedAt: Date.now() - 21_600_000,
    sentiment: 'bearish', isBreaking: false,
    relatedSymbols: ['TSLA'],
  },
  {
    id: 5,
    title: 'Microsoft Azure Revenue Grows 31% YoY on AI Cloud Demand',
    summary: 'Microsoft\'s cloud division continues to accelerate, with AI-powered services accounting for a growing share.',
    source: 'TechCrunch', url: '#', publishedAt: Date.now() - 28_800_000,
    sentiment: 'bullish', isBreaking: false,
    relatedSymbols: ['MSFT'],
  },
  {
    id: 6,
    title: 'Amazon Expands Same-Day Delivery to 20 New US Cities',
    summary: 'Amazon continues its logistics push as it extends ultra-fast delivery coverage across North America.',
    source: 'Forbes', url: '#', publishedAt: Date.now() - 36_000_000,
    sentiment: 'neutral', isBreaking: false,
    relatedSymbols: ['AMZN'],
  },
];

export const getNewsForSymbol = (symbol) =>
  MOCK_NEWS.filter(n => n.relatedSymbols.includes(symbol));
