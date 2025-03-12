import React from 'react';
import { supabase } from '../lib/supabaseClient';

const Logout = () => {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert('Error logging out. Please try again.');
    } else {
      window.location.href = "https://noetics.io/login"; // Redirect to login page after logout
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-4 py-2 shadow-sm bg-blue-500 text-white hover:bg-blue-600 rounded-sm"
    >
      Logout
    </button>
  );
};

export default Logout;