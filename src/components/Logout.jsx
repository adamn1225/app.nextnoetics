import React from 'react';
import { supabase } from '../lib/supabaseClient';

const Logout = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert('Error logging out. Please try again.');
    } else {
      window.location.href = "https://nextnoetics.com/login"; // Redirect to login page after logout
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded"
    >
      Logout
    </button>
  );
};

export default Logout;