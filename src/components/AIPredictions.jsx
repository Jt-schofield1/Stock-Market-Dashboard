import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaBrain, FaArrowUp, FaExclamationTriangle, FaRegChartBar, FaChartLine, FaCoins, FaSyncAlt, FaInfoCircle } from 'react-icons/fa';
import { generateMarketPredictions } from '../api/aiService';

const Container = styled(motion.div)`
  backdrop-filter: blur(16px);
  background: rgba(25, 26, 40, 0.6);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at top right, rgba(123, 95, 255, 0.1), transparent 60%),
      var(--secondary-glow);
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 0;
  position: relative;
  background: linear-gradient(to right, var(--neon-purple), var(--neon-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    background: linear-gradient(to right, var(--neon-purple), var(--neon-pink));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: var(--neon-purple);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ActionButton = styled(motion.button)`
  background: transparent;
  border: 1px solid var(--card-border);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, 
      rgba(123, 95, 255, 0.2) 0%, 
      rgba(255, 85, 153, 0.2) 100%);
    z-index: -1;
    transition: opacity 0.3s ease;
    opacity: 0;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    border-color: var(--neon-purple);
    box-shadow: 0 0 15px rgba(123, 95, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const InfoTag = styled.div`
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PredictionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PredictionSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.color || 'white'};
  }
`;

const PredictionCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color || 'var(--neon-blue)'};
    opacity: 0.8;
  }
`;

const SymbolTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.color || 'white'};
  margin-bottom: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  svg {
    font-size: 0.9rem;
  }
`;

const Reasoning = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
`;

const HighRiskCard = styled(PredictionCard)`
  grid-column: 1 / -1;
  border: 1px solid rgba(255, 85, 153, 0.2);
  box-shadow: 0 0 20px rgba(255, 85, 153, 0.1);
  
  &::before {
    background: var(--neon-pink);
  }
`;

const MarketSentiment = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.25rem;
  margin-top: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at bottom right, rgba(123, 95, 255, 0.1), transparent 70%);
    z-index: -1;
  }
`;

const SentimentTitle = styled.h3`
  font-size: 1.1rem;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SentimentText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
`;

const Disclaimer = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.4;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
`;

const RetryButton = styled(motion.button)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--neon-blue);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(65, 199, 255, 0.1);
  }
`;

const ErrorDetails = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  max-height: 100px;
  overflow-y: auto;
  white-space: pre-wrap;
  border: 1px solid rgba(255, 85, 153, 0.3);
`;

const DebugSection = styled.div`
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  padding: 1rem;
  font-family: monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  overflow-x: auto;
  border: 1px solid rgba(123, 95, 255, 0.3);
`;

const ModelBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${props => props.local ? 'var(--neon-green)' : 'var(--neon-purple)'};
  border-radius: 20px;
  padding: 0.3rem 0.7rem;
  font-size: 0.7rem;
  color: ${props => props.local ? 'var(--neon-green)' : 'var(--neon-purple)'};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const AIPredictions = ({ stocksData, cryptosData }) => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [debugMessages, setDebugMessages] = useState([]);
  const [isLocalPrediction, setIsLocalPrediction] = useState(false);
  const MAX_RETRIES = 2;
  
  const addDebugMessage = (message) => {
    console.log(message);
    setDebugMessages(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };
  
  const getPredictions = async (isRetry = false) => {
    if (!stocksData.length || !cryptosData.length) {
      setError('Insufficient market data available for AI analysis');
      return;
    }
    
    setLoading(true);
    setError(null);
    setErrorDetails(null);
    
    if (!isRetry) {
      setRetryCount(0);
      setDebugMessages([]);
      setIsLocalPrediction(false);
    }
    
    addDebugMessage(`Starting AI prediction request${isRetry ? ` (retry ${retryCount + 1})` : ''}`);
    
    try {
      addDebugMessage('Sending request to AI service...');
      const result = await generateMarketPredictions(stocksData, cryptosData);
      
      addDebugMessage('Response received from AI service');
      
      // Check the result for the source (API or local fallback)
      if (result.__source === 'local') {
        setIsLocalPrediction(true);
        addDebugMessage('Using local AI prediction algorithm (fast fallback mode)');
      }
      
      // Check if we got a valid result structure with expected properties
      if (!result.stockPicks || !result.cryptoPicks) {
        addDebugMessage('Error: Invalid data structure received');
        throw new Error('Invalid predictions format returned from AI service');
      }
      
      addDebugMessage('Successfully processed AI predictions');
      setPredictions(result);
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Unknown error';
      addDebugMessage(`Error: ${errorMessage}`);
      setError(`Failed to generate AI predictions: ${errorMessage}`);
      
      // Format error details for display
      let details = '';
      if (err.response?.data) {
        details = JSON.stringify(err.response.data, null, 2);
      } else if (err.stack) {
        details = err.stack;
      } else {
        details = JSON.stringify(err, null, 2);
      }
      
      setErrorDetails(details);
      
      // Auto-retry logic
      if (!isRetry && retryCount < MAX_RETRIES) {
        addDebugMessage(`Automatically retrying (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          getPredictions(true);
        }, 2000); // Wait 2 seconds before retrying
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Reset retry count when component remounts or dependencies change
  useEffect(() => {
    setRetryCount(0);
  }, [stocksData, cryptosData]);
  
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ModelBadge local={isLocalPrediction}>
        <FaRobot size={12} />
        {isLocalPrediction ? 'Local Analysis' : 'Claude AI'}
      </ModelBadge>
      
      <Header>
        <Title>
          <FaBrain size={24} />
          AI Market Predictions
        </Title>
        <ActionButton 
          onClick={() => getPredictions()}
          disabled={loading || (!stocksData.length || !cryptosData.length)}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <FaSyncAlt />
            </LoadingSpinner>
          ) : (
            <FaRobot />
          )}
          {loading ? 'Analyzing Market Data...' : 'Generate Predictions'}
        </ActionButton>
      </Header>
      
      <InfoTag>
        <FaInfoCircle />
        {predictions 
          ? isLocalPrediction 
              ? 'Predictions generated using local AI algorithm'
              : 'Predictions powered by Anthropic Claude AI'
          : loading 
              ? `Processing market data${retryCount > 0 ? ` (Retry ${retryCount}/${MAX_RETRIES})` : ''}`
              : 'Click the button to analyze current market data using advanced AI'
        }
      </InfoTag>
      
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PredictionCard color="var(--neon-purple)">
              <SymbolTag color="var(--neon-purple)">
                <FaSyncAlt />
                Processing
              </SymbolTag>
              <Reasoning>
                {debugMessages.length > 0 
                  ? "AI model is analyzing market data and generating predictions..." 
                  : "Connecting to AI service..."}
              </Reasoning>
              {debugMessages.length > 0 && (
                <DebugSection>
                  {debugMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </DebugSection>
              )}
            </PredictionCard>
          </motion.div>
        )}
        
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PredictionCard color="var(--neon-pink)">
              <SymbolTag color="var(--neon-pink)">
                <FaExclamationTriangle />
                Error
              </SymbolTag>
              <Reasoning>{error}</Reasoning>
              {debugMessages.length > 0 && (
                <DebugSection>
                  {debugMessages.map((msg, idx) => (
                    <div key={idx}>{msg}</div>
                  ))}
                </DebugSection>
              )}
              {errorDetails && (
                <ErrorDetails>
                  {errorDetails}
                </ErrorDetails>
              )}
              <RetryButton
                onClick={() => getPredictions()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSyncAlt size={14} />
                Retry with Fallback
              </RetryButton>
            </PredictionCard>
          </motion.div>
        )}
        
        {predictions && !error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PredictionSection>
              <SectionTitle color="var(--neon-blue)">
                <FaChartLine />
                Stock Predictions
              </SectionTitle>
              <PredictionsGrid>
                {predictions.stockPicks.map((pick, index) => (
                  <PredictionCard 
                    key={index} 
                    color="var(--neon-blue)"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SymbolTag color="var(--neon-blue)">
                      <FaArrowUp />
                      {pick.symbol}
                    </SymbolTag>
                    <Reasoning>{pick.reasoning}</Reasoning>
                  </PredictionCard>
                ))}
              </PredictionsGrid>
            </PredictionSection>
            
            <PredictionSection>
              <SectionTitle color="var(--neon-yellow)">
                <FaCoins />
                Crypto Predictions
              </SectionTitle>
              <PredictionsGrid>
                {predictions.cryptoPicks.map((pick, index) => (
                  <PredictionCard 
                    key={index}
                    color="var(--neon-yellow)"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <SymbolTag color="var(--neon-yellow)">
                      <FaArrowUp />
                      {pick.symbol}
                    </SymbolTag>
                    <Reasoning>{pick.reasoning}</Reasoning>
                  </PredictionCard>
                ))}
              </PredictionsGrid>
            </PredictionSection>
            
            {predictions.highRiskPick && (
              <HighRiskCard 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SectionTitle color="var(--neon-pink)">
                  <FaExclamationTriangle />
                  High Risk, High Reward Opportunity
                </SectionTitle>
                <SymbolTag color="var(--neon-pink)">
                  <FaArrowUp />
                  {predictions.highRiskPick.symbol} ({predictions.highRiskPick.assetType})
                </SymbolTag>
                <Reasoning>{predictions.highRiskPick.reasoning}</Reasoning>
              </HighRiskCard>
            )}
            
            <MarketSentiment
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SentimentTitle>
                <FaRegChartBar />
                Market Sentiment Overview
              </SentimentTitle>
              <SentimentText>{predictions.marketSentiment}</SentimentText>
            </MarketSentiment>
            
            <Disclaimer>
              Note: These predictions are generated by AI analysis of market data. They should not be considered as financial advice. Always do your own research before making investment decisions.
            </Disclaimer>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AIPredictions; 