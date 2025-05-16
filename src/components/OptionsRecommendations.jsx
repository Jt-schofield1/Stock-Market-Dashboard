import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartLine, FaExchangeAlt, FaArrowUp, FaArrowDown, FaCalendarAlt, FaInfoCircle, FaChevronDown, FaDollarSign, FaBalanceScale, FaPercentage, FaChartBar, FaFilter, FaSyncAlt } from 'react-icons/fa';
import { generateOptionsRecommendations } from '../api/optionsService';

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
      radial-gradient(circle at bottom left, rgba(12, 255, 225, 0.08), transparent 60%),
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
  background: linear-gradient(to right, var(--neon-blue), var(--neon-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    background: linear-gradient(to right, var(--neon-blue), var(--neon-green));
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
    background: var(--neon-blue);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const FilterButton = styled(motion.button)`
  background: transparent;
  border: 1px solid var(--card-border);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
      rgba(65, 199, 255, 0.1) 0%, 
      rgba(12, 255, 225, 0.1) 100%);
    z-index: -1;
    transition: opacity 0.3s ease;
    opacity: 0;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    border-color: var(--neon-blue);
    box-shadow: 0 0 15px rgba(65, 199, 255, 0.2);
  }
  
  ${props => props.active && `
    background: linear-gradient(135deg, 
      rgba(65, 199, 255, 0.15) 0%, 
      rgba(12, 255, 225, 0.15) 100%);
    border-color: rgba(65, 199, 255, 0.4);
    box-shadow: 0 0 10px rgba(65, 199, 255, 0.2);
  `}
`;

const RefreshButton = styled(motion.button)`
  background: transparent;
  border: 1px solid var(--card-border);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--neon-blue);
    box-shadow: 0 0 15px rgba(65, 199, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const OptionCard = styled(motion.div)`
  background: rgba(20, 21, 35, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid var(--card-border);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  ${props => props.contractType === 'CALL'
    ? `
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, var(--neon-blue), var(--neon-green), transparent);
      }
    `
    : `
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        width: 100%;
        background: linear-gradient(90deg, var(--neon-pink), var(--neon-purple), transparent);
      }
    `
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    ${props => props.contractType === 'CALL'
      ? `border-color: var(--neon-blue);`
      : `border-color: var(--neon-pink);`
    }
  }
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const OptionSymbol = styled.div`
  display: flex;
  flex-direction: column;
`;

const SymbolText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OptionType = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
  ${props => props.type === 'CALL'
    ? `
      background: rgba(12, 255, 225, 0.1);
      color: var(--neon-green);
      border: 1px solid rgba(12, 255, 225, 0.3);
    `
    : `
      background: rgba(255, 85, 153, 0.1);
      color: var(--neon-pink);
      border: 1px solid rgba(255, 85, 153, 0.3);
    `
  }
`;

const RecommendationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  
  ${props => {
    if (props.level === 'Strong Buy') {
      return `
        background: rgba(12, 255, 225, 0.15);
        color: var(--neon-green);
        border: 1px solid rgba(12, 255, 225, 0.3);
      `;
    } else if (props.level === 'Buy') {
      return `
        background: rgba(41, 209, 151, 0.15);
        color: #29d197;
        border: 1px solid rgba(41, 209, 151, 0.3);
      `;
    } else if (props.level === 'Moderate Buy') {
      return `
        background: rgba(65, 199, 255, 0.15);
        color: var(--neon-blue);
        border: 1px solid rgba(65, 199, 255, 0.3);
      `;
    } else if (props.level === 'Consider') {
      return `
        background: rgba(255, 206, 34, 0.15);
        color: var(--neon-yellow);
        border: 1px solid rgba(255, 206, 34, 0.3);
      `;
    } else {
      return `
        background: rgba(255, 85, 153, 0.15);
        color: var(--neon-pink);
        border: 1px solid rgba(255, 85, 153, 0.3);
      `;
    }
  }}
`;

const OptionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const DetailLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    font-size: 0.75rem;
    opacity: 0.7;
  }
`;

const DetailValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  
  ${props => props.highlight && `
    color: ${props.positive ? 'var(--neon-green)' : 'var(--neon-pink)'};
  `}
`;

const OptionReasoning = styled.div`
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  border-radius: 8px;
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

const AdvancedDetails = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const GreeksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 0.75rem 0.5rem;
`;

const GreekItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const GreekLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.2rem;
`;

const GreekValue = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${props => props.color || 'white'};
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;
`;

const Disclaimer = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 1.5rem;
  line-height: 1.4;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
`;

const OptionsRecommendations = ({ stocksData }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOption, setExpandedOption] = useState(null);
  const [filter, setFilter] = useState('all'); // all, calls, puts
  
  // Track which options are expanded
  const toggleExpand = (index) => {
    setExpandedOption(expandedOption === index ? null : index);
  };
  
  const getRecommendations = async () => {
    if (!stocksData.length) return;
    
    setLoading(true);
    try {
      const options = await generateOptionsRecommendations(stocksData);
      setRecommendations(options);
    } catch (error) {
      console.error('Error fetching options recommendations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Generate recommendations when stock data is available
  useEffect(() => {
    if (stocksData.length > 0) {
      getRecommendations();
    }
  }, [stocksData]);
  
  // Filter options based on selected filter
  const filteredOptions = recommendations.filter(option => {
    if (filter === 'calls') return option.contractType === 'CALL';
    if (filter === 'puts') return option.contractType === 'PUT';
    return true;
  });
  
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Header>
        <Title>
          <FaExchangeAlt size={22} />
          Options Recommendations
        </Title>
        <Controls>
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
            whileTap={{ scale: 0.95 }}
          >
            <FaFilter size={12} />
            All
          </FilterButton>
          <FilterButton 
            active={filter === 'calls'} 
            onClick={() => setFilter('calls')}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowUp size={12} />
            Calls
          </FilterButton>
          <FilterButton 
            active={filter === 'puts'} 
            onClick={() => setFilter('puts')}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowDown size={12} />
            Puts
          </FilterButton>
          <RefreshButton 
            onClick={getRecommendations}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FaSyncAlt size={12} />
              </motion.div>
            ) : (
              <FaSyncAlt size={12} />
            )}
            Refresh
          </RefreshButton>
        </Controls>
      </Header>
      
      <InfoTag>
        <FaInfoCircle />
        Top options contracts based on market momentum, volatility, and timing
      </InfoTag>
      
      {recommendations.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? 
            'Analyzing market data to find the best options...' : 
            'No options recommendations available. Try refreshing or check back later.'
          }
        </EmptyState>
      ) : (
        <OptionsGrid>
          {filteredOptions.slice(0, 6).map((option, index) => (
            <OptionCard 
              key={`${option.symbol}-${option.contractType}-${option.strikePrice}-${option.expirationDate}`}
              contractType={option.contractType}
              onClick={() => toggleExpand(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OptionHeader>
                <OptionSymbol>
                  <SymbolText>{option.symbol}</SymbolText>
                  <OptionType type={option.contractType}>
                    {option.contractType === 'CALL' ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                    {option.contractType}
                  </OptionType>
                </OptionSymbol>
                <RecommendationBadge level={option.recommendation}>
                  {option.recommendation}
                </RecommendationBadge>
              </OptionHeader>
              
              <OptionDetails>
                <DetailItem>
                  <DetailLabel>
                    <FaDollarSign />
                    Strike Price
                  </DetailLabel>
                  <DetailValue>${option.strikePrice}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>
                    <FaCalendarAlt />
                    Expiration
                  </DetailLabel>
                  <DetailValue>{option.expirationDate} ({option.daysToExpiration}d)</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>
                    <FaDollarSign />
                    Premium
                  </DetailLabel>
                  <DetailValue>${option.premium}/share</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>
                    <FaDollarSign />
                    Cost (100 shares)
                  </DetailLabel>
                  <DetailValue>${option.totalCost}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>
                    <FaPercentage />
                    Potential Return
                  </DetailLabel>
                  <DetailValue highlight positive>{option.potentialReturn}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>
                    <FaBalanceScale />
                    Risk/Reward
                  </DetailLabel>
                  <DetailValue>1:{option.riskRewardRatio}</DetailValue>
                </DetailItem>
              </OptionDetails>
              
              <OptionReasoning>
                {option.reasoning}
              </OptionReasoning>
              
              <ExpandButton 
                expanded={expandedOption === index}
                whileHover={{ y: expandedOption === index ? 2 : -2 }}
              >
                <FaChevronDown />
              </ExpandButton>
              
              <AnimatePresence>
                {expandedOption === index && (
                  <AdvancedDetails
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DetailItem style={{ marginBottom: '1rem' }}>
                      <DetailLabel>
                        <FaDollarSign />
                        Current Stock Price
                      </DetailLabel>
                      <DetailValue>${option.stockPrice}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem style={{ marginBottom: '1rem' }}>
                      <DetailLabel>
                        <FaDollarSign />
                        Breakeven Price
                      </DetailLabel>
                      <DetailValue>${option.breakEvenPrice}</DetailValue>
                    </DetailItem>
                    
                    <DetailItem style={{ marginBottom: '1rem' }}>
                      <DetailLabel>
                        <FaChartBar />
                        Implied Volatility
                      </DetailLabel>
                      <DetailValue>{option.impliedVolatility}</DetailValue>
                    </DetailItem>
                    
                    <GreeksGrid>
                      <GreekItem>
                        <GreekLabel>Delta</GreekLabel>
                        <GreekValue color={option.contractType === 'CALL' ? 'var(--neon-blue)' : 'var(--neon-pink)'}>
                          {option.delta}
                        </GreekValue>
                      </GreekItem>
                      <GreekItem>
                        <GreekLabel>Gamma</GreekLabel>
                        <GreekValue color="var(--neon-yellow)">
                          {option.gamma}
                        </GreekValue>
                      </GreekItem>
                      <GreekItem>
                        <GreekLabel>Theta</GreekLabel>
                        <GreekValue color="var(--neon-pink)">
                          {option.theta}
                        </GreekValue>
                      </GreekItem>
                      <GreekItem>
                        <GreekLabel>Vega</GreekLabel>
                        <GreekValue color="var(--neon-green)">
                          {option.vega}
                        </GreekValue>
                      </GreekItem>
                    </GreeksGrid>
                    
                    <DetailItem>
                      <DetailLabel>
                        Contract Specification
                      </DetailLabel>
                      <DetailValue style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        {option.symbol} {option.expirationDate} {option.contractType} ${option.strikePrice}
                      </DetailValue>
                    </DetailItem>
                  </AdvancedDetails>
                )}
              </AnimatePresence>
            </OptionCard>
          ))}
        </OptionsGrid>
      )}
      
      <Disclaimer>
        Options trading involves significant risk and is not suitable for all investors. The information provided is for educational purposes only and should not be considered as financial advice. Always conduct thorough research and consider consulting with a financial advisor before making investment decisions.
      </Disclaimer>
    </Container>
  );
};

export default OptionsRecommendations; 