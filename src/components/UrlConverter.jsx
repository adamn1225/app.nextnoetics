import React, { useState } from 'react';
import axios from 'axios';
import DraggableImages from './DraggableImages';

const UrlConverter = ({ onConvert, urls, setUrls }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [headers, setHeaders] = useState({ h1: '', h2: '', h3: '', h4: '' });
  const [heldFields, setHeldFields] = useState({ h1: false, h2: false, img: false });
  const [showRegenerate, setShowRegenerate] = useState(false);

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
      setSelectedImage(shuffledImages[0] || '/default-image.jpg');
      onConvert({ h1: mergedData.h1 || 'Default Header', h2: mergedData.h2 || 'Default Subtitle', img: shuffledImages[0] || '/default-image.jpg' });
      setShowRegenerate(true);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch the URLs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleRemoveUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleRefresh = () => {
    const shuffledHeaders = shuffleArray([headers.h1, headers.h2, headers.h3, headers.h4]);
    const shuffledImages = shuffleArray(images);
    onConvert({
      h1: heldFields.h1 ? headers.h1 : shuffledHeaders.find(header => header) || 'Default Header',
      h2: heldFields.h2 ? headers.h2 : shuffledHeaders.find(header => header && header !== headers.h1) || 'Default Subtitle',
      img: heldFields.img ? selectedImage : shuffledImages[0] || '/default-image.jpg'
    });
  };

  const toggleHoldField = (field) => {
    setHeldFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="pt-6 flex flex-col gap-1 items-center justify-start py-2 bg-zinc-900 w-full h-full">
      <h1 className='text-white text-sm font-semibold'>URL to SMM Card Generator</h1>

      <div className='flex justify-normal items-center w-min gap-2'>
        <div>
          {urls.map((url, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="Enter website URL"
                className="border border-gray-300 rounded-md py-[1.75px] px-1 w-fit"
              />
              <button
                onClick={() => handleRemoveUrl(index)}
                className="ml-2 text-red-500"
              >
                &times;
              </button>
            </div>
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
      <div className='flex flex-col items-center w-full'>
        <button
          onClick={handleConvert}
          className="bg-green-500 font-semibold text-white py-[1.75px] px-2 rounded mb-2"
          disabled={loading}
        >
          {loading ? 'Converting...' : 'Generate Card'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <div className="mt-4">
        <h2 className="text-white text-lg font-semibold text-center">Click to Hold Fields!</h2>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => toggleHoldField('h1')}
            className={`py-1 px-2 rounded ${heldFields.h1 ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            Header 1
          </button>
          <button
            onClick={() => toggleHoldField('h2')}
            className={`py-1 px-2 rounded ${heldFields.h2 ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            Header 2
          </button>
          <button
            onClick={() => toggleHoldField('img')}
            className={`py-1 px-2 rounded ${heldFields.img ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            Image
          </button>
        </div>
        <div className="flex flex-col items-center w-full pt-4">
          {showRegenerate && (
            <button
              onClick={handleRefresh}
              className="bg-blue-500 font-semibold text-white py-[1.75px] px-2 rounded mb-2"
            >
              Regenerate Card
            </button>
          )}
        </div>
      </div>
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
                onClick={() => setSelectedImage(src)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlConverter;