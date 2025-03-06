import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <motion.div
        className="text-4xl font-bold text-blue-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default Loader;