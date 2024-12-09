import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2940',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2940',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2940',
];

function PreLoader() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFrameExpanded, setIsFrameExpanded] = useState(false);
  const [showTexts, setShowTexts] = useState(false);
  const [showFinalLogo, setShowFinalLogo] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Initial delay
      setIsFrameExpanded(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowTexts(true);

      // Start image rotation
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);

      // Simulate content loading
      await new Promise((resolve) => setTimeout(resolve, 9000));
      clearInterval(interval);

      // Final animation sequence
      setShowTexts(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsFrameExpanded(false);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowFinalLogo(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    sequence();
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      className='fixed inset-0 bg-black z-50 flex items-center justify-center'
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Logo */}
      <motion.h1
        className='absolute top-10 text-6xl text-white font-chesnal'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        GO PRODUCTION
      </motion.h1>

      {/* Image Frame */}
      <motion.div
        className='relative'
        initial={{ width: 0, height: 0 }}
        animate={{
          width: isFrameExpanded ? '600px' : showFinalLogo ? '200px' : 0,
          height: isFrameExpanded ? '400px' : showFinalLogo ? '200px' : 0,
        }}
        transition={{ duration: 1 }}
      >
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            className='w-full h-full object-cover'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Still Text */}
        <motion.div
          className='absolute -left-20 -top-20 text-4xl text-white'
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: showTexts ? 1 : 0, x: showTexts ? 0 : -50 }}
          transition={{ duration: 0.5 }}
        >
          STILL
        </motion.div>

        {/* Motion Text */}
        <motion.div
          className='absolute -right-20 -bottom-20 text-4xl text-white'
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: showTexts ? 1 : 0, x: showTexts ? 0 : 50 }}
          transition={{ duration: 0.5 }}
        >
          MOTION
        </motion.div>
      </motion.div>

      {/* Final centered logo */}
      {showFinalLogo && (
        <motion.div
          className='absolute text-6xl text-white font-chesnal'
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          GO
        </motion.div>
      )}
    </motion.div>
  );
}

export default PreLoader;
