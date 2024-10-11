const axios = require('axios');

// DexScreener API endpoint for fetching data
const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/tokens';

// Token addresses on Arbitrum (WBTC and USDT)
const WBTC_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // WBTC on Arbitrum
const USDT_ADDRESS = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'; // USDT on Arbitrum

// Function to fetch pool prices for WBTC/USDT on Arbitrum
async function fetchPools() {
  try {
    const response = await axios.get(
      `${DEXSCREENER_API_URL}/${WBTC_ADDRESS}`
    );
    
    const pools = response.data.pairs.filter(
      pair => pair.baseToken.address === WBTC_ADDRESS && pair.quoteToken.address === USDT_ADDRESS
    );
    console.log(pools);


    return pools;
  } catch (error) {
    console.error('Error fetching pools:', error);
  }
}

// Function to analyze pool prices
async function analyzePrices() {
  const pools = await fetchPools();

  if (pools && pools.length > 0) {
    pools.forEach((pool, index) => {
      console.log(`\nPool ${index+1} on DEX: ${pool.dexId}`);
      console.log(`Price: 1 WBTC = ${pool.priceUsd} USDT`);
      console.log(`Liquidity: $${pool.liquidity.usd}`);
      console.log(`Volume (24h): $${pool.volume.h24}`);
      console.log(`pairAddress:${pool.pairAddress}`);
    });
  } else {
    console.log('No pools found for WBTC/USDT on Arbitrum.');
  }
}

// Run the analysis
analyzePrices();
