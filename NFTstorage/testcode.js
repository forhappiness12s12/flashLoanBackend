require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");

// Load your Alchemy API URL and private key from environment variables
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Replace with your contract's ABI and address
const contractData = require('./myFlash.json'); // Load the ABI
const contractABI = Array.isArray(contractData) ? contractData : contractData.abi; // Ensure we access the right property
const contractAddress = "0xC4715C095671808EceDEA4E199a017688446d347"; // Replace with your actual contract address

const FlashParams = {
    token: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    pairtoken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    amount: ethers.utils.parseEther("5"), // starting value
    usePath: 0,
    path1: 5,
    path2: 6
};

const FlashParams1 = {
    token: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    pairtoken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    amount: ethers.utils.parseUnits("15000", 6), // starting value
    usePath: 0,
    path1: 5,
    path2: 6
};

// Function to get current time in Japan time zone
function getCurrentTimeInJapan() {
    const date = new Date();
    return date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
}

async function main() {
    // Set up provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

    console.log("Contract instance created");

    while (true) {
        let result = await contract.callStatic.estimateProfit(FlashParams.token, FlashParams.amount, FlashParams.pairtoken);

        // Convert BigNumbers to strings for easier reading
        let mainResult = result[0].toString();
        let nestedResult = result[1].map((bn) => bn.toString());

        console.log("Simulated Result from estimateProfit:");
        console.log("Main Result:", mainResult);
        console.log("Nested Result:", nestedResult);

        // Record block number, mainResult, and current time to file
        const blockNumber = await provider.getBlockNumber();
        const currentTime = getCurrentTimeInJapan();
        const logEntry = `Block: ${blockNumber}, Main Result: ${mainResult}, Time: ${currentTime}\n`;
        fs.appendFileSync('results.txt', logEntry, 'utf8');

        // Check if mainResult is greater than 1
        if (ethers.BigNumber.from(mainResult).gt(ethers.BigNumber.from("5000000000000000000"))) {
            console.log("Main result is greater than 1, calling callFlash...");
            try {
                // Call the contract's function (adjust FlashParams as needed)
                const tx = await contract.callFlash(FlashParams, {
                    gasLimit: 1000000, // Define your gas limit
                    maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"), // Adjust as needed
                    maxFeePerGas: ethers.utils.parseUnits("10", "gwei") // Adjust as needed
                });

                // Wait for the transaction to be mined
                const receipt = await tx.wait();
                console.log(`Transaction successful: ${receipt.transactionHash}`);
            } catch (error) {
                console.error("Transaction failed:", error);
            }
        }

        result = await contract.callStatic.estimateProfit(FlashParams1.token, FlashParams1.amount, FlashParams1.pairtoken);

        // Convert BigNumbers to strings for easier reading
        mainResult = result[0].toString();
        nestedResult = result[1].map((bn) => bn.toString());

        console.log("Simulated Result from estimateProfit USDC:");
        console.log("Main Result:", mainResult);
        console.log("Nested Result:", nestedResult);

        // Record block number, mainResult, and current time to file
        const blockNumber1 = await provider.getBlockNumber();
        const currentTime1 = getCurrentTimeInJapan();
        const logEntry1 = `Block: ${blockNumber1}, Main Result: ${mainResult}, Time: ${currentTime1}\n`;
        fs.appendFileSync('results.txt', logEntry1, 'utf8');

        // Check if mainResult is greater than 1
        if (ethers.BigNumber.from(mainResult).gt(ethers.BigNumber.from("15000000000"))) {
            console.log("Main result is greater than 1, calling callFlash...");
            try {
                // Call the contract's function (adjust FlashParams1 as needed)
                const tx = await contract.callFlash(FlashParams1, {
                    gasLimit: 1000000, // Define your gas limit
                    maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"), // Adjust as needed
                    maxFeePerGas: ethers.utils.parseUnits("10", "gwei") // Adjust as needed
                });

                // Wait for the transaction to be mined
                const receipt = await tx.wait();
                console.log(`Transaction successful: ${receipt.transactionHash}`);
            } catch (error) {
                console.error("Transaction failed:", error);
            }
        }

        // Optional: Add a delay between iterations to avoid overwhelming the network
        await new Promise(resolve => setTimeout(resolve, 1)); // 5 second delay
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
