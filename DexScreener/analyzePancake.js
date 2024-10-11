const Web3 = require('web3');

// Initialize web3
const web3 = new Web3('https://bsc-dataseed.binance.org/'); // BSC mainnet RPC

// PancakeSwap Router ABI
const pancakeSwapRouterABI = [
    // Only include the methods you need
    {
        "constant": true,
        "inputs": [
            { "internalType": "address", "name": "tokenIn", "type": "address" },
            { "internalType": "address", "name": "tokenOut", "type": "address" },
            { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
            { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "deadline", "type": "uint256" }
        ],
        "name": "getAmountsOut",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];

// PancakeSwap Router contract address
const pancakeSwapRouterAddress = '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb';

// Create contract instance
const pancakeSwapRouter = new web3.eth.Contract(pancakeSwapRouterABI, pancakeSwapRouterAddress);

// Function to fetch amount received after swapping
async function getAmountOut(tokenIn, tokenOut, amountIn) {
    try {
        const amountsOut = await pancakeSwapRouter.methods.getAmountsOut(tokenIn, tokenOut, amountIn).call();
        return amountsOut[1]; // Amount received
    } catch (error) {
        console.error('Error fetching amount out:', error);
    }
}

// Example usage
const tokenIn = '0x...'; // Input token address (e.g., WBNB)
const tokenOut = '0x...'; // Output token address (e.g., USDT)
const amountIn = web3.utils.toWei('1', 'ether'); // Amount of tokenIn to swap (1 WBNB)

getAmountOut(tokenIn, tokenOut, amountIn)
    .then(amountOut => {
        console.log(`Amount received for swapping: ${web3.utils.fromWei(amountOut, 'ether')} ${tokenOut}`);
    })
    .catch(error => {
        console.error('Error:', error);
    });
