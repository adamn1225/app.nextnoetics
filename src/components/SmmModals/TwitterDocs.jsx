import React from 'react';
import { Link } from 'react-router-dom';

const TwitterDocs = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Twitter Access Token Setup</h2>
        <p className="mb-4 text-gray-700">Follow these steps to get your Twitter Access Token:</p>
        <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2">
          <li>Go to <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Twitter Developer Portal</a>.</li>
          <li>Create a Project and then an App.</li>
          <li>In Keys & Tokens, generate:
            <ul className="list-disc list-inside ml-4">
              <li>API Key</li>
              <li>API Key Secret</li>
              <li>Bearer Token</li>
            </ul>
          </li>
          <li>Under User authentication settings, enable OAuth 1.0a.</li>
          <li>Generate:
            <ul className="list-disc list-inside ml-4">
              <li>Access Token</li>
              <li>Access Token Secret</li>
            </ul>
          </li>
          <li>Copy the Access Token and paste it into your Twitter Access Token field.</li>
        </ol>
        <div className="flex justify-between items-end gap-2">
        <Link to="/docs" className="text-blue-500 underline">See full Documentation</Link>
          <button
            className="px-4 py-2 bg-gray-100 text-gray-900 rounded hover:bg-gray-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwitterDocs;