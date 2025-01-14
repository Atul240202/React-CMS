import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/FadeInOut.css';
import gifSrc from '../../assets/gif.gif';

const words = ['FEATURE', 'MOTION', 'MOTIONS', 'MOVIES', 'FLICKS', 'PICTURES'];

function StillSlider() {
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
      className={`w-full ${
        isMobile ? 'h-[25vh]' : 'h-[90vh]'
      } pt-[12vh] relative overflow-hidden font-raleway `}
    >
      <div className='flex flex-col'>
        <div
          className={`flex ${
            isMobile ? 'flex-col items-center' : 'justify-between'
          } w-[60vw]  mx-auto  gap-2.5 ${
            isMobile ? 'h-auto mb-[2vh]' : 'h-[38vh] mb-[5vh]'
          }`}
        >
          <motion.h1
            initial={{ x: '-180%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`m-0 ${
              isMobile
                ? 'text-5xl md:text-7xl font-extrabold lg:text-8xl mb-4'
                : 'text-[100px] max-h-[25vh] font-bold pt-[19vh]'
            }`}
          >
            FEATURE
          </motion.h1>
          {!isMobile && (
            <img
              className='fadeinout w-[40%] max-h-[30vh] self-center'
              src='https://res.cloudinary.com/da3r1iagy/image/upload/v1727814576/9d8d7a1ee3ba214afae49997eaedf852_l6snn2.png'
              alt='slider-image'
              loading='lazy'
            />
          )}
        </div>

        <div
          className={`flex ${
            isMobile ? 'flex-col items-center' : 'justify-between'
          } w-[60vw] mx-auto mb-[5vh] gap-2.5 ${
            isMobile ? 'h-auto' : 'h-[40vh]'
          }`}
        >
          {!isMobile && (
            <img
              className='fadeinout w-[55%] max-h-[35vh]'
              src='https://res.cloudinary.com/da3r1iagy/image/upload/v1728759721/FEST0088-scaled_uispvw.png'
              alt='slider-image'
              loading='lazy'
            />
          )}
          <div className='flex flex-col'>
            <motion.h1
              initial={{ x: '210%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={` ${
                isMobile
                  ? 'text-5xl md:text-7xl font-extrabold lg:text-8xl text-center mt-0'
                  : 'text-[100px] -mt-[27px] font-bold'
              } mb-0`}
            >
              STILL
            </motion.h1>
            <div className='relative h-[50px] flex items-center justify-center'>
              <AnimatePresence mode='wait'>
                <motion.p
                  key={words[currentIndex]}
                  variants={containerVariants}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  className={`text-center font-bold ${
                    isMobile
                      ? 'text-xl md:text-6xl lg:text-7xl text-center'
                      : 'text-[25px]'
                  } mt-7`}
                >
                  {words[currentIndex]}
                </motion.p>
              </AnimatePresence>
              <div className=' right-0 flex items-center'>
                <img
                  src={gifSrc}
                  alt='Animation'
                  className={`object-cover ${
                    isMobile ? 'h-14 w-14 mt-5 absolute' : 'h-15 w-12'
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

export default StillSlider;
