"use client";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SubscriptionModal from './cms/SubscriptionModal';

const TopNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full py-2 shadow-md bg-gray-950 text-white">
        <div className="flex justify-start items-center gap-4 pl-4">
          <Link to="/login" className="bg-blue-500 px-2 py-1 rounded shadow-sm shadow-primary">Log In</Link>
          <button onClick={handleOpenModal} className="nn-gradient px-2 py-1 rounded shadow-sm shadow-primary">Create an Account</button>
        </div>
      </div>
      <SubscriptionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default TopNav;