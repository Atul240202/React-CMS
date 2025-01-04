import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StillsPageContent = ({ stillsData }) => {
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

  const handleClick = (still) => {
    navigate(`/stills/${still.clientKey}/${still.id}`, { state: { still } });
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

  if (!Array.isArray(stillsData) || stillsData.length === 0) {
    return (
      <div className='text-white text-xl text-center mt-[10vh] mb-[10vh]'>
        No stills data available for the selected filter.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isMobile ? 'max-w-[90vw]' : 'max-w-[75vw]'
      } mx-auto p-4 md:p-8 bg-black`}
    >
      {stillsData.map((still, index) => (
        <div
          key={still.id || index}
          className={`w-full flex ${
            isMobile ? 'flex-col items-center' : 'items-center justify-between'
          } mb-8 md:mb-12 text-white relative ${
            visibleItems[still.id] ? 'animate' : ''
          }`}
          data-id={still.id}
          ref={(el) => (itemsRef.current[index] = el)}
        >
          <div
            className={`image-container-1 ${
              isMobile ? 'w-full mb-2 h-[25vh]' : 'w-[40%] h-[30vh]'
            }`}
          >
            <img
              className='w-full h-full object-cover cursor-pointer'
              src={still.image}
              alt={still.text}
              onClick={() => handleClick(still)}
              loading='lazy'
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
              src={still.logo || still.clientImage}
              alt='Logo'
              className={`logo ${
                isMobile ? 'w-28 md:w-40 mb-4 ml-0' : 'w-56 max-h-[10vh]'
              } h-auto self-end mb-auto`}
              loading='lazy'
            />
            <h2
              className={`still-text min-mt-[10vh]  ${
                isMobile
                  ? 'text-center mt-0 text-lg mr-7 font-raleway'
                  : 'text-left mb-0 max-h-[10vh] text-4xl font-raleway font-medium '
              }`}
            >
              {still.text}
            </h2>
            <div
              className={`border-top w-0 bg-white absolute top-0 left-0 ${
                isMobile ? 'h-[0px]' : 'h-[1px]'
              }`}
            />
          </div>
        </div>
      ))}
      <style>{`
        .animate .image-container-1 {
          animation: expandImage 1s ease-out forwards;
        }
        .animate .still-text {
          animation: slideTextFromBehind 1s ease-out forwards;
        }
        .animate .logo {
          animation: slideLogoFromRight 1s ease-out forwards;
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

        .image-container-1,
        .still-text,
        .logo {
          opacity: 0;
        }

        .animate .image-container-1,
        .animate .still-text,
        .animate .logo {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default StillsPageContent;
