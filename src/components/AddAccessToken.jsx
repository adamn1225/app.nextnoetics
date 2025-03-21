import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

const AddAccessToken = ({ onClose }) => {
    const [platform, setPlatform] = useState('Facebook');
    const [accessToken, setAccessToken] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showToken, setShowToken] = useState(false);

    useEffect(() => {
        const fetchAccessToken = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('User not authenticated');
                return;
            }

            const { data, error } = await supabase
                .from('user_access_tokens')
                .select('access_token')
                .eq('user_id', user.id)
                .eq('platform', platform)
                .single();

            if (error && error.code !== 'PGRST116') {
                setError('Error fetching access token');
            } else if (data) {
                setAccessToken(data.access_token);
            }
        };

        fetchAccessToken();
    }, [platform]);

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
                    .update({ access_token: accessToken })
                    .eq('id', existingToken.id);
                upsertError = error;
            } else {
                // Insert a new access token
                const { error } = await supabase
                    .from('user_access_tokens')
                    .insert({ user_id: user.id, platform, access_token: accessToken });
                upsertError = error;
            }

            if (upsertError) {
                throw upsertError;
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
                <div className="relative">
                    <input
                        type={showToken ? 'text' : 'password'}
                        id="accessToken"
                        name="accessToken"
                        placeholder="Enter your access token"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                        required
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-2"
                        onClick={() => setShowToken(!showToken)}
                    >
                        {showToken ? <EyeOff /> : <Eye />}
                    </button>
                </div>
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