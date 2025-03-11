import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useEditor } from "@craftjs/core";

const StoredTemplates = ({ session }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { actions } = useEditor();

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!session) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        setError(error.message);
      } else {
        setTemplates(data);
      }

      setLoading(false);
    };

    fetchTemplates();
  }, [session]);

  const loadTemplate = (template) => {
    try {
      const jsonData = JSON.parse(template.sections);
      actions.deserialize(jsonData);
    } catch (e) {
      console.error('Invalid JSON data', e);
    }
  };

  const deleteTemplate = async (templateId) => {
    const confirmed = window.confirm("Are you sure you want to delete this template?");
    if (confirmed) {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        setError(error.message);
      } else {
        setTemplates(templates.filter(template => template.id !== templateId));
      }
    }
  };

  if (!session) {
    return (<p></p>);
  }

  return (
    <div className='text-white w-full overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <h2 className=' font-semibold'>Stored Templates</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {templates.map(template => (
          <li key={template.id} className="p-2 border border-gray-300 rounded mb-2">
            <div>
                <h3 className="font-medium text-white">{template.name}</h3>
                <p className='text-white'>{template.description}</p>
              </div>
            <div className="flex justify-between items-center">
              
              <div className="flex gap-2">
                <button
                  className="text-sm px-1 py-1 border bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => loadTemplate(template)}
                >
                  Load Template
                </button>
                <button
                  className="text-sm px-1 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => deleteTemplate(template.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoredTemplates;