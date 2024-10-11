const fs = require('fs');
const path = require('path');
const { NFTStorage, File } = require('nft.storage');

const endpoint = 'https://api.nft.storage'; // the default
const token = 'e7cd42bb.c10242e0af1c4dcca9538c7d5108e10e'; // your API key from https://nft.storage/manage

const filePath1 = path.join(__dirname, 'MyNFT1.png');
const filePath2 = path.join(__dirname, 'MyNFT2.png');

// Check if files exist
if (!fs.existsSync(filePath1) || !fs.existsSync(filePath2)) {
    console.error('One or both of the files do not exist.');
    process.exit(1); // Exit the process if files are missing
}

async function main() {
    try {
        const storage = new NFTStorage({ endpoint, token });
        const metadata = await storage.store({
            name: 'nft.storage store test',
            description:
                'Using the nft.storage metadata API to create ERC-1155 compatible metadata.',
            image: new File([await fs.promises.readFile(filePath2)], 'MyNFT2.png', {
                type: 'image/png',
            }),
            properties: {
                custom:
                    'Any custom data can appear in properties, files are automatically uploaded.',
                file: new File(
                    [await fs.promises.readFile(filePath1)],
                    'MyNFT1.png',
                    {
                        type: 'image/png',
                    }
                ),
            },
        });
        console.log('IPFS URL for the metadata:', metadata.url);
        console.log('metadata.json contents:\n', metadata.data);
        console.log(
            'metadata.json contents with IPFS gateway URLs:\n',
            metadata.embed()
        );
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
