import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AddAccessToken = ({ onClose }) => {
    const [platform, setPlatform] = useState('Facebook');
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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

            const { error } = await supabase
                .from('user_access_tokens')
                .upsert({ user_id: user.id, platform, access_token: accessToken });

            if (error) {
                throw error;
            }

            setSuccessMessage('Access token saved successfully');
            onClose();
        } catch (saveError) {
            console.error('Save Error:', saveError);
            setError('Failed to save access token');
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label htmlFor="platform" className="block font-medium text-zinc-900 dark:text-white">Platform</label>
                <select
                    id="platform"
                    name="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                >
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                </select>
            </div>
            <div>
                <label htmlFor="accessToken" className="block font-medium text-zinc-900 dark:text-white">Access Token</label>
                <input
                    type="text"
                    id="accessToken"
                    name="accessToken"
                    placeholder="Enter your access token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                    required
                />
            </div>
            {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
            {successMessage && <p className="text-green-600 dark:text-green-400">{successMessage}</p>}
            <button
                type="submit"
                className="shadow-md bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
                Save Access Token
            </button>
        </form>
    );
};

export default AddAccessToken;