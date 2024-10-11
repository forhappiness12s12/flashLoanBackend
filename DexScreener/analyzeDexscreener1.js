const axios = require('axios');

// DexScreener API endpoint for fetching data
const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/tokens';

// Token addresses on Arbitrum (ETH and USDT)
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'; // Leave ETH address empty for native ETH
const USDT_ADDRESS = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDT on Arbitrum

// Function to fetch pool prices for ETH/USDT on Arbitrum
async function fetchPools() {
  try {
    const response = await axios.get(`${DEXSCREENER_API_URL}/${USDT_ADDRESS}`);
    console.log('API Response:', response.data); // Log the entire response

    // Find pools where USDT is base and ETH is quote
    const pools = response.data.pairs.filter(
      pair => pair.baseToken.address === USDT_ADDRESS && pair.quoteToken.address === ETH_ADDRESS
    );

    return pools;
  } catch (error) {
    console.error('Error fetching pools:', error);
  }
}

// Function to analyze pool prices
async function analyzePrices() {
  const pools = await fetchPools();

  if (pools && pools.length > 0) {
    pools.forEach(pool => {
      console.log(`\nPool on DEX: ${pool.dexId}`);
      console.log(`Price: 1 ETH = ${pool.priceUsd} USDT`);
      console.log(`Liquidity: $${pool.liquidity.usd}`);
      console.log(`Volume (24h): $${pool.volume.h24}`);
      console.log(`-----------------------------------------------------`);
    });
  } else {
    console.log('No pools found for ETH/USDT on Arbitrum.');
  }
}

// Run the analysis
analyzePrices();
