const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const { email, metadata } = session;
    const { password, organizationName, plan } = metadata;

    // Create user profile and organization
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      const userId = signUpData.user?.id;

      if (!userId) {
        throw new Error('User creation failed.');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ user_id: userId, email, name: email.split('@')[0], plan, subscription_id: session.subscription }]);

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Create organization
      const orgName = organizationName || `${email.split('@')[0]}'s Organization`;

      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: orgName }])
        .select()
        .single();

      if (orgError) {
        throw new Error(orgError.message);
      }

      const organizationId = orgData.id;

      // Update profile with organization_id
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ organization_id: organizationId })
        .eq('user_id', userId);

      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }

      // Add to organization_members table
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{ organization_id: organizationId, user_id: userId, role: 'client' }]);

      if (memberError) {
        throw new Error(memberError.message);
      }

    } catch (error) {
      console.error('Error creating user profile and organization:', error);
      return {
        statusCode: 500,
        body: `Error creating user profile and organization: ${error.message}`,
      };
    }
  }

  return {
    statusCode: 200,
    body: 'Success',
  };
};