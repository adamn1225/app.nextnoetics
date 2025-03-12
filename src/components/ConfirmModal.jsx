import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white mt-40 rounded-lg shadow-lg p-6 w-full max-w-md relative z-100">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="pb-4 text-zinc-900">{message}</p>
        <div className="flex justify-end gap-2">
          <input
            type="button"
            value="Cancel"
            className="px-4 py-2 bg-gray-100 text-zinc-900 rounded hover:bg-gray-400 cursor-pointer"
            onClick={onClose}
            style={{ lineHeight: 'normal', display: 'inline-block' }}
          />
          <input
            type="button"
            value="Delete"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            onClick={onConfirm}
            style={{ lineHeight: 'normal', display: 'inline-block' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;