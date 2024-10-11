const apiKey = 'e7cd42bb.c10242e0af1c4dcca9538c7d5108e10e';
const url = 'https://api.nft.storage/store';

// Example data for NFT upload
const data = {
    name: "My NFT",
    description: "This is my NFT description",
    image: "https://ipfs.io/ipfs/QmT78zSuBmuS4z925WgP57nM2UFTz5Dq7JFcV1Un4T5e7n"
};

async function uploadNFT() {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);
}

uploadNFT();
