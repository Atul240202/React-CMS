import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import TransitionEffect from '../components/TransitionEffect';
import '../styles/FadeInOut.css';
import { motion } from 'framer-motion';

export default function Locations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsCollection = collection(db, 'locations');
        const locationSnapshot = await getDocs(locationsCollection);
        const locationList = [];
        let processedDocs = 0;

        locationSnapshot.forEach((doc) => {
          locationList.push({
            id: doc.id,
            ...doc.data(),
          });
          processedDocs++;
          setProgress((processedDocs / locationSnapshot.size) * 100);
        });

        setLocations(locationList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locations: ', err);
        setError('Failed to load locations. Please try again later.');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const navigateToLocationPage = (locationId) => {
    navigate(`/locations/${locationId}`);
  };

  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName='Locations'
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && (
        <>
          <div
            className={`w-full ${
              isMobile ? 'h-[20vh] pt-[10vh]' : 'h-[85vh] pt-[15vh]'
            }  relative overflow-hidden`}
          >
            <div className='flex flex-col'>
              <div
                className={`flex ${
                  isMobile
                    ? 'flex-row justify-center items-center'
                    : 'justify-between'
                } w-[90vw] md:w-[80vw] mx-auto  gap-2.5 ${
                  isMobile ? 'h-auto mb-[3vh]' : 'h-[35vh] mb-[5vh]'
                }`}
              >
                <motion.h1
                  initial={{ x: '-150%' }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className={`font-extrabold text-center ${
                    isMobile
                      ? 'text-4xl md:text-5xl lg:text-6xl mb-0'
                      : 'text-[150px] -mb-[30px] self-end'
                  }`}
                >
                  FEATURE
                </motion.h1>
                {!isMobile && (
                  <img
                    className='fadeinout w-[30%] max-h-[30vh] self-center'
                    src='https://res.cloudinary.com/da3r1iagy/image/upload/v1728323935/1ad23f85ffce6677e3e4a7975417c597_y5rffi.png'
                    alt='slider-image'
                    loading='lazy'
                  />
                )}
              </div>

              {!isMobile && (
                <div className='flex justify-between w-[90vw] md:w-[80vw] mx-auto mb-[5vh] gap-2.5 h-[35vh]'>
                  <img
                    className='fadeinout w-[30%]'
                    src='https://res.cloudinary.com/da3r1iagy/image/upload/v1728323935/abd03797bf7fe8d160553bd5d01191bd_gv5vbi.png'
                    alt='slider-image'
                    loading='lazy'
                  />
                  <motion.h1
                    initial={{ x: '150%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className='font-extrabold leading-none text-[150px] -mt-[27px]'
                  >
                    LOCATION
                  </motion.h1>
                </div>
              )}

              {isMobile && (
                <motion.h1
                  initial={{ x: '150%' }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className='font-extrabold text-4xl md:text-5xl lg:text-6xl text-center mt-2'
                >
                  LOCATION
                </motion.h1>
              )}
            </div>
          </div>

          <div className='flex flex-col items-center p-4 md:p-8 bg-black'>
            {locations.map((item, index) => (
              <div
                key={item.id}
                className={`flex ${
                  isMobile
                    ? 'flex-col items-center'
                    : index % 2 === 0
                    ? 'flex-row'
                    : 'flex-row-reverse'
                } 
                  justify-between w-full max-w-[85rem] ${
                    isMobile ? 'h-auto mb-12' : 'h-[60vh] mb-8'
                  }`}
              >
                <div
                  className={`${
                    isMobile ? 'w-full mb-6' : 'w-1/2'
                  } cursor-pointer`}
                  onClick={() => navigateToLocationPage(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.text}
                    className={`w-full ${
                      isMobile ? 'h-[40vh]' : 'h-[60vh]'
                    } object-cover`}
                    loading='lazy'
                  />
                </div>
                <motion.div
                  className={`flex flex-col items-center justify-center ${
                    isMobile ? 'w-full text-center' : 'w-1/2'
                  }`}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: '-100px' }}
                >
                  <motion.h2
                    variants={textVariants}
                    className={`text-white font-extrabold ${
                      isMobile ? 'text-2xl md:text-3xl mb-4' : 'text-4xl mb-6'
                    }`}
                  >
                    {item.text}
                  </motion.h2>
                  <motion.h2
                    variants={textVariants}
                    className={`text-white font-extrabold ${
                      isMobile ? 'text-xl md:text-2xl' : 'text-4xl'
                    }`}
                    transition={{ delay: 0.2 }}
                  >
                    {item.address}
                  </motion.h2>
                </motion.div>
              </div>
            ))}
          </div>
        </>
      )}
      {error && (
        <div className='text-white text-xl text-center mt-8'>{error}</div>
      )}
    </>
  );
}
