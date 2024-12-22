import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lanscapeimages = [
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1734624904/RT1586_1_-min_m8dqnz.jpg',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1734624896/pantaloons5720_mzsih7.jpg',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1734624896/240129-08-165B_ozq35j.jpg',
];

const portraitImages = [
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1734863902/Soch_Campaign_1386-min_xmjjko.jpg',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1734863899/240515-FLIPKART-3118-min_uswfkp.jpg',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1734863899/Chique_0234-min_l34p39.jpg',
];

function PreLoader({ isExiting }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const images = isMobile ? portraitImages : lanscapeimages;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const exitTransitionDelay = isExiting ? 0 : 1; // Make delay 0 when exiting
  const textExitTransitionDelay = isExiting ? 0 : 2;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className='fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center overflow-hidden'
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay: exitTransitionDelay }}
        >
          {/* Title */}
          <motion.h1
            className={`leading-[0] text-white font-bold ${
              isMobile ? 'text-3xl' : 'text-6xl'
            }`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: exitTransitionDelay, duration: 0 }}
          >
            <span className='font-chesnaextra'>GO</span>{' '}
            <span className='font-chesnal'>PRODUCTIONS</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h4
            className={`text-white font-chesna ${
              isMobile ? 'text-sm mt-2' : 'text-2xl mt-0'
            }`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: exitTransitionDelay, duration: 0 }}
          >
            BOLD IDEAS, BEAUTIFUL DESIGN
          </motion.h4>

          {/* Left floating text */}
          {!isMobile && (
            <>
              <motion.div
                className='absolute text-white text-5xl font-bold z-40'
                style={{
                  top: 'calc(50% - 13vh - 2rem)',
                  left: '25vw',
                }}
                initial={{ x: '-80%', opacity: 0 }}
                animate={{ x: '-10vw', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: textExitTransitionDelay, duration: 1 }}
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
                animate={{ x: '15vw', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: textExitTransitionDelay, duration: 1 }}
              >
                MOTION
              </motion.div>
            </>
          )}
          {/* Rotating image container */}
          <motion.div
            className='mt-10 overflow-hidden relative border-2 border-white z-89'
            style={{
              transformOrigin: 'center',
              position: 'relative',
              width: isMobile ? '90vw' : '50vw',
              height: `calc(${isMobile ? '50vw' : '50vw'} / 16 * 9)`,
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
                transition={{ duration: 2 }}
              />
            </AnimatePresence>
          </motion.div>

          {/* Infinite spinner */}
          <motion.svg
            width={isMobile ? '50' : '100'}
            height={isMobile ? '30' : '60'}
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
