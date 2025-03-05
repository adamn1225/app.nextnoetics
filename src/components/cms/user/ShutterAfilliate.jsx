import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SHUTTERSTOCK_CLIENT_ID = process.env.NEXT_PUBLIC_SHUTTERSTOCK_CLIENT_ID;
const SHUTTERSTOCK_CLIENT_SECRET = process.env.NEXT_PUBLIC_SHUTTERSTOCK_CLIENT_SECRET;
const SHUTTERSTOCK_AFFILIATE_ID = process.env.NEXT_PUBLIC_SHUTTERSTOCK_AFFILIATE_ID; // Add this

const ShutterAffiliate = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('nature');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await axios.post(
          'https://api.shutterstock.com/v2/oauth/access_token',
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: SHUTTERSTOCK_CLIENT_ID,
            client_secret: SHUTTERSTOCK_CLIENT_SECRET,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error('Error fetching Shutterstock access token:', error);
      }
    };

    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchImages = async () => {
      try {
        const response = await axios.get('https://api.shutterstock.com/v2/images/search', {
          params: { query, per_page: 10 },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setImages(response.data.data);
      } catch (error) {
        console.error('Error fetching Shutterstock images:', error);
      }
    };

    fetchImages();
  }, [query, accessToken]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for images"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="cursor-pointer">
            <img
              src={image.assets.preview.url}
              alt={image.description || 'Shutterstock Image'}
              className="w-full h-auto"
            />
            {/* Affiliate Link */}
            <a
              href={`https://www.shutterstock.com/g/${SHUTTERSTOCK_AFFILIATE_ID}?rid=${SHUTTERSTOCK_AFFILIATE_ID}&searchterm=${query}&image_id=${image.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 mt-2 text-center"
            >
              License This Image on Shutterstock
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShutterAffiliate;
