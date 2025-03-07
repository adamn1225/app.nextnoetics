import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DraggableImages from './DraggableImages';

const UrlConverter = ({ onConvert }) => {
  const [urls, setUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [headers, setHeaders] = useState({ h1: '', h2: '', h3: '', h4: '' });

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    setImages([]);
    setSelectedImage('');

    try {
      const allData = await Promise.all(urls.map(async (url) => {
        let formattedUrl = url;
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = 'http://' + formattedUrl;
        }

        const response = await axios.get(`/.netlify/functions/fetch-urls?url=${encodeURIComponent(formattedUrl)}`);
        return response.data;
      }));

      const mergedData = allData.reduce((acc, data) => {
        acc.images = [...acc.images, ...data.images];
        acc.h1 = acc.h1 || data.h1;
        acc.h2 = acc.h2 || data.h2;
        acc.h3 = acc.h3 || data.h3;
        acc.h4 = acc.h4 || data.h4;
        return acc;
      }, { images: [], h1: '', h2: '', h3: '', h4: '' });

      const shuffledImages = shuffleArray(mergedData.images);
      setImages(shuffledImages);
      setHeaders({ h1: mergedData.h1, h2: mergedData.h2, h3: mergedData.h3, h4: mergedData.h4 });
      onConvert({ h1: mergedData.h1 || 'Default Header', h2: mergedData.h2 || 'Default Subtitle', img: shuffledImages[0] || '/default-image.jpg' });
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch the URLs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (src) => {
    setSelectedImage(src);
    onConvert({ h1: headers.h1 || 'Default Header', h2: headers.h2 || 'Default Subtitle', img: src });
  };

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleRefresh = () => {
    const shuffledHeaders = shuffleArray([headers.h1, headers.h2, headers.h3, headers.h4]);
    onConvert({ h1: shuffledHeaders[0] || 'Default Header', h2: shuffledHeaders[1] || 'Default Subtitle', img: images[0] || '/default-image.jpg' });
  };

  useEffect(() => {
    if (selectedImage) {
      onConvert({ h1: headers.h1 || 'Default Header', h2: headers.h2 || 'Default Subtitle', img: selectedImage });
    }
  }, [selectedImage, onConvert, headers]);

  return (
    <div className="pt-6 flex flex-col gap-1 items-center justify-start py-2 bg-zinc-900 w-full h-full">
      <h1 className='text-white text-sm font-semibold'>URL to SMM Card Generator</h1>

      <div className='flex justify-normal items-center w-min gap-2'>
        <div>
          {urls.map((url, index) => (
            <input
              key={index}
              type="text"
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="Enter website URL"
              className="border border-gray-300 rounded-md py-[1.75px] px-1 w-fit mb-2"
            />
          ))}
        </div>
        <div>
          <button
            onClick={handleAddUrl}
            className="btn-gradient text-white py-[1.75px] px-2 rounded mb-2"
          >
            +
          </button>
        </div>
      </div>
      <div className='flex justify-around items-center w-full'>
      <button
          onClick={handleRefresh}
          className="bg-blue-500 font-semibold text-white py-[1.75px] px-2 rounded mb-2"
        >
          Refresh
        </button>
        <button
          onClick={handleConvert}
          className="bg-green-500 font-semibold text-white py-[1.75px] px-2 rounded mb-2"
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4">
          <h2 className="text-white text-sm font-semibold text-center">Select an Image</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {images.map((src, index) => (
              <DraggableImages
                key={index}
                src={src}
                alt={`Option ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer ${selectedImage === src ? 'border-2 border-blue-500' : 'border'}`}
                onClick={() => handleImageSelect(src)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlConverter;