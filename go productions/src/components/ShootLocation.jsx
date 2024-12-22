import React, { useState, useEffect } from 'react';
import 'swiper/css';
import '../styles/ShootLocation.css';
import SwiperComponent from './Sliders/SwiperComponent';

const ShootLocation = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // useEffect(() => {
  //   onLoad();
  // }, [onLoad]);
  return (
    <div
      className={`shoot-location-container ${
        isMobile ? 'h-[90vh]' : 'h-auto mb-[10vh] mt-auto ml-auto mr-auto'
      }`}
    >
      <div className='location-header'>
        <h2 style={{ fontWeight: 800 }} className='font-chesna'>
          LOCATION
        </h2>
      </div>
      <SwiperComponent />
      {/* <CustomSlider /> */}
    </div>
  );
};

export default ShootLocation;
