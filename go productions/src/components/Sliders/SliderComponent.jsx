import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../Firebase';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/SliderComponent.css';

const SliderComponent = () => {
  const [motionData, setMotionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVideo, setModalVideo] = useState(null);
  const [clickedVideoRect, setClickedVideoRect] = useState(null);
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);

  useEffect(() => {
    const fetchMotionData = async () => {
      try {
        const motionsRef = collection(db, 'homeMotions');
        const q = query(motionsRef, orderBy('order'));
        const querySnapshot = await getDocs(q);
        const fetchedMotions = [];
        querySnapshot.forEach((doc) => {
          fetchedMotions.push({ id: doc.id, ...doc.data() });
        });
        setMotionData(fetchedMotions);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching motion data:', err);
        setError('Failed to load motion data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchMotionData();
  }, []);

  const openModal = (videoUrl, event) => {
    const videoElement = event.target;
    const rect = videoElement.getBoundingClientRect();
    setClickedVideoRect(rect);
    setModalVideo(videoUrl);
    setIsModalTransitioning(true);

    setTimeout(() => {
      setIsModalTransitioning(false);
    }, 400);
  };

  const closeModal = () => {
    setIsModalTransitioning(true);
    setTimeout(() => {
      setModalVideo(null);
      setClickedVideoRect(null);
      setIsModalTransitioning(false);
    }, 400);
  };

  if (isLoading) return <div className='loading'>Loading motion data...</div>;
  if (error) return <div className='error'>{error}</div>;

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
          autoplay={false}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 60 },
            1024: { slidesPerView: 1.5, spaceBetween: 70 },
          }}
        >
          {motionData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className='logo-container'>
                <img
                  src={item.logo}
                  alt={`${item.clientName} Logo`}
                  className='slide-logo'
                  loading='lazy'
                />
              </div>
              <video
                className='swiper-video'
                src={item.video}
                muted
                loop
                onClick={(e) => openModal(item.video, e)}
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
              <div className='sample-text'>
                <p>{item.productTitle}</p>
              </div>
            </SwiperSlide>
          ))}
          <div className='swiper-button-prev'></div>
          <div className='swiper-button-next'></div>
        </Swiper>
      </div>

      {modalVideo && (
        <div
          className={`modal ${modalVideo ? 'open' : ''}`}
          onClick={closeModal}
        >
          <div
            className={`modal-content ${
              modalVideo && !isModalTransitioning ? 'open' : ''
            } ${isModalTransitioning ? 'transitioning' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={
              clickedVideoRect && isModalTransitioning
                ? {
                    left: `${clickedVideoRect.left}px`,
                    top: `${clickedVideoRect.top}px`,
                    width: `${clickedVideoRect.width}px`,
                    height: `${clickedVideoRect.height}px`,
                  }
                : {}
            }
          >
            <span
              className={`modal-close ${
                modalVideo && !isModalTransitioning ? 'visible' : ''
              }`}
              onClick={closeModal}
            >
              &times;
            </span>
            <video src={modalVideo} controls autoPlay />
          </div>
        </div>
      )}
    </section>
  );
};

export default SliderComponent;
