const stripe = require('stripe')(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, password, organizationName } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', // or 'payment' for one-time
      line_items: [
        {
          price: 'price_1R1DluGdOysuZMcPsRQeeY1u', // Replace with your actual Stripe Price ID for Pro Plan
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        email,
        password,
        organizationName,
        plan: 'pro', // Indicate that this is for the Pro plan
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