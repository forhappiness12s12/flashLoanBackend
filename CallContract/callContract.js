require("dotenv").config();
const { ethers } = require("ethers");

// Load your Alchemy API URL and private key from environment variables
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Replace with your contract's ABI and address
const contractData = require('./myFlash.json'); // Load the ABI
const contractABI = Array.isArray(contractData) ? contractData : contractData.abi; // Ensure we access the right property
const contractAddress = "0x443cBE4B2A49D8e061118470BBa9454B49B206b0"; // Replace with your actual contract address
FlashParams = {
    token: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    pairtoken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    amount: ethers.utils.parseEther("1"), // starting value
    usePath: 0,
    path1: 5,
    path2: 6
  };



async function main() {
    // Set up provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    console.log("Contract instance created");

    // Replace with your parameters
    const tokenAddress = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"; // Replace with the actual token address
    const amount = ethers.utils.parseUnits("1.0", 18); // Adjust decimals as needed
    const pairTokenAddress = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // Replace with the actual pair token address
    FlashParams = {
        token: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        pairtoken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        amount: ethers.utils.parseEther("1"), // starting value
        usePath: 0,
        path1: 5,
        path2: 6
      };
    

    while (true) {        
        //Call the function using callStatic to simulate and avoid gas usage
        const result = await contract.callStatic.estimateProfit(tokenAddress, amount, pairTokenAddress);

        // Convert BigNumbers to strings for easier reading
        const mainResult = result[0].toString();
        const nestedResult = result[1].map((bn) => bn.toString());

        console.log("Simulated Result from estimateProfit:");
        console.log("Main Result:", mainResult);
        console.log("Nested Result:", nestedResult);

        // Check if mainResult is greater than 1
        if (ethers.BigNumber.from(mainResult).gt(ethers.BigNumber.from("1000000000000000000"))) {
            console.log("Main result is greater than 1, calling callFlash...");
            try {
                // Call the contract's function (adjust FlashParams as needed)
                const tx = await contract.callFlash(FlashParams, {
                    gasLimit: gasLimit,
                    maxPriorityFeePerGas: maxPriorityFeePerGas,
                    maxFeePerGas: maxFeePerGas
                });
    
                // Wait for the transaction to be mined
                const receipt = await tx.wait();
                console.log(`Transaction successful: ${receipt.transactionHash}`);
            } catch (error) {
                console.error("Transaction failed:", error);
            }
        }

        // Optional: Add a delay between iterations to avoid overwhelming the network
        await new Promise(resolve => setTimeout(resolve, 5)); // 5 second delay
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
