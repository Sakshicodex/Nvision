import React from 'react';
import { motion } from 'framer-motion';

const Success3 = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 z-20"
    >
      <div
        className="bg-white py-8 px-4 shadow-lg rounded-lg max-w-lg w-full mx-auto"
        style={{
          maxWidth: '600px',
          margin: 'auto',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-700">Thank You for Abstract Submission!</h1>
          <p className="text-md text-gray-500 mt-4">Our Scientific team will get back to you soon after reviewing the abstract.

            </p>
          
        </div>
      </div>
    </motion.div>
  );
};

export default Success3;
