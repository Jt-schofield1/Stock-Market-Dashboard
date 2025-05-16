import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AssetCard from './AssetCard';

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
    background: var(--secondary-glow);
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
  background: ${props => props.type === 'stock' 
    ? 'linear-gradient(to right, var(--neon-blue), var(--neon-green))' 
    : 'linear-gradient(to right, var(--neon-yellow), var(--neon-pink))'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${props => props.type === 'stock' 
      ? 'var(--neon-blue)' 
      : 'var(--neon-yellow)'};
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionInfo = styled.div`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1540px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NoDataMessage = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  border: 1px dashed rgba(255, 255, 255, 0.1);
`;

const TopPerformers = ({ title, assets, type }) => {
  // Sort assets by absolute percentage change
  const sortedAssets = [...assets].sort(
    (a, b) => Math.abs(parseFloat(b.changePercent)) - Math.abs(parseFloat(a.changePercent))
  ).slice(0, 9); // Show top 9
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };
  
  return (
    <Container
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Header>
        <Title type={type}>{title}</Title>
        <SectionInfo>
          Top {Math.min(9, sortedAssets.length)} by 24h change
        </SectionInfo>
      </Header>
      
      {sortedAssets.length > 0 ? (
        <Grid>
          {sortedAssets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <AssetCard
                asset={asset}
                rank={index + 1}
                type={type}
              />
            </motion.div>
          ))}
        </Grid>
      ) : (
        <NoDataMessage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No {type === 'stock' ? 'stocks' : 'cryptocurrency'} data available at the moment.
        </NoDataMessage>
      )}
    </Container>
  );
};

export default TopPerformers; 