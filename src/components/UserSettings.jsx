import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const UserSettings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [smmKey, setSmmKey] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [facebookAccessToken, setFacebookAccessToken] = useState('');
    const [twitterAccessToken, setTwitterAccessToken] = useState('');
    const [linkedinAccessToken, setLinkedinAccessToken] = useState('');
    const [instagramAccessToken, setInstagramAccessToken] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // 🚀 Save User Settings
        try {
            const response = await fetch('/.netlify/functions/saveUserSettings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, smmKey, facebookAccessToken, twitterAccessToken, linkedinAccessToken, instagramAccessToken }),
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
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block font-medium text-zinc-900 dark:text-white">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter a valid email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                            required
                            disabled={!user}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block font-medium text-zinc-900 dark:text-white">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder='At least 8 characters'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow-sm w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                            required
                            disabled={!user}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block font-medium text-zinc-900 dark:text-white">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder='Confirm your password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow-sm w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                            required
                            disabled={!user}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
                        >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    <div>
                        <label htmlFor="smmKey" className="block font-medium text-zinc-900 dark:text-white">SMM Key</label>
                        <input
                            type="text"
                            id="smmKey"
                            name="smmKey"
                            placeholder='Enter your SMM key'
                            value={smmKey}
                            onChange={(e) => setSmmKey(e.target.value)}
                            className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                            disabled={!user}
                        />
                    </div>
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
                    </div>
                    <button
                        type="submit"
                        className="shadow-md bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                        disabled={!user}
                    >
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserSettings;