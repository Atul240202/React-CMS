import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/SliderComponent.css';
import { motionData } from '../../data/data.jsx';

const SliderComponent = () => {
  return (
    <section className='section slider-section'>
      <div className='container slider-column'>
        <Swiper
          modules={[Navigation, Pagination]}
          centeredSlides={true}
          slidesPerView={1}
          grabCursor={true}
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          autoplay={false} // Remove autoplay
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 60 },
            1024: { slidesPerView: 1.75, spaceBetween: 60 },
          }}
        >
          {motionData.map((item, index) => (
            <SwiperSlide key={index}>
              {/* Logo */}
              <div className='logo-container'>
                <img
                  src={item.logo}
                  alt={`Logo ${index + 1}`}
                  className='slide-logo'
                  loading='lazy'
                />
              </div>
              {/* Video */}
              <video
                className='swiper-video'
                src={item.video}
                muted
                loop
                onMouseEnter={(e) => e.target.play()} // Play on hover
                onMouseLeave={(e) => e.target.pause()} // Pause when not hovering
              />
              {/* Sample Text */}
              <div className='sample-text'>
                <p>{item.text}</p>
              </div>
            </SwiperSlide>
          ))}
          {/* Pagination and Navigation */}
          <div className='swiper-button-prev'></div>
          <div className='swiper-button-next'></div>
        </Swiper>
      </div>
    </section>
  );
};

export default SliderComponent;
