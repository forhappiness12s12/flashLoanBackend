import { request, gql } from 'graphql-request';


// GraphQL endpoints for DEXs on Arbitrum
const UNISWAP_GRAPHQL_URL = 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-arbitrum';
const SUSHISWAP_GRAPHQL_URL = 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange';
const BALANCER_GRAPHQL_URL = 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2';

// Token addresses
const WBTC_ADDRESS = '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f';
const USDT_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';

// GraphQL query template
const POOL_QUERY = (dex) => gql`
  {
    pairs(where: { token0: "${WBTC_ADDRESS}", token1: "${USDT_ADDRESS}" }) {
      id
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      token0Price
      token1Price
      volumeUSD
      liquidity
    }
  }
`;

// Function to fetch prices from Uniswap V3
async function fetchUniswapV3Price() {
  try {
    const response = await request(UNISWAP_GRAPHQL_URL, POOL_QUERY('uniswap'));
    return response.pairs;
  } catch (error) {
    console.error('Error fetching Uniswap V3 data:', error);
  }
}

// Function to fetch prices from SushiSwap
async function fetchSushiSwapPrice() {
  try {
    const response = await request(SUSHISWAP_GRAPHQL_URL, POOL_QUERY('sushiswap'));
    return response.pairs;
  } catch (error) {
    console.error('Error fetching SushiSwap data:', error);
  }
}

// Function to fetch prices from Balancer
async function fetchBalancerPrice() {
  try {
    const response = await request(BALANCER_GRAPHQL_URL, POOL_QUERY('balancer'));
    return response.pairs;
  } catch (error) {
    console.error('Error fetching Balancer data:', error);
  }
}

// Function to analyze and display the fetched prices
async function analyzePrices() {
  const uniswapPools = await fetchUniswapV3Price();
  const sushiswapPools = await fetchSushiSwapPrice();
  const balancerPools = await fetchBalancerPrice();

  // Combine and analyze prices
  const allPools = [...uniswapPools, ...sushiswapPools, ...balancerPools];

  if (allPools.length > 0) {
    allPools.forEach(pool => {
      console.log(`\nPool ID: ${pool.id}`);
      console.log(`DEX: ${pool.dex}`);
      console.log(`Price: 1 WBTC = ${pool.token0Price} USDT`);
      console.log(`Liquidity: ${pool.liquidity}`);
      console.log(`Volume (24h): $${pool.volumeUSD}`);
      console.log('-----------------------------------------------------');
    });
  } else {
    console.log('No pools found for WBTC/USDT on Arbitrum.');
  }
}

// Run the analysis
analyzePrices();
