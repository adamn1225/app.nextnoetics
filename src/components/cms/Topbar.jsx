"use client";
import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { supabase } from '../../lib/supabaseClient';
import lz from "lzutf8";
import copy from 'copy-to-clipboard';

const subscriptionPlans = {
  freemium: {
    name: 'Freemium',
    limit: 0,
  },
  free: {
    name: 'Free',
    limit: 5,
  },
  basic: {
    name: 'Basic',
    limit: 10,
  },
  pro: {
    name: 'Pro',
    limit: 50,
  },
  enterprise: {
    name: 'Enterprise',
    limit: Infinity, // No limit for enterprise
  },
};

export const Topbar = ({ openSubscriptionModal }) => {
    const { actions, query } = useEditor();
    const [isEnabled, setIsEnabled] = useState(true);
    const [templateName, setTemplateName] = useState('');
    const [description, setDescription] = useState(''); // New state for description
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [stateToLoad, setStateToLoad] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleToggle = () => {
        setIsEnabled(!isEnabled);
    };

    const handleSaveTemplate = async () => {
        setLoading(true);
        setError(null);

        // Fetch the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            setError('You need to be logged in to save templates.');
            setLoading(false);
            openSubscriptionModal(); // Open the subscription modal
            return;
        }

        // Fetch the user's profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();

        if (profileError) {
            setError(profileError.message);
            setLoading(false);
            return;
        }

        const userPlan = profile.plan;

        // Check if the user is on the freemium plan
        if (userPlan === 'freemium') {
            setError('You need to upgrade your subscription to save templates.');
            setLoading(false);
            openSubscriptionModal(); // Open the subscription modal
            return;
        }

        try {
            // Fetch the number of templates the user has already saved
            const { data: templates, error: fetchError } = await supabase
                .from('templates')
                .select('*')
                .eq('user_id', user.id);

            if (fetchError) {
                setError(fetchError.message);
                setLoading(false);
                return;
            }

            // Check if the user has exceeded their plan's limit
            const plan = subscriptionPlans[userPlan];
            if (templates.length >= plan.limit) {
                setError(`You have reached the limit of ${plan.limit} templates for the ${plan.name} plan. Please upgrade your subscription.`);
                setLoading(false);
                openSubscriptionModal(); // Open the subscription modal
                return;
            }

            const jsonData = query.serialize();

            const { error } = await supabase
                .from('templates')
                .insert([{ name: templateName, description, sections: jsonData, user_id: user.id }]); // Include description

            if (error) {
                setError(error.message);
            } else {
                alert('Template saved successfully!');
            }
        } catch (e) {
            setError('Invalid JSON data');
        }

        setLoading(false);
    };

    const handleCopyState = () => {
        const json = query.serialize();
        copy(lz.encodeBase64(lz.compress(json)));
        setSnackbarMessage("State copied to clipboard");
    };

    const handleLoadState = () => {
        try {
            const json = lz.decompress(lz.decodeBase64(stateToLoad));
            actions.deserialize(json);
            setSnackbarMessage("State loaded");
        } catch (e) {
            setError('Invalid compressed state');
        }
    };

    const handleSerialize = () => {
        const json = query.serialize();
        console.log(json);
    };

    return (
        <div className="mb-2 py-4 px-12 bg-gray-50 text-gray-950 w-full shadow-lg rounded-sm">
            <div className="flex flex-col justify-center items-center gap-1">
                <div className="hidden flex-1">
                    <label className="flex items-center">
                        <input type="checkbox" checked={isEnabled} onChange={handleToggle} className="mr-2" />
                        <span>Enable JSON</span>
                    </label>
                </div>
                <h3 className="text-gray-950 font-semibold text-lg">Save Template</h3>
                <input
                    type="text"
                    placeholder="Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-fit p-2 border border-gray-300 rounded mb-2"
                />
                <textarea
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <div className="flex flex-wrap justify-center gap-1 text-gray-950">
                    <button
                        className="text-sm px-1 py-1 border bg-blue-500 shadow-md text-white hover:bg-blue-600 hover:text-white"
                        onClick={handleSaveTemplate}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Template'}
                    </button>

                    <button
                        className="text-sm px-1 py-1 border shadow-md text-white hover:bg-blue-600 hover:text-white bg-blue-500"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                    </button>
                </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>

            {showAdvanced && (
                <div className="mt-2 flex gap-1 justify-center">
                    <button
                        className="text-sm px-1 py-1 border bg-blue-500 shadow-md text-white hover:bg-blue-600 hover:text-white"
                        onClick={handleSerialize}
                    >
                        Serialize JSON to console
                    </button>
                    <button
                        className="text-sm px-1 py-1 border shadow-md text-white hover:bg-blue-600 hover:text-white bg-blue-500"
                        onClick={() => setDialogOpen(true)}
                    >
                        Load State
                    </button>
                    <button
                        className="text-sm px-1 py-1 border shadow-md text-white hover:bg-blue-600 hover:text-white bg-blue-500"
                        onClick={handleCopyState}
                    >
                        Copy State
                    </button>
                </div>
            )}

            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-gray-950 p-6 rounded-lg shadow-lg relative">
                        <button onClick={() => setDialogOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                            &times;
                        </button>
                        <h2>Load State</h2>
                        <textarea
                            placeholder='Paste the compressed state here'
                            value={stateToLoad}
                            onChange={(e) => setStateToLoad(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-2"
                        />
                        <button onClick={handleLoadState} className="bg-blue-500 text-white p-2 rounded">
                            Load State
                        </button>
                    </div>
                </div>
            )}

            {snackbarMessage && (
                <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-2 text-center">
                    {snackbarMessage}
                </div>
            )}
        </div>
    );
};