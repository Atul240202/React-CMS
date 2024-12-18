import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2940',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2940',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2940',
];

function PreLoader({ isExiting }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const exitTransitionDelay = isExiting ? 0 : 1; // Make delay 0 when exiting

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className='fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: exitTransitionDelay }}
        >
          {/* Title */}
          <motion.h1
            className='text-6xl leading-[0] text-white font-bold'
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: exitTransitionDelay, duration: 0 }}
          >
            <span className='font-chesnaextra'>GO</span>{' '}
            <span className='font-chesnal'>PRODUCTION</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h4
            className='mt-0 text-2xl text-white font-chesna'
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: exitTransitionDelay, duration: 0 }}
          >
            BOLD IDEAS, BEAUTIFUL DESIGN
          </motion.h4>

          {/* Left floating text */}
          <motion.div
            className='absolute text-white text-5xl font-bold z-40'
            style={{
              top: 'calc(50% - 13vh - 2rem)',
              left: '25vw',
            }}
            initial={{ x: '-80%', opacity: 0 }}
            animate={{ x: '-15vw', opacity: 1 }}
            exit={{ x: '0', opacity: 0 }}
            transition={{ delay: exitTransitionDelay + 1, duration: 1 }}
          >
            STILL
          </motion.div>

          {/* Right floating text */}
          <motion.div
            className='absolute text-white text-5xl font-bold z-40'
            style={{
              bottom: 'calc(50% - 25vh - 2rem)',
              right: '25vw',
            }}
            initial={{ x: '80%', opacity: 0 }}
            animate={{ x: '20vw', opacity: 1 }}
            exit={{ x: '0', opacity: 0 }}
            transition={{ delay: exitTransitionDelay + 1, duration: 1 }}
          >
            MOTION
          </motion.div>

          {/* Rotating image container */}
          <motion.div
            className='mt-10 overflow-hidden relative border-2 border-white'
            style={{
              transformOrigin: 'center',
              position: 'relative',
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
              width: '50vw',
              height: '50vh',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              width: '50vw',
              height: '50vh',
            }}
            exit={{
              opacity: 1,
              scale: 2,
              width: '100vw',
              height: '100vh',
              position: 'fixed',
              x: '0',
              y: '0',
              transformOrigin: 'center',
            }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          >
            <AnimatePresence>
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt='Rotating visuals'
                className='w-full h-full object-cover absolute'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </AnimatePresence>
          </motion.div>

          {/* Infinite spinner */}
          <motion.svg
            width='100'
            height='60'
            viewBox='0 0 100 60'
            className='mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: exitTransitionDelay, duration: 1 }}
          >
            <motion.path
              d='M20,30 C20,15 35,15 50,30 C65,45 80,45 80,30 C80,15 65,15 50,30 C35,45 20,45 20,30 Z'
              fill='none'
              stroke='white'
              strokeWidth='3'
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: 'linear',
                repeat: Infinity,
              }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PreLoader;
