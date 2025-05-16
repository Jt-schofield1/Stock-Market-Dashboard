import axios from 'axios';

/**
 * Generates options recommendations based on market data
 * @param {Array} stocksData - Array of stock data
 * @returns {Promise<Array>} - Options recommendations
 */
export const generateOptionsRecommendations = async (stocksData) => {
  try {
    // For a real application, we would call an options data API
    // For example:
    // const response = await axios.get('https://options-api.com/recommendations', {
    //   params: { symbols: stocksData.map(s => s.symbol).join(',') }
    // });
    // return response.data;
    
    // Since we don't have a real API, we'll generate recommendations based on our stock data
    return createOptionsRecommendations(stocksData);
  } catch (error) {
    console.error('Error generating options recommendations:', error);
    throw error;
  }
};

/**
 * Creates realistic options recommendations based on stock data
 */
const createOptionsRecommendations = (stocksData) => {
  const recommendations = [];
  const currentDate = new Date();
  
  // Get top stocks by momentum and volatility
  const topStocks = [...stocksData]
    .sort((a, b) => {
      // Sort by absolute percentage change and volatility
      const aVolatility = ((a.high24h - a.low24h) / a.price) * 100;
      const bVolatility = ((b.high24h - b.low24h) / b.price) * 100;
      return (Math.abs(parseFloat(b.changePercent)) * bVolatility) - 
             (Math.abs(parseFloat(a.changePercent)) * aVolatility);
    })
    .slice(0, 5); // Top 5 stocks with highest momentum and volatility

  topStocks.forEach(stock => {
    const isPositiveTrend = parseFloat(stock.changePercent) > 0;
    const price = stock.price;
    const volatility = ((stock.high24h - stock.low24h) / price) * 100;
    
    // Create realistic expiration dates (next 3 Fridays)
    const expirations = getNextExpirationDates(3);
    
    // For each stock, create both call and put recommendations with different expirations
    expirations.forEach((expDate, i) => {
      const daysTillExpiration = Math.round((expDate - currentDate) / (1000 * 60 * 60 * 24));
      
      // Different strike price calculations based on trend and volatility
      const callStrikePrice = price * (1 + (0.02 + (i * 0.015))); // OTM calls
      const putStrikePrice = price * (1 - (0.02 + (i * 0.015))); // OTM puts
      
      // Calculate option premiums based on Black-Scholes approximation
      const callPremium = calculateApproximatePremium(price, callStrikePrice, daysTillExpiration, volatility, 'call');
      const putPremium = calculateApproximatePremium(price, putStrikePrice, daysTillExpiration, volatility, 'put');
      
      // Greeks approximations
      const callDelta = calculateApproximateDelta(price, callStrikePrice, volatility, daysTillExpiration, 'call');
      const putDelta = calculateApproximateDelta(price, putStrikePrice, volatility, daysTillExpiration, 'put');
      const callTheta = calculateApproximateTheta(price, callStrikePrice, volatility, daysTillExpiration);
      const putTheta = calculateApproximateTheta(price, putStrikePrice, volatility, daysTillExpiration);
      
      // Add call option if trend is positive or volatility is high
      if (isPositiveTrend || volatility > 5) {
        const callContract = {
          symbol: stock.symbol,
          contractType: 'CALL',
          strikePrice: callStrikePrice.toFixed(2),
          expirationDate: formatExpirationDate(expDate),
          daysToExpiration: daysTillExpiration,
          premium: callPremium.toFixed(2),
          contractSize: 100,
          totalCost: (callPremium * 100).toFixed(2),
          stockPrice: price.toFixed(2),
          breakEvenPrice: (parseFloat(callStrikePrice) + parseFloat(callPremium)).toFixed(2),
          impliedVolatility: (volatility * (1 + (Math.random() * 0.3))).toFixed(2) + '%',
          recommendation: getRecommendationStrength(volatility, daysTillExpiration, isPositiveTrend, 'call'),
          reasoning: generateReasoning(stock, daysTillExpiration, 'call', volatility),
          potentialReturn: calculatePotentialReturn(callPremium, price, callStrikePrice, 'call').toFixed(2) + '%',
          riskRewardRatio: (3 + Math.random() * 2).toFixed(2),
          interestLevel: getInterestLevel(volatility, Math.abs(parseFloat(stock.changePercent))),
          delta: callDelta.toFixed(2),
          theta: callTheta.toFixed(4),
          gamma: (Math.random() * 0.08 + 0.02).toFixed(3),
          vega: (volatility * 0.15).toFixed(3)
        };
        recommendations.push(callContract);
      }
      
      // Add put option if trend is negative or volatility is high
      if (!isPositiveTrend || volatility > 5) {
        const putContract = {
          symbol: stock.symbol,
          contractType: 'PUT',
          strikePrice: putStrikePrice.toFixed(2),
          expirationDate: formatExpirationDate(expDate),
          daysToExpiration: daysTillExpiration,
          premium: putPremium.toFixed(2),
          contractSize: 100, 
          totalCost: (putPremium * 100).toFixed(2),
          stockPrice: price.toFixed(2),
          breakEvenPrice: (parseFloat(putStrikePrice) - parseFloat(putPremium)).toFixed(2),
          impliedVolatility: (volatility * (1 + (Math.random() * 0.3))).toFixed(2) + '%',
          recommendation: getRecommendationStrength(volatility, daysTillExpiration, !isPositiveTrend, 'put'),
          reasoning: generateReasoning(stock, daysTillExpiration, 'put', volatility),
          potentialReturn: calculatePotentialReturn(putPremium, price, putStrikePrice, 'put').toFixed(2) + '%',
          riskRewardRatio: (2.5 + Math.random() *.5).toFixed(2),
          interestLevel: getInterestLevel(volatility, Math.abs(parseFloat(stock.changePercent))),
          delta: putDelta.toFixed(2),
          theta: putTheta.toFixed(4),
          gamma: (Math.random() * 0.08 + 0.02).toFixed(3),
          vega: (volatility * 0.15).toFixed(3)
        };
        recommendations.push(putContract);
      }
    });
  });
  
  // Sort recommendations by strength and interest level
  return recommendations.sort((a, b) => {
    const aScore = getRecommendationScore(a.recommendation) * parseFloat(a.interestLevel);
    const bScore = getRecommendationScore(b.recommendation) * parseFloat(b.interestLevel);
    return bScore - aScore;
  });
};

/**
 * Gets the next n option expiration dates (Fridays)
 */
const getNextExpirationDates = (count) => {
  const expirations = [];
  const date = new Date();
  
  // Find the next Friday
  while (date.getDay() !== 5) {
    date.setDate(date.getDate() + 1);
  }
  
  // Add n Fridays
  for (let i = 0; i < count; i++) {
    expirations.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }
  
  return expirations;
};

/**
 * Formats an expiration date to MM/DD/YYYY
 */
const formatExpirationDate = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

/**
 * Calculates an approximate option premium based on simplified Black-Scholes
 */
const calculateApproximatePremium = (stockPrice, strikePrice, daysTillExpiration, volatility, type) => {
  // This is a very simplified approximation
  const timeComponent = Math.sqrt(daysTillExpiration / 365);
  const volatilityComponent = volatility / 100;
  const moneyness = type === 'call' 
    ? stockPrice / strikePrice - 1
    : strikePrice / stockPrice - 1;
  
  // Base premium calculation
  let premium = stockPrice * volatilityComponent * timeComponent;
  
  // Adjust for moneyness
  if (moneyness > 0) {
    premium += stockPrice * moneyness * 0.5; // Add intrinsic value
  } else {
    premium *= (1 + Math.abs(moneyness) * 0.5); // Reduce premium for OTM options
  }
  
  // Minimum premium
  return Math.max(0.05, premium);
};

/**
 * Calculates potential return for an option
 */
const calculatePotentialReturn = (premium, stockPrice, strikePrice, type) => {
  if (type === 'call') {
    // For calls, potential return if stock goes up 10%
    const potentialStockPrice = stockPrice * 1.1;
    const potentialProfit = Math.max(0, potentialStockPrice - strikePrice);
    return (potentialProfit / premium - 1) * 100;
  } else {
    // For puts, potential return if stock goes down 10%
    const potentialStockPrice = stockPrice * 0.9;
    const potentialProfit = Math.max(0, strikePrice - potentialStockPrice);
    return (potentialProfit / premium - 1) * 100;
  }
};

/**
 * Generates a reasoning for the option recommendation
 */
const generateReasoning = (stock, daysTillExpiration, type, volatility) => {
  const timeframe = daysTillExpiration <= 14 ? 'short-term' : daysTillExpiration <= 30 ? 'medium-term' : 'longer-term';
  const volatilityDesc = volatility > 8 ? 'high' : volatility > 4 ? 'moderate' : 'low';
  
  if (type === 'call') {
    if (parseFloat(stock.changePercent) > 0) {
      return `${stock.symbol} shows strong upward momentum with ${volatilityDesc} volatility. This ${timeframe} call option provides leveraged exposure to continued upside movement with a favorable risk-reward profile.`;
    } else {
      return `Despite recent price weakness, ${stock.symbol} shows technical indicators suggesting potential reversal. This ${timeframe} call option offers an attractive entry for contrarian positions with defined risk.`;
    }
  } else {
    if (parseFloat(stock.changePercent) < 0) {
      return `${stock.symbol} shows continued downward price action with ${volatilityDesc} volatility. This ${timeframe} put option provides protection or profit potential from further decline.`;
    } else {
      return `${stock.symbol} may be approaching resistance levels despite recent gains. This ${timeframe} put option offers tactical hedging with a favorable premium due to lower implied volatility.`;
    }
  }
};

/**
 * Gets a recommendation strength based on volatility and trend
 */
const getRecommendationStrength = (volatility, daysTillExpiration, isTrendAligned, type) => {
  // Base score influenced by volatility and trend alignment
  let score = volatility * (isTrendAligned ? 1.5 : 0.7);
  
  // Adjust for time to expiration (we prefer medium-term options)
  if (daysTillExpiration < 10) {
    score *= 0.8; // Short-dated options are riskier
  } else if (daysTillExpiration > 45) {
    score *= 0.9; // Long-dated have less leverage
  }
  
  // Map score to recommendation strength
  if (score > 10) return 'Strong Buy';
  if (score > 7) return 'Buy';
  if (score > 5) return 'Moderate Buy';
  if (score > 3) return 'Consider';
  return 'Speculative';
};

/**
 * Gets a numeric score for recommendation for sorting
 */
const getRecommendationScore = (recommendation) => {
  switch (recommendation) {
    case 'Strong Buy': return 5;
    case 'Buy': return 4;
    case 'Moderate Buy': return 3;
    case 'Consider': return 2;
    case 'Speculative': return 1;
    default: return 0;
  }
};

/**
 * Gets an interest level based on volatility and price change
 */
const getInterestLevel = (volatility, change) => {
  const interestScore = (volatility * 0.4) + (change * 0.6);
  return Math.min(10, Math.max(1, Math.round(interestScore))); 
};

/**
 * Calculates an approximate delta for an option
 */
const calculateApproximateDelta = (stockPrice, strikePrice, volatility, daysTillExpiration, type) => {
  const moneyness = stockPrice / strikePrice;
  let delta;
  
  if (type === 'call') {
    // For calls, delta is between 0 and 1
    if (moneyness > 1.1) { // Deep ITM
      delta = 0.9 + (Math.random() * 0.1);
    } else if (moneyness > 1) { // ITM
      delta = 0.7 + (Math.random() * 0.2);
    } else if (moneyness > 0.95) { // Near ATM
      delta = 0.4 + (Math.random() * 0.3);
    } else { // OTM
      delta = Math.max(0.05, 0.3 * moneyness);
    }
  } else {
    // For puts, delta is between -1 and 0
    if (moneyness < 0.9) { // Deep ITM
      delta = -0.9 - (Math.random() * 0.1);
    } else if (moneyness < 1) { // ITM
      delta = -0.7 - (Math.random() * 0.2);
    } else if (moneyness < 1.05) { // Near ATM
      delta = -0.4 - (Math.random() * 0.3);
    } else { // OTM
      delta = Math.min(-0.05, -0.3 / moneyness);
    }
  }
  
  return delta;
};

/**
 * Calculates an approximate theta for an option
 */
const calculateApproximateTheta = (stockPrice, strikePrice, volatility, daysTillExpiration) => {
  // Theta becomes more negative as expiration approaches
  const thetaBase = -stockPrice * 0.001 * (volatility / 100);
  
  // Scale based on days till expiration (theta accelerates near expiration)
  const thetaScale = daysTillExpiration < 7 ? 3 : 
                     daysTillExpiration < 14 ? 2 : 
                     daysTillExpiration < 30 ? 1 : 0.5;
                     
  return thetaBase * thetaScale;
}; 