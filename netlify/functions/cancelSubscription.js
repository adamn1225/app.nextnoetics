const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    const { subscriptionId } = JSON.parse(event.body);

    try {
        const deletedSubscription = await stripe.subscriptions.del(subscriptionId);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, subscription: deletedSubscription }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};