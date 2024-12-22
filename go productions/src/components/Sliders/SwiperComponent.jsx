import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../Firebase';
import '../../styles/SwiperComponent.css';

const SwiperComponent = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsRef = collection(db, 'homeLocations');
        const q = query(locationsRef, orderBy('order'));
        const querySnapshot = await getDocs(q);
        const fetchedLocations = [];
        querySnapshot.forEach((doc) => {
          fetchedLocations.push({ id: doc.id, ...doc.data() });
        });
        setLocations(fetchedLocations);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleImageClick = (url) => {
    navigate(url);
  };

  if (isLoading) {
    return <div className='loading'>Loading locations...</div>;
  }

  if (error) {
    return <div className='error'>{error}</div>;
  }

  return (
    <div className={`swiper-container ${isMobile ? 'h-[80vh]' : 'h-auto'}`}>
      <Swiper
        modules={[Navigation]}
        loop={true}
        slidesPerView={window.innerWidth < 768 ? 1 : 2}
        spaceBetween={20}
        centeredSlides={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        className='curved-swiper'
        grid={3}
      >
        <div className='swiper-button-prev'></div>
        <div className='swiper-button-next'></div>

        {locations.map((location) => (
          <SwiperSlide key={location.id}>
            <img
              className='imageSlider'
              src={location.image}
              alt={location.name}
              loading='lazy'
              onClick={() => handleImageClick(location.url)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
