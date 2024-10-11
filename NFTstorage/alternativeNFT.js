const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

async function uploadToNFTStorage(imagePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    try {
        const response = await axios.post('https://api.nft.storage/upload', form, {
            headers: {
                'Authorization': `Bearer ${process.env.NFT_STORAGE_KEY1}`,
                ...form.getHeaders(),
            },
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

uploadToNFTStorage('./MyNFT1.png');
