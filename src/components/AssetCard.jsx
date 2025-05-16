import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaChartLine, FaCoins, FaBitcoin, FaRocket, FaExchangeAlt, FaGlobe, FaChartBar, FaChevronDown } from 'react-icons/fa';

const Card = styled(motion.div)`
  background: rgba(20, 21, 35, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.2rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => {
      if (props.type === 'crypto') {
        return 'linear-gradient(90deg, transparent, var(--neon-yellow), transparent)';
      } else {
        return 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)';
      }
    }};
    opacity: 0.7;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.type === 'crypto' ? 'var(--neon-yellow)' : 'var(--neon-blue)'};
  }
`;

const MainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: ${props => {
    if (props.type === 'crypto') {
      switch(props.assetType) {
        case 'major': return 'linear-gradient(135deg, #F7931A 0%, #FFAC38 100%)';
        case 'altcoin': return 'linear-gradient(135deg, #6B8CEF 0%, #9CB2FF 100%)';
        case 'volatile': return 'linear-gradient(135deg, #9945FF 0%, #BD7BFF 100%)';
        case 'memecoin': return 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)';
        default: return 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)';
      }
    } else {
      switch(props.assetType) {
        case 'blue-chip': return 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)';
        case 'growth': return 'linear-gradient(135deg, #38EF7D 0%, #11998E 100%)';
        case 'momentum': return 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)';
        case 'small-cap': return 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)';
        default: return 'linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)';
      }
    }
  }};
  color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  font-size: 1.2rem;
`;

const AssetName = styled.div`
  display: flex;
  flex-direction: column;
`;

const Symbol = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
`;

const Name = styled.span`
  font-size: 0.85rem;
  opacity: 0.7;
`;

const AssetType = styled.span`
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.35rem;
  padding: 0.1rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Price = styled.span`
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
`;

const Change = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  color: ${props => props.positive ? 'var(--neon-green)' : 'var(--neon-pink)'};
  background: ${props => props.positive ? 'rgba(12, 255, 225, 0.1)' : 'rgba(255, 85, 153, 0.1)'};
  border: 1px solid ${props => props.positive ? 'rgba(12, 255, 225, 0.3)' : 'rgba(255, 85, 153, 0.3)'};
  box-shadow: 0 0 10px ${props => props.positive ? 'rgba(12, 255, 225, 0.2)' : 'rgba(255, 85, 153, 0.2)'};
`;

const RankBadge = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom-right-radius: 8px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const DetailSection = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  
  svg {
    opacity: 0.7;
  }
`;

const DetailValue = styled.span`
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const TimeFrameChanges = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 0.75rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const TimeFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TimeLabel = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.25rem;
`;

const TimeValue = styled(motion.span)`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => parseFloat(props.value) > 0 ? 'var(--neon-green)' : 'var(--neon-pink)'};
  display: flex;
  align-items: center;
  gap: 0.2rem;
  text-shadow: 0 0 8px ${props => parseFloat(props.value) > 0 ? 'rgba(12, 255, 225, 0.3)' : 'rgba(255, 85, 153, 0.3)'};
`;

const Reason = styled.div`
  margin-top: 0.75rem;
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: 10px;
  border-left: 3px solid ${props => props.positive ? 'var(--neon-green)' : 'var(--neon-pink)'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.positive 
      ? 'radial-gradient(circle at top left, rgba(12, 255, 225, 0.1), transparent 70%)' 
      : 'radial-gradient(circle at top left, rgba(255, 85, 153, 0.1), transparent 70%)'};
    z-index: -1;
  }
`;

const PriceMovementHighlight = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    svg {
      opacity: 0.5;
      font-size: 0.7rem;
    }
  }
`;

const ExpandButton = styled(motion.div)`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  
  svg {
    font-size: 1rem;
    transition: transform 0.3s ease;
    transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const AssetCard = ({ asset, rank, type }) => {
  const [expanded, setExpanded] = useState(false);
  
  const {
    symbol,
    name,
    assetType,
    price,
    change,
    changePercent,
    changePercent1h,
    changePercent7d,
    changePercent30d,
    marketCap,
    volume,
    reason,
    high24h,
    low24h
  } = asset;
  
  const isPositive = parseFloat(changePercent) > 0;
  
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return '$' + (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return '$' + (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return '$' + (num / 1000).toFixed(2) + 'K';
    } else {
      return '$' + num.toFixed(2);
    }
  };
  
  const formatPrice = (price) => {
    if (price < 0.01) {
      return '$' + price.toFixed(6);
    } else if (price < 1) {
      return '$' + price.toFixed(4);
    } else {
      return '$' + price.toFixed(2);
    }
  };

  const getAssetIcon = () => {
    if (type === 'crypto') {
      switch(assetType) {
        case 'major': return <FaBitcoin />;
        case 'memecoin': return <FaRocket />;
        case 'altcoin': return <FaGlobe />;
        case 'volatile': return <FaExchangeAlt />;
        default: return <FaCoins />;
      }
    } else {
      switch(assetType) {
        case 'blue-chip': return <FaChartLine />;
        case 'growth': return <FaChartBar />;
        default: return <FaChartLine />;
      }
    }
  };
  
  return (
    <Card
      layout
      onClick={() => setExpanded(!expanded)}
      whileTap={{ scale: 0.98 }}
      type={type}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <RankBadge>#{rank}</RankBadge>
      
      <MainInfo>
        <AssetInfo>
          <IconWrapper 
            type={type} 
            assetType={assetType}
            whileHover={{ 
              rotate: [0, -10, 10, -5, 0], 
              transition: { duration: 0.4 } 
            }}
          >
            {getAssetIcon()}
          </IconWrapper>
          <AssetName>
            <Symbol>{symbol}</Symbol>
            <Name>{name}</Name>
            <AssetType>{assetType.replace('-', ' ')}</AssetType>
          </AssetName>
        </AssetInfo>
        
        <PriceInfo>
          <Price>{formatPrice(price)}</Price>
          <Change 
            positive={isPositive}
            animate={{ 
              boxShadow: [
                `0 0 5px ${isPositive ? 'rgba(12, 255, 225, 0.2)' : 'rgba(255, 85, 153, 0.2)'}`,
                `0 0 10px ${isPositive ? 'rgba(12, 255, 225, 0.4)' : 'rgba(255, 85, 153, 0.4)'}`,
                `0 0 5px ${isPositive ? 'rgba(12, 255, 225, 0.2)' : 'rgba(255, 85, 153, 0.2)'}`,
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
            {Math.abs(changePercent).toFixed(2)}%
          </Change>
        </PriceInfo>
      </MainInfo>
      
      <AnimatePresence>
        {expanded && (
          <DetailSection
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TimeFrameChanges>
              <TimeFrame>
                <TimeLabel>1H</TimeLabel>
                <TimeValue value={changePercent1h}>
                  {parseFloat(changePercent1h) > 0 ? 
                    <FaArrowUp size={8} /> : 
                    <FaArrowDown size={8} />
                  }
                  {Math.abs(parseFloat(changePercent1h)).toFixed(2)}%
                </TimeValue>
              </TimeFrame>
              <TimeFrame>
                <TimeLabel>24H</TimeLabel>
                <TimeValue value={changePercent}>
                  {parseFloat(changePercent) > 0 ? 
                    <FaArrowUp size={8} /> : 
                    <FaArrowDown size={8} />
                  }
                  {Math.abs(parseFloat(changePercent)).toFixed(2)}%
                </TimeValue>
              </TimeFrame>
              <TimeFrame>
                <TimeLabel>7D</TimeLabel>
                <TimeValue value={changePercent7d}>
                  {parseFloat(changePercent7d) > 0 ? 
                    <FaArrowUp size={8} /> : 
                    <FaArrowDown size={8} />
                  }
                  {Math.abs(parseFloat(changePercent7d)).toFixed(2)}%
                </TimeValue>
              </TimeFrame>
              <TimeFrame>
                <TimeLabel>30D</TimeLabel>
                <TimeValue value={changePercent30d}>
                  {parseFloat(changePercent30d) > 0 ? 
                    <FaArrowUp size={8} /> : 
                    <FaArrowDown size={8} />
                  }
                  {Math.abs(parseFloat(changePercent30d)).toFixed(2)}%
                </TimeValue>
              </TimeFrame>
            </TimeFrameChanges>
            
            <DetailItem>
              <DetailLabel><FaGlobe size={12} /> Market Cap</DetailLabel>
              <DetailValue>{formatNumber(marketCap)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel><FaExchangeAlt size={12} /> 24h Volume</DetailLabel>
              <DetailValue>{formatNumber(volume)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel><FaArrowUp size={12} /> 24h High</DetailLabel>
              <DetailValue>{formatPrice(high24h)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel><FaArrowDown size={12} /> 24h Low</DetailLabel>
              <DetailValue>{formatPrice(low24h)}</DetailValue>
            </DetailItem>
            
            <PriceMovementHighlight>
              <span><FaChartLine /> Change: {formatNumber(Math.abs(parseFloat(change)))}</span>
              <span><FaChartBar /> Volatility: {(((high24h - low24h) / price) * 100).toFixed(2)}%</span>
            </PriceMovementHighlight>
            
            <Reason positive={isPositive}>
              <strong>Trend Analysis:</strong> {reason}
            </Reason>
          </DetailSection>
        )}
      </AnimatePresence>
      
      <ExpandButton 
        expanded={expanded}
        whileHover={{ y: expanded ? 2 : -2 }}
      >
        <FaChevronDown />
      </ExpandButton>
    </Card>
  );
};

export default AssetCard; 