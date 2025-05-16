import React from 'react'
import { createGlobalStyle } from 'styled-components'
import MarketDashboard from './components/MarketDashboard'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  
  :root {
    --primary-glow: conic-gradient(
      from 180deg at 50% 50%,
      #16abff33 0deg,
      #0885ff33 55deg,
      #54d6ff33 120deg,
      #0071ff33 160deg,
      transparent 360deg
    );
    --secondary-glow: radial-gradient(
      rgba(255, 255, 255, 0.06),
      rgba(255, 255, 255, 0)
    );
    --neon-blue: #41c7ff;
    --neon-purple: #7b5fff;
    --neon-pink: #ff5599;
    --neon-green: #0cffe1;
    --neon-yellow: #ffce22;
    --dark-bg: #050714;
    --card-bg: rgba(20, 22, 42, 0.6);
    --card-border: rgba(83, 97, 189, 0.3);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: var(--dark-bg);
    color: #fff;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background: 
      radial-gradient(circle at top right, rgba(121, 68, 154, 0.15), transparent 40%),
      radial-gradient(circle at bottom left, rgba(29, 107, 203, 0.1), transparent 40%);
  }

  body::after {
    content: '';
    position: fixed;
    top: 50%;
    left: 50%;
    width: 80vw;
    height: 80vh;
    z-index: -1;
    transform: translate(-50%, -50%);
    background: var(--primary-glow);
    filter: blur(45px);
    opacity: 0.15;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    isolation: isolate;
  }
  
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, var(--neon-blue), var(--neon-purple));
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, var(--neon-purple), var(--neon-pink));
  }
  
  button, input, select {
    font-family: 'Space Grotesk', sans-serif;
  }
`

function App() {
  return (
    <>
      <GlobalStyle />
      <MarketDashboard />
    </>
  )
}

export default App

export function ListColors(){
  return(
    <ul>
      <li>Red</li>
      <li>Blue</li>
      <li>Green</li>
    </ul>
  )
}

