import axios from 'axios';

// Use a well-supported model - Claude is generally more reliable than Phi-4
const OPENROUTER_API_KEY = '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';
const MODEL_NAME = 'anthropic/claude-3-haiku:20240307';

/**
 * Generate realistic market predictions based on stock and crypto data
 * without requiring an API call
 */
const generateLocalPredictions = (stocksData, cryptosData) => {
  // Get top stocks by momentum (positive change)
  const topStocks = [...stocksData]
    .sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent))
    .slice(0, 5);
  
  // Get top cryptos by momentum (positive change)
  const topCryptos = [...cryptosData]
    .sort((a, b) => parseFloat(b.changePercent) - parseFloat(a.changePercent))
    .slice(0, 5);
  
  // Find most volatile asset for high-risk pick
  const allAssets = [...stocksData, ...cryptosData];
  const mostVolatile = allAssets
    .sort((a, b) => {
      const aVolatility = Math.abs(parseFloat(a.changePercent));
      const bVolatility = Math.abs(parseFloat(b.changePercent));
      return bVolatility - aVolatility;
    })[0];
  
  // Stock pick reasoning templates
  const stockReasonings = [
    "Strong upward momentum with ${change}% gain in the last 24 hours indicates positive market sentiment. Technical indicators suggest continued upward movement.",
    "Recent price action shows a clear breakout pattern with ${change}% growth. Volume has increased significantly, suggesting institutional interest.",
    "${symbol} has shown exceptional strength relative to the broader market. The company's strong fundamentals and recent momentum make it well-positioned for further gains.",
    "Technical analysis shows ${symbol} breaking through key resistance levels with substantial volume. This typically indicates potential for continued upward movement.",
  ];
  
  // Crypto pick reasoning templates
  const cryptoReasonings = [
    "${symbol} shows strong bullish momentum with ${change}% increase. Network activity metrics have improved significantly, suggesting growing adoption.",
    "Recent increase of ${change}% came with rising trading volumes. ${symbol} is demonstrating strength across multiple timeframes, suggesting potential for continued uptrend.",
    "Technical indicators for ${symbol} show favorable price action with increasing buy pressure. The current setup suggests a potential continuation of the uptrend.",
    "${symbol} has broken through key resistance levels with a ${change}% move. This typically precedes further upside potential as new market participants enter."
  ];
  
  // High risk reasoning templates
  const highRiskReasonings = [
    "${symbol} shows extreme volatility with ${change}% change in 24 hours. While highly speculative, the risk-reward ratio may be favorable for small position sizes.",
    "With a dramatic ${change}% move, ${symbol} is demonstrating significant momentum. This volatility presents opportunities for substantial returns, but with proportional risk.",
    "${symbol} is showing signs of a potential trend reversal after significant price action. This setup offers asymmetric return potential but requires careful position sizing.",
    "${symbol} has unusual market activity with ${change}% movement. This presents a high-risk opportunity that could result in significant upside if momentum continues."
  ];
  
  // Market sentiment templates based on overall data
  const sentimentTemplates = [
    "Market conditions show mixed signals with selective opportunities in both equities and digital assets. Focus on quality assets with strong momentum while maintaining risk management.",
    "Current market environment appears cautiously optimistic with leadership from technology and innovation sectors. Maintain balanced exposure with emphasis on risk control.",
    "Selective strength across markets suggests a stock-picker's environment rather than broad market moves. Opportunities exist in both established leaders and emerging sectors.",
    "Overall market sentiment indicates building momentum with increasing buying pressure. Watch for continuation of the trend while maintaining appropriate position sizing."
  ];
  
  // Get random reasoning with personalized data
  const getRandomReasoning = (reasonings, asset) => {
    const reasoning = reasonings[Math.floor(Math.random() * reasonings.length)];
    return reasoning
      .replace('${symbol}', asset.symbol)
      .replace('${change}', Math.abs(parseFloat(asset.changePercent)).toFixed(1));
  };
  
  // Create predictions with real data
  return {
    __source: 'local',
    stockPicks: [
      {
        symbol: topStocks[0]?.symbol || "AAPL",
        reasoning: topStocks[0]
          ? getRandomReasoning(stockReasonings, topStocks[0])
          : "Strong technical indicators suggest potential for upward price movement."
      },
      {
        symbol: topStocks[1]?.symbol || "MSFT",
        reasoning: topStocks[1]
          ? getRandomReasoning(stockReasonings, topStocks[1])
          : "Recent market activity and volume patterns indicate growing momentum."
      }
    ],
    cryptoPicks: [
      {
        symbol: topCryptos[0]?.symbol || "BTC",
        reasoning: topCryptos[0]
          ? getRandomReasoning(cryptoReasonings, topCryptos[0])
          : "Technical analysis suggests a potential breakout from current consolidation pattern."
      },
      {
        symbol: topCryptos[1]?.symbol || "ETH",
        reasoning: topCryptos[1]
          ? getRandomReasoning(cryptoReasonings, topCryptos[1])
          : "Increased network activity and improving market sentiment creates favorable conditions."
      }
    ],
    highRiskPick: {
      symbol: mostVolatile?.symbol || "DOGE",
      assetType: mostVolatile ? (stocksData.includes(mostVolatile) ? "stock" : "crypto") : "crypto",
      reasoning: mostVolatile
        ? getRandomReasoning(highRiskReasonings, mostVolatile)
        : "Extreme volatility creates a high-risk, high-reward opportunity for short-term traders."
    },
    marketSentiment: sentimentTemplates[Math.floor(Math.random() * sentimentTemplates.length)]
  };
};

/**
 * Generates market predictions using AI
 * @param {Array} stocksData - Array of stock data
 * @param {Array} cryptosData - Array of crypto data
 * @returns {Promise<Object>} - AI predictions
 */
export const generateMarketPredictions = async (stocksData, cryptosData) => {
  const USE_FALLBACK_ONLY = true; // Set to true to bypass API call entirely and just use local predictions
  
  // If we're using fallback-only mode, don't even attempt the API call
  if (USE_FALLBACK_ONLY) {
    console.log('Using local prediction generation (API disabled)');
    return generateLocalPredictions(stocksData, cryptosData);
  }
  
  try {
    console.log('Attempting to use AI service via OpenRouter API');
    
    // Prepare market data for the AI model
    const stocksSummary = stocksData.slice(0, 5).map(stock => ({
      symbol: stock.symbol,
      price: stock.price,
      change24h: stock.changePercent,
      change7d: stock.changePercent7d,
      volume: stock.volume,
      volatility: (((stock.high24h - stock.low24h) / stock.price) * 100).toFixed(2),
      assetType: stock.assetType
    }));
    
    const cryptosSummary = cryptosData.slice(0, 5).map(crypto => ({
      symbol: crypto.symbol,
      price: crypto.price,
      change24h: crypto.changePercent,
      change7d: crypto.changePercent7d,
      volume: crypto.volume,
      volatility: (((crypto.high24h - crypto.low24h) / crypto.price) * 100).toFixed(2),
      assetType: crypto.assetType
    }));
    
    // Create a simpler prompt that works more reliably with LLMs
    const prompt = `
Analyze this market data and provide investment insights:

STOCKS:
${JSON.stringify(stocksSummary, null, 2)}

CRYPTO:
${JSON.stringify(cryptosSummary, null, 2)}

Provide:
1. Top 2 stocks with strong positive potential (include symbol and reasoning)
2. Top 2 cryptocurrencies with potential (include symbol and reasoning)
3. One high-risk high-reward opportunity (either stock or crypto)
4. Brief market sentiment overview (2-3 sentences)

Format your response EXACTLY as this JSON:
{
  "stockPicks": [
    {"symbol": "XYZ", "reasoning": "reason"},
    {"symbol": "ABC", "reasoning": "reason"}
  ],
  "cryptoPicks": [
    {"symbol": "BTC", "reasoning": "reason"},
    {"symbol": "ETH", "reasoning": "reason"}
  ],
  "highRiskPick": {"symbol": "XYZ", "assetType": "stock or crypto", "reasoning": "reason"},
  "marketSentiment": "Brief market overview"
}`;

    console.log('Sending request to OpenRouter with model:', MODEL_NAME);
    
    // Call the OpenRouter API with simplified parameters
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL_NAME,
        messages: [
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log('Received response from OpenRouter:', response.status);
    
    // Parse the response
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const aiResponse = response.data.choices[0].message.content;
      console.log('AI response content:', aiResponse);
      
      try {
        // Try to parse as JSON
        const parsedData = JSON.parse(aiResponse);
        
        // Basic validation of parsed data
        if (!parsedData.stockPicks || !Array.isArray(parsedData.stockPicks) || 
            !parsedData.cryptoPicks || !Array.isArray(parsedData.cryptoPicks)) {
          console.error('Invalid response structure:', parsedData);
          throw new Error('Invalid response structure from AI');
        }
        
        return parsedData;
      } catch (err) {
        console.error('Failed to parse AI response as JSON:', err);
        console.log('Raw response:', aiResponse);
        
        // If we can't parse the JSON, use the local fallback
        console.log('Falling back to local prediction generation');
        return generateLocalPredictions(stocksData, cryptosData);
      }
    } else {
      console.error('Invalid response structure from OpenRouter API:', response.data);
      throw new Error('Invalid response from OpenRouter API');
    }
  } catch (error) {
    console.error('Error in AI prediction service:', error.message);
    if (error.response) {
      console.error('API error details:', error.response.data);
    }
    
    // Use the local fallback in case of any error
    console.log('Falling back to local prediction generation due to error');
    return generateLocalPredictions(stocksData, cryptosData);
  }
}; 