import axios from 'axios';

// API keys and configuration
const ALPHA_VANTAGE_API_KEY = '6UFIJDVDB3XR6DCQ'; // Alpha Vantage API key
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_API_URL = 'https://www.alphavantage.co/query';

// Mock data for development and fallback
const generateMockData = (type) => {
  const generateRandomPercentage = (min = -5, max = 15) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  // Include a mix of blue chips and more volatile stocks
  const stockNames = [
    // Blue chips
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'blue-chip' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'blue-chip' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'blue-chip' },
    
    // Growth stocks
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'growth' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'growth' },
    
    // Volatile/Momentum stocks
    { symbol: 'PLTR', name: 'Palantir Technologies', type: 'momentum' },
    { symbol: 'UPST', name: 'Upstart Holdings', type: 'momentum' },
    { symbol: 'RIVN', name: 'Rivian Automotive', type: 'momentum' },
    { symbol: 'LCID', name: 'Lucid Group', type: 'momentum' },
    { symbol: 'MARA', name: 'Marathon Digital Holdings', type: 'momentum' },
    
    // Small caps with potential for large moves
    { symbol: 'BNGO', name: 'Bionano Genomics', type: 'small-cap' },
    { symbol: 'SKLZ', name: 'Skillz Inc.', type: 'small-cap' },
    { symbol: 'VXRT', name: 'Vaxart Inc.', type: 'small-cap' },
    { symbol: 'TLRY', name: 'Tilray Brands', type: 'small-cap' },
    { symbol: 'BB', name: 'BlackBerry Limited', type: 'small-cap' },
  ];

  const cryptoNames = [
    // Major cryptocurrencies
    { symbol: 'BTC', name: 'Bitcoin', type: 'major' },
    { symbol: 'ETH', name: 'Ethereum', type: 'major' },
    
    // Mid-cap altcoins
    { symbol: 'SOL', name: 'Solana', type: 'altcoin' },
    { symbol: 'ADA', name: 'Cardano', type: 'altcoin' },
    { symbol: 'DOT', name: 'Polkadot', type: 'altcoin' },
    
    // Smaller, more volatile coins
    { symbol: 'AVAX', name: 'Avalanche', type: 'volatile' },
    { symbol: 'MATIC', name: 'Polygon', type: 'volatile' },
    { symbol: 'ATOM', name: 'Cosmos', type: 'volatile' },
    { symbol: 'LRC', name: 'Loopring', type: 'volatile' },
    { symbol: 'NEAR', name: 'NEAR Protocol', type: 'volatile' },
    
    // Memecoins with high volatility
    { symbol: 'DOGE', name: 'Dogecoin', type: 'memecoin' },
    { symbol: 'SHIB', name: 'Shiba Inu', type: 'memecoin' },
    { symbol: 'PEPE', name: 'Pepe Coin', type: 'memecoin' },
    { symbol: 'FLOKI', name: 'Floki Inu', type: 'memecoin' },
    { symbol: 'BONK', name: 'Bonk', type: 'memecoin' },
  ];

  const positiveReasons = [
    'Strong quarterly earnings exceeding analyst expectations by 15%',
    'New product launch receiving overwhelmingly positive consumer response',
    'Major partnership announced with industry leader for expansion',
    'Massive surge in institutional buying detected on exchange data',
    'Regulatory approval for expansion into previously restricted markets',
    'Analyst upgrades with price target 40% above current levels',
    'Technical breakout from 6-month consolidation pattern on high volume',
    'Short squeeze developing with 35% of float currently shorted',
    'Industry disruption from new technology announcement',
    'Successful cost-cutting initiative improving margins substantially'
  ];

  const negativeReasons = [
    'Missed earnings expectations with revenue down 12% year-over-year',
    'Analyst downgrade citing concerns about market saturation',
    'SEC investigation announced regarding accounting practices',
    'Major competitor released superior product at lower price point',
    'Technical breakdown below key support levels on high volume',
    'Rising costs and supply chain issues impacting profitability',
    'CEO unexpected resignation raising questions about leadership',
    'Failed clinical trial for flagship product in development',
    'Market share losses to emerging competitors in key regions',
    'Dividend cut announced to preserve cash amid challenging conditions'
  ];

  const names = type === 'stock' ? stockNames : cryptoNames;

  // Generate data for each asset
  return names.map((item) => {
    // Generate more volatile changes based on the asset type
    let maxMove, minMove;
    
    if (type === 'stock') {
      switch(item.type) {
        case 'blue-chip':
          maxMove = 8; minMove = -5;
          break;
        case 'growth':
          maxMove = 15; minMove = -8;
          break;
        case 'momentum':
          maxMove = 25; minMove = -12;
          break;
        case 'small-cap':
          maxMove = 35; minMove = -15;
          break;
        default:
          maxMove = 10; minMove = -6;
      }
    } else { // Crypto
      switch(item.type) {
        case 'major':
          maxMove = 12; minMove = -8;
          break;
        case 'altcoin':
          maxMove = 20; minMove = -12;
          break;
        case 'volatile':
          maxMove = 30; minMove = -15;
          break;
        case 'memecoin':
          maxMove = 45; minMove = -20;
          break;
        default:
          maxMove = 15; minMove = -10;
      }
    }
    
    // Generate change percentages for different time periods
    const changePercent1h = generateRandomPercentage(minMove/3, maxMove/3);
    const changePercent24h = generateRandomPercentage(minMove, maxMove);
    const changePercent7d = generateRandomPercentage(minMove*1.5, maxMove*1.5);
    const changePercent30d = generateRandomPercentage(minMove*2, maxMove*2);
    
    // Generate base price for the asset
    let price;
    if (type === 'stock') {
      switch(item.type) {
        case 'blue-chip':
          price = Math.random() * 400 + 100;
          break;
        case 'growth':
          price = Math.random() * 300 + 50;
          break;
        case 'momentum':
          price = Math.random() * 100 + 10;
          break;
        case 'small-cap':
          price = Math.random() * 20 + 1;
          break;
        default:
          price = Math.random() * 200 + 50;
      }
    } else { // Crypto
      switch(item.type) {
        case 'major':
          price = item.symbol === 'BTC' 
            ? Math.random() * 10000 + 30000 
            : Math.random() * 1000 + 1000;
          break;
        case 'altcoin':
          price = Math.random() * 100 + 5;
          break;
        case 'volatile':
          price = Math.random() * 50 + 1;
          break;
        case 'memecoin':
          price = Math.random() * 1 + 0.000001;
          break;
        default:
          price = Math.random() * 100 + 10;
      }
    }
    
    // Calculate dollar changes based on percentage
    const change24h = (price * parseFloat(changePercent24h) / 100).toFixed(2);
    
    // Calculate market cap
    let marketCap;
    if (type === 'stock') {
      switch(item.type) {
        case 'blue-chip':
          marketCap = Math.random() * 1000000000000 + 500000000000;
          break;
        case 'growth':
          marketCap = Math.random() * 500000000000 + 50000000000;
          break;
        case 'momentum':
          marketCap = Math.random() * 50000000000 + 5000000000;
          break;
        case 'small-cap':
          marketCap = Math.random() * 5000000000 + 100000000;
          break;
        default:
          marketCap = Math.random() * 100000000000 + 10000000000;
      }
    } else { // Crypto
      switch(item.type) {
        case 'major':
          marketCap = Math.random() * 500000000000 + 100000000000;
          break;
        case 'altcoin':
          marketCap = Math.random() * 50000000000 + 5000000000;
          break;
        case 'volatile':
          marketCap = Math.random() * 5000000000 + 500000000;
          break;
        case 'memecoin':
          marketCap = Math.random() * 1000000000 + 50000000;
          break;
        default:
          marketCap = Math.random() * 10000000000 + 1000000000;
      }
    }
    
    // Calculate volume based on market cap
    const volume = marketCap * (Math.random() * 0.3 + 0.05);
    
    // Determine if the asset is moving up or down
    const isPositive = parseFloat(changePercent24h) > 0;
    
    // Select a reason based on price movement
    const reason = isPositive 
      ? positiveReasons[Math.floor(Math.random() * positiveReasons.length)]
      : negativeReasons[Math.floor(Math.random() * negativeReasons.length)];
    
    return {
      symbol: item.symbol,
      name: item.name,
      assetType: item.type,
      price,
      change: change24h,
      changePercent: changePercent24h,
      changePercent1h,
      changePercent7d,
      changePercent30d,
      marketCap,
      volume,
      reason,
      high24h: price * (1 + Math.random() * 0.05),
      low24h: price * (1 - Math.random() * 0.05),
    };
  }).sort((a, b) => Math.abs(parseFloat(b.changePercent)) - Math.abs(parseFloat(a.changePercent)));
};

// Helper to format Alpha Vantage stock data
const formatStockData = (data) => {
  const latestDate = Object.keys(data['Time Series (Daily)'])[0];
  const previousDate = Object.keys(data['Time Series (Daily)'])[1];
  
  const latestClose = parseFloat(data['Time Series (Daily)'][latestDate]['4. close']);
  const previousClose = parseFloat(data['Time Series (Daily)'][previousDate]['4. close']);
  
  const changePercent24h = ((latestClose - previousClose) / previousClose * 100).toFixed(2);
  
  const values = data['Time Series (Daily)'][latestDate];
  
  return {
    symbol: data['Meta Data']['2. Symbol'],
    name: data['Meta Data']['2. Symbol'], // API doesn't provide full name
    assetType: 'stock', // We'll categorize later
    price: latestClose,
    change: (latestClose - previousClose).toFixed(2),
    changePercent: changePercent24h,
    changePercent1h: (changePercent24h / 24).toFixed(2), // Approximation
    changePercent7d: (parseFloat(changePercent24h) * 3).toFixed(2), // Approximation
    changePercent30d: (parseFloat(changePercent24h) * 5).toFixed(2), // Approximation
    high24h: parseFloat(values['2. high']),
    low24h: parseFloat(values['3. low']),
    volume: parseFloat(values['5. volume']),
    marketCap: parseFloat(values['5. volume']) * latestClose, // Approximation
    reason: getReasonBasedOnChange(changePercent24h),
  };
};

// Helper to get reason based on price change
const getReasonBasedOnChange = (changePercent) => {
  const positiveReasons = [
    'Strong quarterly earnings exceeding analyst expectations by 15%',
    'New product launch receiving overwhelmingly positive consumer response',
    'Major partnership announced with industry leader for expansion',
    'Massive surge in institutional buying detected on exchange data',
    'Regulatory approval for expansion into previously restricted markets',
    'Analyst upgrades with price target 40% above current levels',
    'Technical breakout from 6-month consolidation pattern on high volume',
    'Short squeeze developing with 35% of float currently shorted',
    'Industry disruption from new technology announcement',
    'Successful cost-cutting initiative improving margins substantially'
  ];

  const negativeReasons = [
    'Missed earnings expectations with revenue down 12% year-over-year',
    'Analyst downgrade citing concerns about market saturation',
    'SEC investigation announced regarding accounting practices',
    'Major competitor released superior product at lower price point',
    'Technical breakdown below key support levels on high volume',
    'Rising costs and supply chain issues impacting profitability',
    'CEO unexpected resignation raising questions about leadership',
    'Failed clinical trial for flagship product in development',
    'Market share losses to emerging competitors in key regions',
    'Dividend cut announced to preserve cash amid challenging conditions'
  ];
  
  const isPositive = parseFloat(changePercent) > 0;
  const reasons = isPositive ? positiveReasons : negativeReasons;
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Determine asset type based on price, volume, and market cap
const determineAssetType = (price, volume, marketCap) => {
  // For stocks
  if (marketCap > 200000000000) return 'blue-chip';
  if (marketCap > 50000000000) return 'growth';
  if (volume > 10000000 && price > 20) return 'momentum';
  return 'small-cap';
};

// Determine crypto asset type
const determineCryptoType = (symbol, marketCap) => {
  if (symbol === 'BTC' || symbol === 'ETH') return 'major';
  if (marketCap > 10000000000) return 'altcoin';
  if (symbol === 'DOGE' || symbol === 'SHIB') return 'memecoin';
  return 'volatile';
};

export const fetchTopStocks = async () => {
  try {
    const stockSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'PLTR'];
    
    // Using Promise.all to fetch data for multiple stocks
    const stockData = await Promise.all(
      stockSymbols.map(async (symbol) => {
        try {
          const response = await axios.get(ALPHA_VANTAGE_API_URL, {
            params: {
              function: 'TIME_SERIES_DAILY',
              symbol: symbol,
              apikey: ALPHA_VANTAGE_API_KEY,
              outputsize: 'compact'
            }
          });
          
          // If we hit API limits or get error, return null to filter later
          if (response.data['Error Message'] || !response.data['Time Series (Daily)']) {
            console.warn(`Error or API limit for ${symbol}, using mock data`);
            return null;
          }
          
          return formatStockData(response.data);
        } catch (err) {
          console.warn(`Error fetching ${symbol}: ${err.message}, using mock data`);
          return null;
        }
      })
    );
    
    // Filter out null values and fallback to mock data if needed
    const validStockData = stockData.filter(stock => stock !== null);
    
    if (validStockData.length === 0) {
      console.warn('No valid stock data received from API, using mock data');
      return generateMockData('stock');
    }
    
    // Add asset types
    return validStockData.map(stock => {
      return {
        ...stock,
        assetType: determineAssetType(stock.price, stock.volume, stock.marketCap)
      };
    }).sort((a, b) => Math.abs(parseFloat(b.changePercent)) - Math.abs(parseFloat(a.changePercent)));
    
  } catch (err) {
    console.error('Error fetching top stocks:', err);
    console.warn('Falling back to mock data');
    return generateMockData('stock');
  }
};

export const fetchTopCryptos = async () => {
  try {
    const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 15,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d,30d'
      }
    });
    
    if (!response.data || response.data.length === 0) {
      console.warn('No data from CoinGecko API, using mock data');
      return generateMockData('crypto');
    }
    
    // Format CoinGecko response to match our data structure
    return response.data.map(coin => {
      const changePercent1h = coin.price_change_percentage_1h_in_currency?.toFixed(2) || '0.00';
      const changePercent24h = coin.price_change_percentage_24h?.toFixed(2) || '0.00';
      const changePercent7d = coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0.00';
      const changePercent30d = coin.price_change_percentage_30d_in_currency?.toFixed(2) || '0.00';
      
      return {
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        assetType: determineCryptoType(coin.symbol.toUpperCase(), coin.market_cap),
        price: coin.current_price,
        change: coin.price_change_24h?.toFixed(2) || '0.00',
        changePercent: changePercent24h,
        changePercent1h,
        changePercent7d,
        changePercent30d,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        reason: getReasonBasedOnChange(changePercent24h)
      };
    }).sort((a, b) => Math.abs(parseFloat(b.changePercent)) - Math.abs(parseFloat(a.changePercent)));
    
  } catch (error) {
    console.error('Error fetching top cryptocurrencies:', error);
    console.warn('Falling back to mock data');
    return generateMockData('crypto');
  }
}; 