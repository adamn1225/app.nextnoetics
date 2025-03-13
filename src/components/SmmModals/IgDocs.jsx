import React from 'react';
import { Link } from 'react-router-dom';

const IgDocs = ({ isOpen, onClose }) => {
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Instagram Access Token Setup</h2>
        <p className="mb-4 text-gray-700">Follow these steps to get your Instagram Access Token:</p>
        <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2">
          <li>Follow the <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Facebook Access Token</a> steps above.</li>
          <li>Ensure the <code className="bg-gray-200 px-1 rounded">instagram_basic</code> and <code className="bg-gray-200 px-1 rounded">instagram_content_publish</code> permissions are added.</li>
          <li>In the <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Graph API Explorer</a>, retrieve an Instagram Business Account ID:
            <ul className="list-disc list-inside ml-4">
              <li>Query: <code className="bg-gray-200 px-1 rounded">/me/accounts?fields=instagram_business_account</code></li>
            </ul>
          </li>
          <li>Use the Page Access Token to post on Instagram via your app.</li>
          <li>Paste the Page Access Token into the Instagram Access Token field.</li>
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

export default IgDocs;