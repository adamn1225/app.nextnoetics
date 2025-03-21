import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import SubscriptionModal from './cms/SubscriptionModal';
import AccountSettings from './AccountSettings';
import FbDocs from './SmmModals/FbDocs';
import IgDocs from './SmmModals/IgDocs';
import LinkedInDocs from './SmmModals/LinkedInDocs';
import TwitterDocs from './SmmModals/TwitterDocs';
import { Eye, EyeOff } from 'lucide-react';

const UserSettings = () => {
    const [facebookAccessToken, setFacebookAccessToken] = useState('');
    const [twitterAccessToken, setTwitterAccessToken] = useState('');
    const [linkedinAccessToken, setLinkedinAccessToken] = useState('');
    const [instagramAccessToken, setInstagramAccessToken] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('integration');
    const [isFbDocsOpen, setIsFbDocsOpen] = useState(false);
    const [isIgDocsOpen, setIsIgDocsOpen] = useState(false);
    const [isLinkedInDocsOpen, setIsLinkedInDocsOpen] = useState(false);
    const [isTwitterDocsOpen, setIsTwitterDocsOpen] = useState(false);
    const [showTokens, setShowTokens] = useState({
        facebook: false,
        instagram: false,
        linkedin: false,
        twitter: false,
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching session:', error);
                return;
            }
            setUser(session.user);

            if (session.user) {
                const { data, error } = await supabase
                    .from('user_access_tokens')
                    .select('platform, access_token')
                    .eq('user_id', session.user.id);

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
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('User not authenticated');
                return;
            }

            const platforms = [
                { platform: 'Facebook', token: facebookAccessToken },
                { platform: 'Twitter', token: twitterAccessToken },
                { platform: 'LinkedIn', token: linkedinAccessToken },
                { platform: 'Instagram', token: instagramAccessToken },
            ];

            for (const { platform, token } of platforms) {
                if (token) {
                    const { data: existingToken, error: fetchError } = await supabase
                        .from('user_access_tokens')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('platform', platform)
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') {
                        throw fetchError;
                    }

                    let upsertError;
                    if (existingToken) {
                        // Update the existing access token
                        const { error } = await supabase
                            .from('user_access_tokens')
                            .update({ access_token: token })
                            .eq('id', existingToken.id);
                        upsertError = error;
                    } else {
                        // Insert a new access token
                        const { error } = await supabase
                            .from('user_access_tokens')
                            .insert({ user_id: user.id, platform, access_token: token });
                        upsertError = error;
                    }

                    if (upsertError) {
                        throw upsertError;
                    }
                }
            }

            setSuccessMessage('Settings saved successfully');
        } catch (saveError) {
            console.error('Save Error:', saveError);
            setError('Failed to save settings');
        }
    };

    const toggleShowToken = (platform) => {
        setShowTokens((prev) => ({
            ...prev,
            [platform]: !prev[platform],
        }));
    };

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
                            <div className="relative">
                                <input
                                    type={showTokens.facebook ? 'text' : 'password'}
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
                                    className="absolute right-2 top-2"
                                    onClick={() => toggleShowToken('facebook')}
                                >
                                    {showTokens.facebook ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
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
                            <div className="relative">
                                <input
                                    type={showTokens.instagram ? 'text' : 'password'}
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
                                    className="absolute right-2 top-2"
                                    onClick={() => toggleShowToken('instagram')}
                                >
                                    {showTokens.instagram ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
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
                            <div className="relative">
                                <input
                                    type={showTokens.linkedin ? 'text' : 'password'}
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
                                    className="absolute right-2 top-2"
                                    onClick={() => toggleShowToken('linkedin')}
                                >
                                    {showTokens.linkedin ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
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
                            <div className="relative">
                                <input
                                    type={showTokens.twitter ? 'text' : 'password'}
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
                                    className="absolute right-2 top-2"
                                    onClick={() => toggleShowToken('twitter')}
                                >
                                    {showTokens.twitter ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
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