const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, facebookAccessToken, twitterAccessToken, linkedinAccessToken, instagramAccessToken } = JSON.parse(event.body);

    // Insert user access tokens into the user_access_tokens table
    const { error } = await supabase
      .from('user_access_tokens')
      .insert([
        {
          user_id: email, // Assuming email is used as user_id
          platform: 'facebook',
          access_token: facebookAccessToken,
        },
        {
          user_id: email,
          platform: 'twitter',
          access_token: twitterAccessToken,
        },
        {
          user_id: email,
          platform: 'linkedin',
          access_token: linkedinAccessToken,
        },
        {
          user_id: email,
          platform: 'instagram',
          access_token: instagramAccessToken,
        },
      ]);

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error('Save User Settings Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};