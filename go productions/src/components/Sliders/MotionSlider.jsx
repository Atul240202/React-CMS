import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/FadeInOut.css';
import gifSrc from '../../assets/gif.gif';

const words = ['FEATURE', 'MOTION', 'MOTIONS', 'MOVIES', 'FLICKS', 'PICTURES'];

function MotionSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div
      className={`w-full pt-[15vh] relative overflow-hidden ${
        isMobile ? 'h-[25vh]' : 'h-[85vh]'
      }`}
    >
      <div className='flex flex-col'>
        <div
          className={`flex ${
            isMobile ? 'flex-col items-center' : 'justify-between'
          } w-[90vw] md:w-[80vw] mx-auto mb-[5vh] gap-2.5 ${
            isMobile ? 'h-auto' : 'h-[30vh]'
          }`}
        >
          <motion.h1
            initial={{ x: '-150%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`font-extrabold m-0 ${
              isMobile
                ? 'text-5xl '
                : 'text-[150px] max-h-[25vh] leading-none pt-[11vh]'
            }`}
          >
            FEATURE
          </motion.h1>
          {!isMobile && (
            <video
              className='fadeinout object-cover w-[30%] max-h-[30vh] self-center'
              src='https://res.cloudinary.com/da3r1iagy/video/upload/v1727868661/-ceaf-47ec-8e60-9468da999b3f_gemyqj.mp4'
              muted
              autoPlay
              loop
            />
          )}
        </div>

        <div
          className={`flex ${
            isMobile ? 'flex-col items-center' : 'justify-between'
          } w-[90vw] md:w-[80vw] mx-auto mb-[5vh] gap-2.5 ${
            isMobile ? 'h-auto' : 'h-[40vh]'
          }`}
        >
          {!isMobile && (
            <video
              className='fadeinout object-cover w-[40%] mt-6'
              src='https://res.cloudinary.com/da3r1iagy/video/upload/v1727868655/-f4de-4cd6-8720-860efd6c272b_ac1fhk.mp4'
              muted
              autoPlay
              loop
            />
          )}
          <div className='flex flex-col'>
            <motion.h1
              initial={{ x: '150%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={`font-extrabold leading-none my-0 ${
                isMobile
                  ? 'text-5xl md:text-7xl lg:text-8xl text-center'
                  : 'text-[150px]'
              }`}
            >
              MOTION
            </motion.h1>
            <div className='relative h-[50px] flex items-center justify-center gap-4'>
              <AnimatePresence mode='wait'>
                <motion.h1
                  key={words[currentIndex]}
                  variants={containerVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  className={`leading-none m-0 place-items-center mt-7 ${
                    isMobile
                      ? 'text-xl md:text-6xl lg:text-7xl text-center'
                      : 'text-[35px]'
                  }`}
                >
                  {words[currentIndex]}
                </motion.h1>
              </AnimatePresence>
              <div className=' right-0 flex items-center'>
                <img
                  src={gifSrc}
                  alt='Animation'
                  className={`object-cover ${
                    isMobile ? 'h-14 w-14 mt-5 absolute' : 'h-20 w-20'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotionSlider;
