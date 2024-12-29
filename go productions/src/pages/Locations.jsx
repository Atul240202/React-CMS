import React, { useState, useEffect, useRef } from 'react';
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
  const [hoveredItems, setHoveredItems] = useState(new Set());
  const [visibleItems, setVisibleItems] = useState({});

  const itemsRef = useRef([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prevVisibleItems) => ({
              ...prevVisibleItems,
              [entry.target.dataset.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, [locations, showContent]);

  const navigateToLocationPage = (locationId) => {
    navigate(`/locations/${locationId}`);
  };

  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  // const textVariants = {
  //   initial: { y: 100, opacity: 0 },
  //   hover: {
  //     y: 0,
  //     opacity: 1,
  //     transition: {
  //       duration: 0.6,
  //       ease: 'easeOut',
  //     },
  //   },
  // };

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

          {/* Internal location grid starts here */}
          <div
            className={`flex flex-col items-center justify-center mx-auto ${
              isMobile ? 'max-w-[90vw]' : 'max-w-[79vw]'
            } p-4 md:p-8 bg-black`}
          >
            {locations.map((location, index) => (
              <div
                key={location.id}
                className={`w-full flex ${
                  isMobile
                    ? 'flex-col items-center'
                    : 'items-center justify-between'
                } mb-8 md:mb-12 text-white relative ${
                  visibleItems[location.id] ? 'animate' : ''
                }`}
                data-id={location.id}
                ref={(el) => (itemsRef.current[index] = el)}
              >
                <div
                  className={`image-container ${
                    isMobile ? 'w-full mb-2 h-[25vh]' : 'w-[40%] h-[35vh]'
                  }`}
                  onClick={() => navigateToLocationPage(location.id)}
                >
                  <img
                    className='w-full h-full object-cover cursor-pointer'
                    src={location.image}
                    alt={location.text}
                    loading='lazy'
                  />
                </div>
                <div
                  className={`flex ${
                    isMobile
                      ? 'flex-row items-center'
                      : 'flex-col items-start h-[35vh]'
                  } justify-end relative ${isMobile ? 'w-full' : 'w-[60%]'}`}
                >
                  <h2
                    className={`location-text min-mt-[10vh] text-2xl md:text-4xl lg:text-5xl font-chesna ${
                      isMobile
                        ? 'text-center mt-0 text-lg mr-7'
                        : 'text-left mb-0 max-h-[10vh]'
                    }`}
                  >
                    {location.text}
                  </h2>
                  <div
                    className={`border-top w-0 bg-white absolute top-0 left-0 ${
                      isMobile ? 'h-[0px]' : 'h-[1px]'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {error && (
        <div className='text-white text-xl text-center mt-8'>{error}</div>
      )}
      <style>{`
        .animate .image-container {
          animation: expandImage 1s ease-out forwards;
        }
        .animate .location-text {
          animation: slideTextFromBehind 1s ease-out forwards;
        }
        .animate .border-top {
          animation: expandBorderFromLeft 1s ease-out forwards;
        }

        @keyframes expandImage {
          from {
            transform: scale(0.5);
            transform-origin: bottom left;
          }
          to {
            transform: scale(1);
            transform-origin: bottom left;
          }
        }

        @keyframes slideTextFromBehind {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }
          70% {
            transform: translateX(20%);
            opacity: 1;
          }
          100% {
            transform: translateX(30px);
          }
        }

        @keyframes expandBorderFromLeft {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .image-container,
        .location-text {
          opacity: 0;
        }

        .animate .image-container,
        .animate .location-text {
          opacity: 1;
        }
      `}</style>
    </>
  );
}
