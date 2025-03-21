import React from 'react';

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute text-2xl top-2 right-2 text-gray-950 font-semibold hover:text-gray-900">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;