const stripe = require('stripe')(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userId, email } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', // or 'payment' for one-time
      line_items: [
        {
          price: 'price_1R1DuAGdOysuZMcPy7JTOeoC', // Replace with your actual Stripe Price ID for Basic Plan
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId, // Useful for later identifying the user
      },
      success_url: `${process.env.CLIENT_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/signup-cancelled`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};