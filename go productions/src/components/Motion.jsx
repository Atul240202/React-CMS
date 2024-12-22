import React, { useState, useEffect } from 'react';
import '../styles/Motion.css';
import SliderComponent from './Sliders/SliderComponent';

const Motion = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // useEffect(() => {
  //   onLoad();
  // }, [onLoad]);
  return (
    <div className={`motion-section ${isMobile ? 'h-auto' : 'h-auto'}`}>
      <div className='motion-header'>
        <div>
          <h2 className='font-chesna'>MOTION</h2>
          <p>YOUR VISION, OUR EXPERTISE</p>
        </div>

        <a href='/motions' className='see-more'>
          SEE MORE
        </a>
      </div>
      <SliderComponent />
    </div>
  );
};

export default Motion;
