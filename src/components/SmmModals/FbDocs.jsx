import React from 'react';

const FbDocs = ({ isOpen, onClose }) => {
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
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Facebook Page Access Token Setup</h2>
        <p className="mb-4 text-gray-700">Follow these steps to get your Facebook Page Access Token:</p>
        <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-2">
          <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Facebook for Developers</a>.</li>
          <li>In My Apps, create a new app (choose "Business" type if posting as a page).</li>
          <li>Add the Facebook Login product and configure it (redirect URI optional for this case).</li>
          <li>Under Permissions and Features, request approval for:
            <ul className="list-disc list-inside ml-4">
              <li>pages_manage_posts</li>
              <li>pages_read_engagement</li>
            </ul>
          </li>
          <li>Go to <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Graph API Explorer</a>.</li>
          <li>Select your app and user, and generate a User Access Token.</li>
          <li>Add these permissions when generating the token:
            <ul className="list-disc list-inside ml-4">
              <li>pages_manage_posts</li>
              <li>pages_read_engagement</li>
            </ul>
          </li>
          <li>Click Get Page Access Token (select the page you want to post on).</li>
          <li>Copy the Page Access Token and paste it into your Facebook Access Token field.</li>
        </ol>
        <div className="flex justify-end gap-2">
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

export default FbDocs;