import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import '../../styles/SwiperComponent.css';
import { shootLocationData } from '../../data/data.jsx'; // Importing shootLocationData

const SwiperComponent = () => {
  return (
    <div className='swiper-container'>
      <Swiper
        modules={[Navigation]}
        loop={true}
        slidesPerView={2}
        spaceBetween={20}
        centeredSlides={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className='curved-swiper'
      >
        <div className='swiper-button-prev'></div>
        <div className='swiper-button-next'></div>

        {shootLocationData.map((location, index) => (
          <SwiperSlide key={index}>
            <img
              className='imageSlider'
              src={location.url}
              alt={`slide-${index}`}
            />
            {/* <p className='location-text'>{location.text}</p> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
