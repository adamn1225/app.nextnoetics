import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useEditor } from "@craftjs/core";

const SaveTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const { query } = useEditor();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  const handleSaveTemplate = async () => {
    setLoading(true);
    setError(null);

    try {
      const jsonData = query.serialize();

      const { error } = await supabase
        .from('templates')
        .insert([{ name: templateName, description, sections: jsonData, user_id: user.id }]); // Include description

      if (error) {
        setError(error.message);
      } else {
        alert('Template saved successfully!');
      }
    } catch (e) {
      setError('Invalid JSON data');
    }

    setLoading(false);
  };

  return (
    <div className='text-gray-950 w-full'>
      <h2>Save Template</h2>
      <input
        type="text"
        placeholder="Template Name"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button onClick={handleSaveTemplate} disabled={loading || !user} className="bg-blue-500 text-white p-2 rounded">
        {loading ? 'Saving...' : 'Save Template'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SaveTemplate;