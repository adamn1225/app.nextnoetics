const express = require('express');
const axios = require('axios');

const app = express();

const FACEBOOK_APP_ID = 'your-facebook-app-id';
const FACEBOOK_APP_SECRET = 'your-facebook-app-secret';
const REDIRECT_URI = 'https://yourdomain.com/auth/facebook/callback';

// Mock database
const database = {
  users: [],
};

app.get('/auth/facebook', (req, res) => {
  const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,pages_read_user_content,pages_manage_metadata,pages_manage_engagement`;
  res.redirect(authUrl);
});

app.get('/auth/facebook/callback', async (req, res) => {
  const { code } = req.query;
  const tokenUrl = `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`;

  try {
    const response = await axios.get(tokenUrl);
    const { access_token } = response.data;

    // Get the list of pages the user manages
    const pagesUrl = `https://graph.facebook.com/me/accounts?access_token=${access_token}`;
    const pagesResponse = await axios.get(pagesUrl);
    const pages = pagesResponse.data.data;

    // Save the access token and pages information in your mock database
    const userId = 'exampleUserId'; // Replace with actual user ID
    database.users.push({
      userId,
      accessToken: access_token,
      pages,
    });

    // Send the pages information back to the client
    res.json({
      message: 'Facebook integration successful!',
      pages,
    });
  } catch (error) {
    console.error('Error during Facebook OAuth flow:', error);
    res.status(500).send('An error occurred during Facebook OAuth flow.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});