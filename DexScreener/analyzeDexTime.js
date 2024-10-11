const axios = require('axios');

// DexScreener API endpoint for fetching data
const DEXSCREENER_API_URL = 'https://api.dexscreener.com/latest/dex/tokens';

// Token addresses on Arbitrum (WBTC and USDT)
const WBTC_ADDRESS = '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'; // WBTC on Arbitrum
const USDT_ADDRESS = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'; // USDT on Arbitrum

// Function to fetch pool prices for WBTC/USDT on Arbitrum
async function fetchPools() {
  try {
    const response = await axios.get(
      `${DEXSCREENER_API_URL}/${WBTC_ADDRESS}?chainId=arbitrum`
    );

    const pools = response.data.pairs.filter(
      pair => pair.baseToken.address === WBTC_ADDRESS && pair.quoteToken.address === USDT_ADDRESS
    );

    return pools;
  } catch (error) {
    console.error('Error fetching pools:', error);
  }
}

// Function to analyze pool prices and display current price time
async function analyzePrices() {
  const pools = await fetchPools();

  if (pools && pools.length > 0) {
    pools.forEach(pool => {
      // Convert the 'updatedAt' timestamp to a human-readable format
      const lastUpdated = pool.updatedAt
        ? new Date(pool.updatedAt * 1000).toLocaleString()  // Convert UNIX timestamp to human-readable date and time
        : 'N/A';

      console.log(`\nPool on DEX: ${pool.dexId}`);
      console.log(`Price: 1 WBTC = ${pool.priceUsd} USDT`);
      console.log(`Liquidity: $${pool.liquidity.usd}`);
      console.log(`Volume (24h): $${pool.volume.h24}`);
      console.log(`Last Updated: ${lastUpdated}`);
      console.log(`-----------------------------------------------------`);
    });
  } else {
    console.log('No pools found for WBTC/USDT on Arbitrum.');
  }
}

// Run the analysis
analyzePrices();
