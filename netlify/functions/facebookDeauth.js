const crypto = require('crypto');

exports.handler = async (event, context) => {
  const APP_SECRET = process.env.APP_SECRET;

  const verifyRequest = (req) => {
    const signature = req.headers['x-hub-signature'];
    if (!signature) {
      throw new Error('No X-Hub-Signature found on request');
    } else {
      const elements = signature.split('=');
      const signatureHash = elements[1];
      const expectedHash = crypto
        .createHmac('sha1', APP_SECRET)
        .update(req.body)
        .digest('hex');

      if (signatureHash !== expectedHash) {
        throw new Error('Invalid X-Hub-Signature');
      }
    }
  };

  try {
    const req = {
      headers: event.headers,
      body: event.body,
    };

    verifyRequest(req);

    const { user_id } = JSON.parse(event.body);

    // Handle the deauthorization request here
    // For example, delete user data from your database

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${user_id} deauthorized the app.`,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: 'Invalid request',
    };
  }
};