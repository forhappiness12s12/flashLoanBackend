require('dotenv').config();
const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');

// Trim the API key to remove any extra spaces
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY1?.trim();

if (!NFT_STORAGE_KEY) {
    throw new Error("Missing API key! Please set it in the .env file.");
}

async function storeNFT(imagePath, description) {
    try {
        // Ensure the key is loaded and trimmed
        console.log("API Key being used:", NFT_STORAGE_KEY);
        
        const client = new NFTStorage({ token: NFT_STORAGE_KEY });

        if (!fs.existsSync(imagePath)) {
            throw new Error("File not found: " + imagePath);
        }

        const image = fs.readFileSync(imagePath);
        console.log("Image file read successfully.");

        const metadata = await client.store({
            name: 'MyNFT',
            description,
            image: new File([image], path.basename(imagePath), { type: 'image/png' }),
        });

        console.log('IPFS URL:', metadata.url);
        return metadata.url;
    } catch (error) {
        console.error('Error storing the NFT:', error.message);
        console.error(error.stack);
    }
}

storeNFT('./MyNFT1.png', 'This is a cool NFT');
