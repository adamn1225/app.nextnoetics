// filepath: /home/adam-noah/app.nextnoetics/netlify/functions/fetch-images.js
const axios = require('axios');

exports.handler = async (event, context) => {
  const SHUTTERSTOCK_CLIENT_ID = process.env.REACT_APP_SHUTTERSTOCK_CLIENT_ID;
  const SHUTTERSTOCK_CLIENT_SECRET = process.env.REACT_APP_SHUTTERSTOCK_CLIENT_SECRET;

  try {
    // Get access token
    const tokenResponse = await axios.post(
      'https://api.shutterstock.com/v2/oauth/access_token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SHUTTERSTOCK_CLIENT_ID,
        client_secret: SHUTTERSTOCK_CLIENT_SECRET,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get images
    const { query } = JSON.parse(event.body);
    const imageResponse = await axios.get('https://api.shutterstock.com/v2/images/search', {
      params: { query, per_page: 10 },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(imageResponse.data.data),
    };
  } catch (error) {
    console.error('Error fetching Shutterstock images:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching Shutterstock images' }),
    };
  }
};