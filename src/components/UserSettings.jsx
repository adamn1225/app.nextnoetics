import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SubscriptionModal from './cms/SubscriptionModal';
import AccountSettings from './AccountSettings';
import FbDocs from './SmmModals/FbDocs'; // Import the FbDocs component
import IgDocs from './SmmModals/IgDocs'; // Import the IgDocs component
import LinkedInDocs from './SmmModals/LinkedInDocs'; // Import the LinkedInDocs component
import TwitterDocs from './SmmModals/TwitterDocs'; // Import the TwitterDocs component

const UserSettings = () => {
    const [email] = useState('');
    const [smmKey] = useState('');
    const [facebookAccessToken, setFacebookAccessToken] = useState('');
    const [twitterAccessToken, setTwitterAccessToken] = useState('');
    const [linkedinAccessToken, setLinkedinAccessToken] = useState('');
    const [instagramAccessToken, setInstagramAccessToken] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('integration');
    const [isFbDocsOpen, setIsFbDocsOpen] = useState(false); // State to control the FbDocs modal
    const [isIgDocsOpen, setIsIgDocsOpen] = useState(false); // State to control the IgDocs modal
    const [isLinkedInDocsOpen, setIsLinkedInDocsOpen] = useState(false); // State to control the LinkedInDocs modal
    const [isTwitterDocsOpen, setIsTwitterDocsOpen] = useState(false); // State to control the TwitterDocs modal

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data, error } = await supabase
                    .from('user_access_tokens')
                    .select('platform, access_token')
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error fetching access tokens:', error);
                } else {
                    data.forEach(token => {
                        switch (token.platform) {
                            case 'Facebook':
                                setFacebookAccessToken(token.access_token);
                                break;
                            case 'Twitter':
                                setTwitterAccessToken(token.access_token);
                                break;
                            case 'LinkedIn':
                                setLinkedinAccessToken(token.access_token);
                                break;
                            case 'Instagram':
                                setInstagramAccessToken(token.access_token);
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        };
        fetchUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await fetch('/.netlify/functions/saveUserSettings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, smmKey, facebookAccessToken, twitterAccessToken, linkedinAccessToken, instagramAccessToken }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccessMessage('Settings saved successfully');
            } else {
                setError('Failed to save settings');
            }

        } catch (saveError) {
            console.error('Save Error:', saveError);
            setError('Failed to save settings');
        }
    }

    return (
        <div className="bg-gray-200 dark:bg-zinc-700 min-h-screen flex items-center justify-center w-full">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-secondary">User Settings</h1>
                {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
                {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                {!user && (
                    <div className="mb-4 text-center">
                        <p className="text-red-600 dark:text-red-400 mb-2">Create an account to use the access token settings.</p>
                        <button
                            className="text-blue-500 hover:underline"
                            onClick={() => setIsSubscriptionModalOpen(true)}
                        >
                            Sign Up
                        </button>
                    </div>
                )}
                {user && (
                    <div className="mb-4">
                        <button
                            className={`px-4 py-2 ${activeTab === 'integration' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} rounded-l`}
                            onClick={() => setActiveTab('integration')}
                        >
                            Integration Settings
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} rounded-r`}
                            onClick={() => setActiveTab('account')}
                        >
                            Account Settings
                        </button>
                    </div>
                )}
                {activeTab === 'integration' && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label htmlFor="facebookAccessToken" className="block font-medium text-zinc-900 dark:text-white">Facebook Access Token</label>
                            <input
                                type="text"
                                id="facebookAccessToken"
                                name="facebookAccessToken"
                                placeholder='Enter your Facebook access token'
                                value={facebookAccessToken}
                                onChange={(e) => setFacebookAccessToken(e.target.value)}
                                className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                disabled={!user}
                            />
                            <button
                                type="button"
                                className="text-blue-500 hover:underline mt-2"
                                onClick={() => setIsFbDocsOpen(true)} // Open the FbDocs modal
                            >
                                How to get Facebook Access Token?
                            </button>
                        </div>
                        <div>
                            <label htmlFor="instagramAccessToken" className="block font-medium text-zinc-900 dark:text-white">Instagram Access Token</label>
                            <input
                                type="text"
                                id="instagramAccessToken"
                                name="instagramAccessToken"
                                placeholder='Enter your Instagram access token'
                                value={instagramAccessToken}
                                onChange={(e) => setInstagramAccessToken(e.target.value)}
                                className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                disabled={!user}
                            />
                            <button
                                type="button"
                                className="text-blue-500 hover:underline mt-2"
                                onClick={() => setIsIgDocsOpen(true)} // Open the IgDocs modal
                            >
                                How to get Instagram Access Token?
                            </button>
                        </div>
                        <div>
                            <label htmlFor="linkedinAccessToken" className="block font-medium text-zinc-900 dark:text-white">LinkedIn Access Token</label>
                            <input
                                type="text"
                                id="linkedinAccessToken"
                                name="linkedinAccessToken"
                                placeholder='Enter your LinkedIn access token'
                                value={linkedinAccessToken}
                                onChange={(e) => setLinkedinAccessToken(e.target.value)}
                                className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                disabled={!user}
                            />
                            <button
                                type="button"
                                className="text-blue-500 hover:underline mt-2"
                                onClick={() => setIsLinkedInDocsOpen(true)} // Open the LinkedInDocs modal
                            >
                                How to get LinkedIn Access Token?
                            </button>
                        </div>
                        <div>
                            <label htmlFor="twitterAccessToken" className="block font-medium text-zinc-900 dark:text-white">Twitter Access Token</label>
                            <input
                                type="text"
                                id="twitterAccessToken"
                                name="twitterAccessToken"
                                placeholder='Enter your Twitter access token'
                                value={twitterAccessToken}
                                onChange={(e) => setTwitterAccessToken(e.target.value)}
                                className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                disabled={!user}
                            />
                            <button
                                type="button"
                                className="text-blue-500 hover:underline mt-2"
                                onClick={() => setIsTwitterDocsOpen(true)} // Open the TwitterDocs modal
                            >
                                How to get Twitter Access Token?
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="shadow-md bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                            disabled={!user}
                        >
                            Save Settings
                        </button>
                    </form>
                )}
                {activeTab === 'account' && <AccountSettings />}
            </div>
            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
            />
            <FbDocs
                isOpen={isFbDocsOpen}
                onClose={() => setIsFbDocsOpen(false)}
            />
            <IgDocs
                isOpen={isIgDocsOpen}
                onClose={() => setIsIgDocsOpen(false)}
            />
            <LinkedInDocs
                isOpen={isLinkedInDocsOpen}
                onClose={() => setIsLinkedInDocsOpen(false)}
            />
            <TwitterDocs
                isOpen={isTwitterDocsOpen}
                onClose={() => setIsTwitterDocsOpen(false)}
            />
        </div>
    );
};

export default UserSettings;