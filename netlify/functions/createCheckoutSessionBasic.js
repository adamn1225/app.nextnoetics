const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
    const { email, password, organizationName } = JSON.parse(event.body);

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email,
      metadata: {
        organizationName,
      },
    });

    // Create a new subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1R1DuAGdOysuZMcPy7JTOeoC', // Replace with your actual Stripe Price ID
          quantity: 1,
        },
      ],
      customer: customer.id,
      metadata: {
        email,
        password,
        organizationName,
      },
      success_url: `${process.env.CLIENT_URL}/signup-basic?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/signup-cancelled`,
    });

    // Store the subscription_id in the profiles table
    const {  error } = await supabase
      .from('profiles')
      .update({ subscription_id: session.subscription })
      .eq('email', email);

    if (error) {
      throw new Error(error.message);
    }

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