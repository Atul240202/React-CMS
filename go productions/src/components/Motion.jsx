import { useState } from 'react';
import { motionData } from '../data/data';
import '../styles/Motion.css';
import SliderComponent from './Sliders/SliderComponent';

const Motion = () => {
  return (
    <div className='motion-section'>
      <div className='motion-header'>
        <h2>MOTION</h2>
        <p>Your Vision, Our Expertise</p>
        <a href='motions' className='see-more'>
          See More
        </a>
      </div>
      <SliderComponent />
    </div>
  );
};

export default Motion;
