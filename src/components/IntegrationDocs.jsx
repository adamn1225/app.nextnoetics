import React from 'react';
import { FaLinkedin } from "react-icons/fa";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";

const IntegrationDocs = () => {
  return (
    <div className="bg-gray-100 dark:bg-zinc-800  flex">
      <nav className="w-64 bg-white h-screen dark:bg-zinc-900 p-6 shadow-lg">
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
            Instagram</a>
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
          <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Go to Facebook for Developers.</li>
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
          <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Follow the Facebook Access Token steps above.</li>
            <li>Ensure the <code className="bg-gray-200 px-1 rounded">instagram_basic</code> and <code className="bg-gray-200 px-1 rounded">instagram_content_publish</code> permissions are added.</li>
            <li>In the Graph API Explorer, retrieve an Instagram Business Account ID:
              <ul className="list-disc list-inside ml-4">
                <li>Query: <code className="bg-gray-200 px-1 rounded">/me/accounts?fields=instagram_business_account</code></li>
              </ul>
            </li>
            <li>Use the Page Access Token to post on Instagram via your app.</li>
            <li>Paste the Page Access Token into the Instagram Access Token field.</li>
          </ol>
        </section>

        <section id="linkedin" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">LinkedIn Access Token (for Company Page or Profile Posting)</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">🔧 <strong>Prerequisites:</strong></p>
          <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>A LinkedIn Developer Account (<a href="https://www.linkedin.com/developers/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">LinkedIn Developers</a>)</li>
            <li>An App created in LinkedIn Developer Portal</li>
          </ul>
          <p className="mb-2 text-gray-700 dark:text-gray-300">✅ <strong>Steps:</strong></p>
          <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Go to LinkedIn Developers.</li>
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
        </section>

        <section id="twitter" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Twitter/X Access Token (for Tweet Posting)</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">🔧 <strong>Prerequisites:</strong></p>
          <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">
            <li>Twitter Developer Account (<a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">developer.twitter.com</a>)</li>
            <li>A Project & App created</li>
          </ul>
          <p className="mb-2 text-gray-700 dark:text-gray-300">✅ <strong>Steps:</strong></p>
          <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-2">
            <li>Go to Twitter Developer Portal.</li>
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
        </section>
      </div>
    </div>
  );
};

export default IntegrationDocs;