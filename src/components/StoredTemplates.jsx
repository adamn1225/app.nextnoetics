import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useEditor } from "@craftjs/core";
import ConfirmModal from './ConfirmModal';

const StoredTemplates = ({ session }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const { actions, query } = useEditor();

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
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      setError(error.message);
    } else {
      setTemplates(templates.filter(template => template.id !== templateId));
    }
  };

  const handleDeleteClick = (templateId) => {
    setTemplateToDelete(templateId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete);
      setTemplateToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const editTemplate = (template) => {
    loadTemplate(template);
    setEditingTemplate(template);
  };

  const saveTemplate = async () => {
    if (!editingTemplate) return;

    setLoading(true);
    setError(null);

    try {
      const jsonData = query.serialize();

      const { error } = await supabase
        .from('templates')
        .update({ sections: jsonData })
        .eq('id', editingTemplate.id);

      if (error) {
        setError(error.message);
      } else {
        alert('Template saved successfully!');
        setEditingTemplate(null);
      }
    } catch (e) {
      setError('Invalid JSON data');
    }

    setLoading(false);
  };

  if (!session) {
    return (<p></p>);
  }

  return (
    <>
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
                
                <div className="flex justify-between w-full gap-2">
                  <div className='flex gap-2'>
                    <button
                      className="text-sm px-1 py-1 border bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => loadTemplate(template)}
                    >
                      Load Template
                    </button>
                    <button
                      className="text-sm px-1 py-1 border bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => editTemplate(template)}
                    >
                      Edit
                    </button>
                  </div>
                  <button
                    className="text-sm px-1 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => handleDeleteClick(template.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {editingTemplate && (
          <div className="mt-4">
            <button
              className="text-sm px-1 py-1 border bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={saveTemplate}
            >
              Save Edits
            </button>
          </div>
        )}

      </div>
      <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Template"
          message="Are you sure you want to delete this template?"
        />
    </>
  );
};

export default StoredTemplates;