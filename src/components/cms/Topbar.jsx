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
    limit: 2,
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

export const Topbar = ({ openSubscriptionModal, templates = [], handleAddEvent }) => {
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
    const [schedulePost, setSchedulePost] = useState('No'); // New state for scheduling post
    const [formValues, setFormValues] = useState({
      title: '',
      description: '',
      post_due_date: '',
      sm_platform: 'Facebook',
      status: 'Draft',
      post_automatically: false,
      template_id: '',
    });

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

    const handleScheduleChange = (e) => {
        setSchedulePost(e.target.value);
    };

    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (schedulePost === 'Yes') {
            await handleAddEvent(e);
        }
        await handleSaveTemplate();
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
                <label className="block text-sm font-medium text-gray-700">Schedule Post?</label>
                <select
                    value={schedulePost}
                    onChange={handleScheduleChange}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
                {schedulePost === 'Yes' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formValues.title || ''}
                                onChange={handleFormChange}
                                required
                                className="mt-1 p-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-950">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formValues.description || ''}
                                onChange={handleFormChange}
                                required
                                className="mt-1 p-1 text-gray-950 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="post_due_date" className="block text-sm font-medium text-gray-700">Post Due Date</label>
                            <input
                                type="datetime-local"
                                id="post_due_date"
                                name="post_due_date"
                                value={formValues.post_due_date || ''}
                                onChange={handleFormChange}
                                required
                                className="mt-1 p-1 text-gray-950 block w-full border border-gray-300  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="sm_platform" className="block text-sm font-medium text-gray-950">Social Media Platform</label>
                            <select
                                id="sm_platform"
                                name="sm_platform"
                                value={formValues.sm_platform || 'Facebook'}
                                onChange={handleFormChange}
                                required
                                className="mt-1 p-1 block w-full border text-gray-950 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Facebook">Facebook</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="TikTok">TikTok</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-950">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formValues.status || 'Draft'}
                                onChange={handleFormChange}
                                required
                                className="mt-1 p-1 text-gray-950 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Draft">Draft</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <label htmlFor="post_automatically" className="block text-sm font-medium  text-gray-950 mr-2">Auto Post?</label>
                            <input
                                type="checkbox"
                                id="post_automatically"
                                name="post_automatically"
                                checked={formValues.post_automatically || false}
                                onChange={handleFormChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="template_id" className="block text-sm font-medium  text-gray-950">Template</label>
                            <select
                                id="template_id"
                                name="template_id"
                                value={formValues.template_id || ''}
                                onChange={handleFormChange}
                                className="mt-1 p-1 block w-full text-gray-950 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">None</option>
                                {templates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                <div className="flex flex-wrap justify-center gap-1 text-gray-950">
                    <button
                        className="text-sm px-1 py-1 border bg-blue-500 shadow-md text-white hover:bg-blue-600 hover:text-white"
                        onClick={handleSubmit}
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