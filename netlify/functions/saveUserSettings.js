const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { accessToken, facebookAccessToken, twitterAccessToken, linkedinAccessToken, instagramAccessToken } = JSON.parse(event.body);

    // Fetch the user from Supabase using the access token
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !user) {
      throw new Error('User not found');
    }

    // Insert user access tokens into the user_access_tokens table
    const { error } = await supabase
      .from('user_access_tokens')
      .insert([
        {
          user_id: user.id,
          platform: 'facebook',
          access_token: facebookAccessToken,
        },
        {
          user_id: user.id,
          platform: 'twitter',
          access_token: twitterAccessToken,
        },
        {
          user_id: user.id,
          platform: 'linkedin',
          access_token: linkedinAccessToken,
        },
        {
          user_id: user.id,
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