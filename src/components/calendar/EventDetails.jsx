import React from 'react';
import { CircleX } from 'lucide-react';

const EventDetails = ({ formValues, handleChange, handleUpdateEvent, handleDeleteEvent, setIsEventDetailsModalVisible, templates }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                <span className="text-gray-600 dark:text-gray-300 cursor-pointer float-right mb-2" onClick={() => setIsEventDetailsModalVisible(false)}><CircleX /></span>
                <form onSubmit={handleUpdateEvent} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formValues.title || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formValues.description || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="post_due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Due Date</label>
                        <input
                            type="datetime-local"
                            id="post_due_date"
                            name="post_due_date"
                            value={formValues.post_due_date || ''}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="sm_platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Social Media Platform</label>
                        <select
                            id="sm_platform"
                            name="sm_platform"
                            value={formValues.sm_platform || 'Facebook'}
                            onChange={handleChange}
                            required
                            className="mt-1 p-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Facebook">Facebook</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="TikTok">TikTok</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formValues.status || 'Draft'}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label htmlFor="post_automatically" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Auto Post?</label>
                        <input
                            type="checkbox"
                            id="post_automatically"
                            name="post_automatically"
                            checked={formValues.post_automatically || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded"
                        />
                    </div>
                    <div>
                        <label htmlFor="template_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Template</label>
                        <select
                            id="template_id"
                            name="template_id"
                            value={formValues.template_id || ''}
                            onChange={handleChange}
                            className="mt-1 p-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">None</option>
                            {templates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-500">Update Event</button>
                        <button type="button" onClick={handleDeleteEvent} className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700">Delete Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventDetails;