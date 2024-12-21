import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MotionContent = ({ motionData }) => {
  const navigate = useNavigate();
  const [visibleItems, setVisibleItems] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const itemsRef = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (motion) => {
    navigate(`/motions/${motion.id}`, { state: { motion } });
  };

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
  }, []);

  if (!motionData || motionData.length === 0) {
    return (
      <div className='text-white text-xl text-center mt-[10vh] mb-[10vh]'>
        No motion data available for the selected filter.
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center max-w-[90vw] mx-auto p-4 md:p-8 bg-black'>
      {motionData.map((motion, index) => (
        <div
          key={motion.id}
          className={`w-full flex ${
            isMobile ? 'flex-col items-center' : 'items-center justify-between'
          } mb-8 md:mb-12 text-white relative ${
            visibleItems[motion.id] ? 'animate' : ''
          }`}
          data-id={motion.id}
          ref={(el) => (itemsRef.current[index] = el)}
        >
          <div
            className={`video-container ${
              isMobile ? 'w-full mb-4 h-[20vh]' : 'w-[40%] h-[30vh]'
            }`}
          >
            <video
              className='w-full h-full object-cover -mt-[1px] cursor-pointer'
              src={motion.video}
              muted
              loop
              onClick={() => handleClick(motion)}
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
          </div>
          <div
            className={`flex ${
              isMobile
                ? 'flex-row items-center'
                : 'flex-col items-start h-[30vh]'
            } justify-between relative ${isMobile ? 'w-full' : 'w-[60%]'}`}
          >
            <img
              src={motion.logo || motion.clientImage}
              alt='Logo'
              className={`logo ${
                isMobile ? 'w-32 md:w-40 mb-4 ml-0' : 'w-56 max-h-[10vh]'
              } h-auto self-end mb-auto`}
              loading='lazy'
            />
            <h2
              className={`video-text min-mt-[10vh] text-2xl md:text-4xl lg:text-5xl font-chesna${
                isMobile
                  ? 'text-center mt-0 text-lg mr-7'
                  : 'text-left mb-0 max-h-[10vh]'
              } `}
            >
              {motion.text}
            </h2>
            <div
              className={`border-top w-0 h-[1px] bg-white absolute top-0 left-0 ${
                isMobile ? 'h-[0px]' : 'h-[1px]'
              }`}
            />
          </div>
        </div>
      ))}
      <style jsx>{`
        .animate .video-container {
          animation: expandVideo 1s ease-out forwards;
        }
        .animate .video-text {
          animation: slideTextFromBehind 1s ease-out forwards;
        }
        .animate .logo {
          animation: slideLogoFromRight 1s ease-out forwards;
        }
        .animate .border-top {
          animation: expandBorderFromLeft 1s ease-out forwards;
        }

        @keyframes expandVideo {
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

        @keyframes slideLogoFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
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

        .video-container,
        .video-text,
        .logo {
          opacity: 0;
        }

        .animate .video-container,
        .animate .video-text,
        .animate .logo {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default MotionContent;
