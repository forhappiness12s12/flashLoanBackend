const Web3 = require('web3').default;
const Decimal = require('decimal.js');

// Constants
const ARBITRUM_RPC_URL = 'https://arb1.arbitrum.io/rpc';  // Arbitrum mainnet RPC
const QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';  // Quoter contract address on Arbitrum
const TOKEN_A_ADDRESS = '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f';  // Use ETH instead of WETH
const TOKEN_B_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
const FEE_TIER = 500;  // 0.05% Uniswap V3 fee tier
const SLIPPAGE_TOLERANCE = new Decimal('0.005');  // 0.5% slippage tolerance

// Initialize Web3 provider
const web3 = new Web3(ARBITRUM_RPC_URL);

// Quoter ABI and contract instance
const QUOTER_ABI = [
    {
        "inputs": [
            {"internalType": "address", "name": "tokenIn", "type": "address"},
            {"internalType": "address", "name": "tokenOut", "type": "address"},
            {"internalType": "uint24", "name": "fee", "type": "uint24"},
            {"internalType": "uint256", "name": "amountIn", "type": "uint256"},
            {"internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160"},
        ],
        "name": "quoteExactInputSingle",
        "outputs": [{"internalType": "uint256", "name": "amountOut", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function",
    }
];

const quoterContract = new web3.eth.Contract(QUOTER_ABI, QUOTER_ADDRESS);

// Function to parse token amounts based on decimals
function parseUnits(amount, decimals) {
    return new Decimal(amount).mul(new Decimal(10).pow(decimals)).toString();
}

// Function to format token amounts based on decimals
function formatUnits(amount, decimals) {
    return new Decimal(amount).div(new Decimal(10).pow(decimals));
}
async function getAmountOut(amountIn) {
    const amountInParsed = parseUnits(amountIn, 8);  // Assuming WBTC has 8 decimals
    console.log(`Parsed Amount In (WBTC): ${amountInParsed}`);

    try {
        const amountOutQuoted = await quoterContract.methods.quoteExactInputSingle(
            TOKEN_A_ADDRESS,
            TOKEN_B_ADDRESS,
            FEE_TIER,
            amountInParsed,
            0
        ).call();

        console.log(`Amount Out Quoted (raw): ${amountOutQuoted}`);

        // Convert the raw amount to a string for Decimal processing
        const amountOutQuotedFormatted = formatUnits(amountOutQuoted.toString(), 6);  // Assuming USDT has 6 decimals
        console.log(`Formatted Amount Out (USDT): ${amountOutQuotedFormatted}`);

        // Apply slippage tolerance
        const amountOutWithSlippage = amountOutQuotedFormatted.mul(new Decimal(1).sub(SLIPPAGE_TOLERANCE));
        console.log(`Amount Out After Slippage: ${amountOutWithSlippage}`);

        return amountOutWithSlippage.toString();

    } catch (error) {
        console.error(`Error fetching amount out: ${error.message}`);
        return null;
    }
}


// Example usage
(async () => {
    const amountIn = process.argv[2];  // Get input from command line arguments

    if (!amountIn) {
        console.log("Please provide an amount of WBTC (Token A).");
        process.exit(1);
    }

    try {
        const amountOut = await getAmountOut(amountIn);

        if (amountOut) {
            console.log(`Amount of USDT (Token B) received: ${amountOut}`);
        } else {
            console.log("Failed to get amount out.");
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
})();
