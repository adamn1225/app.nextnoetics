import React from 'react';
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { SiFacebook, SiInstagram } from "react-icons/si";

const IntegrationDocs = () => {
  const handleSSO = (platform) => {
    // Implement the SSO logic here
    // This could involve redirecting to the OAuth endpoint for the platform
    console.log(`SSO for ${platform}`);
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 overflow-y-auto h-[100vh] flex">
      <nav className="w-64 bg-white h-[100vh] dark:bg-zinc-900 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Setup Guides</h2>
        <ul className="space-y-2">
          <li>
            <a href="#facebook" className="flex items-center text-blue-500 dark:text-gray-300 hover:underline">
              <SiFacebook className="mr-2" />
              Facebook
            </a>
          </li>
          <li>
            <a href="#instagram" className="flex items-center text-blue-500 dark:text-gray-300 hover:underline">
              <SiInstagram className="mr-2" />
              Instagram
            </a>
          </li>
          <li>
            <a href="#linkedin" className="flex items-center text-blue-500 dark:text-gray-300 hover:underline">
              <FaLinkedin className="mr-2" />
              LinkedIn
            </a>
          </li>
          <li>
            <a href="#twitter" className="flex items-center text-blue-500 dark:text-gray-300 hover:underline">
              <FaTwitter className="mr-2" />
              Twitter
            </a>
          </li>
        </ul>
      </nav>
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Access Token Setup Guide for Social Media Platforms</h1>
        
        <section id="facebook" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Facebook Page Access Token (for Page Posting)</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">🔧 <strong>Prerequisites:</strong></p>
          <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>A Facebook Page (not a profile)</li>
            <li>A Facebook Developer Account (<a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">https://developers.facebook.com</a>)</li>
            <li>An App registered in the Facebook Developers portal</li>
            <li>Manage Pages + Publish Pages permissions</li>
          </ul>
          <p className="mb-2 text-gray-700 dark:text-gray-300">✅ <strong>Steps:</strong></p>
          <button
            onClick={() => handleSSO('Facebook')}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          >
            <SiFacebook className="inline-block mr-2" />
            Sign in with Facebook
          </button>
        </section>

        <section id="instagram" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Instagram Access Token (for Business Accounts)</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">Instagram uses Facebook Graph API for Business accounts (this doesn’t work for personal accounts).</p>
          <p className="mb-2 text-gray-700 dark:text-gray-300">🔧 <strong>Prerequisites:</strong></p>
          <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>An Instagram Business Account</li>
            <li>Connected to a Facebook Page</li>
            <li>Facebook Developer App setup as above</li>
          </ul>
          <p className="mb-2 text-gray-700 dark:text-gray-300">✅ <strong>Steps:</strong></p>
          <button
            onClick={() => handleSSO('Instagram')}
            className="bg-pink-500 text-white py-2 px-4 rounded mb-4"
          >
            <SiInstagram className="inline-block mr-2" />
            Sign in with Instagram
          </button>
        </section>

        <section id="linkedin" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">LinkedIn Access Token (for Company Page or Profile Posting)</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">🔧 <strong>Prerequisites:</strong></p>
          <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>A LinkedIn Developer Account (<a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">LinkedIn Developers</a>)</li>
            <li>An App created in LinkedIn Developer Portal</li>
          </ul>
          <p className="mb-2 text-gray-700 dark:text-gray-300">✅ <strong>Steps:</strong></p>
          <button
            onClick={() => handleSSO('LinkedIn')}
            className="bg-blue-700 text-white py-2 px-4 rounded mb-4"
          >
            <FaLinkedin className="inline-block mr-2" />
            Sign in with LinkedIn
          </button>
        </section>

        <section id="twitter" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Twitter/X Access Token (for Tweet Posting)</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">🔧 <strong>Prerequisites:</strong></p>
          <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Twitter Developer Account (<a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">developer.twitter.com</a>)</li>
            <li>A Project & App created</li>
          </ul>
          <p className="mb-2 text-gray-700 dark:text-gray-300">✅ <strong>Steps:</strong></p>
          <button
            onClick={() => handleSSO('Twitter')}
            className="bg-blue-400 text-white py-2 px-4 rounded mb-4"
          >
            <FaTwitter className="inline-block mr-2" />
            Sign in with Twitter
          </button>
        </section>
      </div>
    </div>
  );
};

export default IntegrationDocs;