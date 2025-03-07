const axios = require('axios');
const { JSDOM } = require('jsdom');
const urlModule = require('url');

exports.handler = async (event, context) => {
    const { url } = event.queryStringParameters;

    try {
        const response = await axios.get(url);
        const dom = new JSDOM(response.data);
        const doc = dom.window.document;

        const images = [];
        const imgElements = doc.querySelectorAll('img');
        console.log(`Found ${imgElements.length} img elements`); // Debugging: Log the number of img elements found

        for (let i = 0; i < imgElements.length; i++) {
            let src = imgElements[i].getAttribute('src') || imgElements[i].getAttribute('data-src');
            const parentNav = imgElements[i].closest('nav');
            console.log(`Image ${i}: src=${src}`); // Debugging: Log the image details

            // Handle relative URLs
            if (src && !src.startsWith('http')) {
                src = urlModule.resolve(url, src);
            }

            if (src && !parentNav && src.match(/\.(jpeg|jpg|gif|png)$/) && !src.toLowerCase().includes('logo')) {
                images.push(src);
            }
        }

        const h1 = doc.querySelector('h1') ? doc.querySelector('h1').textContent : '';
        const h2 = doc.querySelector('h2') ? doc.querySelector('h2').textContent : '';
        const h3 = doc.querySelector('h3') ? doc.querySelector('h3').textContent : '';
        const h4 = doc.querySelector('h4') ? doc.querySelector('h4').textContent : '';

        console.log(`Extracted images: ${images}`); // Debugging: Log the extracted images
        console.log(`Extracted h1: ${h1}`); // Debugging: Log the extracted h1
        console.log(`Extracted h2: ${h2}`); // Debugging: Log the extracted h2
        console.log(`Extracted h3: ${h3}`); // Debugging: Log the extracted h3
        console.log(`Extracted h4: ${h4}`); // Debugging: Log the extracted h4

        return {
            statusCode: 200,
            body: JSON.stringify({ images, h1, h2, h3, h4 }),
        };
    } catch (error) {
        console.error('Error fetching URL:', error.message); // Debugging: Log the error message
        console.error('Error stack:', error.stack); // Debugging: Log the error stack
        return {
            statusCode: 500,
            body: JSON.stringify({ images: [], h1: '', h2: '', h3: '', h4: '', error: 'Failed to fetch the URL' }),
        };
    }
};