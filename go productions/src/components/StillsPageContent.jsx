import React from 'react';
import { useNavigate } from 'react-router-dom';

const StillsPageContent = ({ stillPageData }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (still) => {
    navigate(`/stills/${still.clientKey}/${still.id}`, { state: { still } });
  };

  if (!Array.isArray(stillPageData) || stillPageData.length === 0) {
    return (
      <div className='text-white text-xl text-center mt-8'>
        No stills available.
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center p-4 md:p-8 bg-black'>
      {stillPageData.map((item, index) => (
        <div
          key={item.id || index}
          className={`flex ${
            isMobile
              ? 'flex-col'
              : index % 2 === 0
              ? 'flex-row'
              : 'flex-row-reverse'
          } 
            items-center justify-between w-full max-w-[85rem] ${
              isMobile ? 'h-auto' : 'h-[80vh]'
            } mb-8`}
        >
          <div
            className={`flex flex-col items-center justify-center ${
              isMobile ? 'w-full' : 'w-2/3'
            }`}
          >
            <img
              src={item.image}
              alt={item.text}
              className={`w-full ${
                isMobile ? 'h-[40vh]' : 'h-[70vh]'
              } object-cover cursor-pointer`}
              onClick={() => handleClick(item)}
              loading='lazy'
            />
            <div className='flex flex-row items-center justify-between w-full'>
              <h2 className='text-xl md:text-2xl lg:text-3xl font-chesnal text-white'>
                {item.text}
              </h2>
              <img
                src={item.logo || item.clientImage}
                alt='Logo'
                className='w-24 md:w-32 lg:w-[150px] h-auto'
                loading='lazy'
              />
            </div>
          </div>
          {!isMobile && <div className='flex-1' />}
        </div>
      ))}
    </div>
  );
};

export default StillsPageContent;
