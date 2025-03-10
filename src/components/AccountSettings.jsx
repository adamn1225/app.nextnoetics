import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AccountSettings = () => {
    const [user, setUser] = useState(null);
    const [subscriptionId, setSubscriptionId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch the subscription ID from your database
                const { data, error } = await supabase
                    .from('profiles')
                    .select('subscription_id')
                    .eq('user_id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching subscription ID:', error);
                } else {
                    setSubscriptionId(data.subscription_id);
                }
            }
        };
        fetchUser();
    }, []);

    const handleCancelSubscription = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/.netlify/functions/cancelSubscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscriptionId }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage('Subscription canceled successfully');
                setSubscriptionId('');
            } else {
                setError('Failed to cancel subscription');
            }
        } catch (cancelError) {
            console.error('Cancel Error:', cancelError);
            setError('Failed to cancel subscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-200 dark:bg-zinc-700 min-h-fit flex items-center justify-center w-full">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-secondary">Account Settings</h1>
                {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
                {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                {user && subscriptionId && (
                    <div className="mb-4 text-center">
                        <p className="text-zinc-900 dark:text-white mb-2">You have an active subscription.</p>
                        <button
                            className="text-red-500 hover:underline"
                            onClick={handleCancelSubscription}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Canceling...' : 'Cancel Subscription'}
                        </button>
                    </div>
                )}
                {!subscriptionId && (
                    <div className="mb-4 text-center h-min">
                        <p className="text-zinc-900 dark:text-white mb-2">You do not have an active subscription.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;