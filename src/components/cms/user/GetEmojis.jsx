import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEditor } from "@craftjs/core";
import {EmojiComponent} from './EmojiComponent';

const GetEmojis = () => {
  const [emojis, setEmojis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('food-drink');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const emojisPerPage = 24;
  const { connectors } = useEditor();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://emoji-api.com/categories?access_key=db79492ba19f8f18d7c9421dbf87a3b61b38862d`);
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]);
          console.error('Unexpected response format:', response.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await axios.get(`https://emoji-api.com/emojis?search=${query}&access_key=db79492ba19f8f18d7c9421dbf87a3b61b38862d`);
        if (Array.isArray(response.data)) {
          setEmojis(response.data);
        } else {
          setEmojis([]);
          console.error('Unexpected response format:', response.data);
        }
      } catch (err) {
        console.error('Failed to fetch emojis:', err);
        setEmojis([]);
      }
    };

    if (query) {
      fetchEmojis();
    } else {
      setEmojis([]);
    }
  }, [query]);

  useEffect(() => {
    const fetchEmojisByCategory = async () => {
      try {
        const response = await axios.get(`https://emoji-api.com/categories/${selectedCategory}?access_key=db79492ba19f8f18d7c9421dbf87a3b61b38862d`);
        if (Array.isArray(response.data)) {
          setEmojis(response.data);
        } else {
          setEmojis([]);
          console.error('Unexpected response format:', response.data);
        }
      } catch (err) {
        console.error('Failed to fetch emojis by category:', err);
        setEmojis([]);
      }
    };

    if (selectedCategory) {
      fetchEmojisByCategory();
    }
  }, [selectedCategory]);

  const indexOfLastEmoji = currentPage * emojisPerPage;
  const indexOfFirstEmoji = indexOfLastEmoji - emojisPerPage;
  const currentEmojis = emojis.slice(indexOfFirstEmoji, indexOfLastEmoji);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for emojis"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.slug}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {currentEmojis.map((emoji) => (
          <div
            key={emoji.slug}
            ref={ref => connectors.create(ref, <EmojiComponent emoji={emoji.character} />)}
            className="text-2xl cursor-pointer"
          >
            {emoji.character}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(emojis.length / emojisPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GetEmojis;