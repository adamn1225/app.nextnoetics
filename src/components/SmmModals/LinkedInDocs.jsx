import React from 'react';
import { Link } from 'react-router-dom';

const LinkedInDocs = ({ isOpen, onClose }) => {
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">LinkedIn Access Token Setup</h2>
        <p className="mb-4 text-gray-700">Follow these steps to get your LinkedIn Access Token:</p>
        <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2">
          <li>Go to <a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">LinkedIn Developers</a>.</li>
          <li>Create a new App (fill in company and details).</li>
          <li>In Products, add Sign In with LinkedIn and Share on LinkedIn.</li>
          <li>In Auth, get your:
            <ul className="list-disc list-inside ml-4">
              <li>Client ID</li>
              <li>Client Secret</li>
            </ul>
          </li>
          <li>Use Postman or a tool like curl to generate an Access Token:
            <ul className="list-disc list-inside ml-4">
              <li>Send a POST request to <code className="bg-gray-200 px-1 rounded">https://www.linkedin.com/oauth/v2/accessToken</code></li>
              <li>Params:
                <ul className="list-disc list-inside ml-4">
                  <li><code className="bg-gray-200 px-1 rounded">grant_type: client_credentials</code></li>
                  <li><code className="bg-gray-200 px-1 rounded">client_id: your_client_id</code></li>
                  <li><code className="bg-gray-200 px-1 rounded">client_secret: your_client_secret</code></li>
                </ul>
              </li>
            </ul>
          </li>
          <li>Response will return an <code className="bg-gray-200 px-1 rounded">access_token</code>. Copy this into your LinkedIn Access Token field.</li>
          <li>Note: Client Credentials grant gives you application-level access. If you want to post as a user, you'd use the Authorization Code flow.</li>
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

export default LinkedInDocs;