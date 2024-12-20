import React, { useState, useEffect } from 'react';
import 'swiper/css';
import '../styles/ShootLocation.css';
import SwiperComponent from './Sliders/SwiperComponent';

const ShootLocation = () => {
  // useEffect(() => {
  //   onLoad();
  // }, [onLoad]);
  return (
    <div className='shoot-location-container'>
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
