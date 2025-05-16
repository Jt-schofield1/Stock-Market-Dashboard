import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import TopPerformers from './TopPerformers';
import AIPredictions from './AIPredictions';
import OptionsRecommendations from './OptionsRecommendations';
import { fetchTopStocks, fetchTopCryptos } from '../api/marketApi';
import { FaSync, FaPlay, FaPause, FaClock } from 'react-icons/fa';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

const GlassPanelHeader = styled(motion.div)`
  backdrop-filter: blur(16px);
  background: rgba(30, 31, 48, 0.7);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1), 
              0 0 20px rgba(65, 199, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--neon-blue),
      transparent
    );
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  background: linear-gradient(to right, var(--neon-blue), var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60%;
    height: 2px;
    background: linear-gradient(to right, var(--neon-blue), transparent);
  }
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const RefreshControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LastUpdatedTag = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    color: var(--neon-blue);
  }
`;

const RefreshButton = styled(motion.button)`
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
      rgba(65, 199, 255, 0.2) 0%, 
      rgba(123, 95, 255, 0.2) 100%);
    z-index: -1;
    transition: opacity 0.3s ease;
    opacity: 0;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    border-color: var(--neon-blue);
    box-shadow: 0 0 15px rgba(65, 199, 255, 0.3);
  }
`;

const AutoRefreshButton = styled(RefreshButton)`
  &::before {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, rgba(12, 255, 225, 0.2) 0%, rgba(65, 199, 255, 0.2) 100%)' 
      : 'linear-gradient(135deg, rgba(255, 85, 153, 0.2) 0%, rgba(255, 206, 34, 0.2) 100%)'};
  }
  
  border-color: ${props => props.active 
    ? 'var(--neon-green)' 
    : 'var(--neon-pink)'};
  
  box-shadow: ${props => props.active
    ? '0 0 15px rgba(12, 255, 225, 0.2)'
    : '0 0 15px rgba(255, 85, 153, 0.2)'};
`;

const RefreshIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(5, 7, 20, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
  }
  
  &::before {
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, var(--neon-blue), var(--neon-purple));
    animation: pulse 1.5s ease-out infinite;
  }
  
  &::after {
    width: 80%;
    height: 80%;
    background: rgba(5, 7, 20, 0.8);
    top: 10%;
    left: 10%;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.8;
    }
  }
`;

const StatusText = styled(motion.p)`
  position: absolute;
  bottom: -30px;
  font-size: 0.9rem;
  color: var(--neon-blue);
  text-align: center;
  width: 100%;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const MarketDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute by default
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [stocksData, cryptosData] = await Promise.all([
        fetchTopStocks(),
        fetchTopCryptos()
      ]);
      
      setStocks(stocksData);
      setCryptos(cryptosData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);
  
  // Auto-refresh setup
  useEffect(() => {
    let refreshTimer;
    
    if (autoRefresh) {
      refreshTimer = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }
    
    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [autoRefresh, refreshInterval]);
  
  const handleManualRefresh = () => {
    fetchData();
  };
  
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };
  
  const getRefreshIntervalDisplay = () => {
    if (refreshInterval < 60000) {
      return `${refreshInterval / 1000}s`;
    } else {
      return `${refreshInterval / 60000}m`;
    }
  };
  
  const changeRefreshInterval = () => {
    // Cycle through refresh intervals: 30s → 1m → 5m → 15m → 30s
    if (refreshInterval === 30000) setRefreshInterval(60000);
    else if (refreshInterval === 60000) setRefreshInterval(300000);
    else if (refreshInterval === 300000) setRefreshInterval(900000);
    else setRefreshInterval(30000);
  };
  
  return (
    <DashboardContainer>
      <GlassPanelHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Financial Pulse</Title>
        <RefreshControls>
          {lastUpdated && (
            <LastUpdatedTag
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Last update: <span>{lastUpdated.toLocaleTimeString()}</span>
            </LastUpdatedTag>
          )}
          <RefreshButton 
            onClick={handleManualRefresh}
            whileTap={{ scale: 0.95 }}
            disabled={refreshing}
          >
            <RefreshIcon
              animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <FaSync size={16} />
            </RefreshIcon>
            Refresh
          </RefreshButton>
          <AutoRefreshButton
            onClick={toggleAutoRefresh}
            whileTap={{ scale: 0.95 }}
            active={autoRefresh}
          >
            {autoRefresh ? <FaPause size={16} /> : <FaPlay size={16} />}
            {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
          </AutoRefreshButton>
          <RefreshButton
            onClick={changeRefreshInterval}
            whileTap={{ scale: 0.95 }}
          >
            <FaClock size={16} />
            {getRefreshIntervalDisplay()}
          </RefreshButton>
        </RefreshControls>
      </GlassPanelHeader>
      
      <ContentWrapper>
        {/* AI Predictions Section */}
        <AIPredictions stocksData={stocks} cryptosData={cryptos} />
        
        {/* Options Recommendations Section */}
        <OptionsRecommendations stocksData={stocks} />
        
        {/* Market Data Content */}
        <ContentGrid>
          {stocks.length > 0 && (
            <TopPerformers title="Stock Leaders" assets={stocks} type="stock" />
          )}
          
          {cryptos.length > 0 && (
            <TopPerformers title="Crypto Pulse" assets={cryptos} type="crypto" />
          )}
        </ContentGrid>
      </ContentWrapper>
      
      <AnimatePresence>
        {loading && (
          <LoadingOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <LoadingSpinner />
              <StatusText
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                }}
              >
                Synchronizing Market Data
              </StatusText>
            </motion.div>
          </LoadingOverlay>
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default MarketDashboard; 