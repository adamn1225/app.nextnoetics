// filepath: /home/adam-noah/app.nextnoetics/src/components/cms/user/FetchImages.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FetchImages = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('nature');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post('/.netlify/functions/fetch-images', { query });
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching Shutterstock images:', error);
      }
    };

    fetchImages();
  }, [query]);

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
          <div key={image.id} className="cursor-pointer" onClick={() => onSelectImage(image.assets.preview.url)}>
            <img src={image.assets.preview.url} alt={image.description || 'Shutterstock Image'} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FetchImages;