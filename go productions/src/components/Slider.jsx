import React, { useState, useEffect } from 'react';
import '../styles/Slider.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';

const Slider = ({ onSliderLoad }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroBanners, setHeroBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prefetchImages = async (images) => {
    const promises = images.map(
      (image) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = image.imageUrl;
          img.onload = () => resolve(image);
          img.onerror = (err) => reject(err);
        })
    );

    return Promise.all(promises);
  };

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const heroBannersRef = collection(db, 'heroBanners');
        const q = query(heroBannersRef, orderBy('sequence'));
        const querySnapshot = await getDocs(q);
        const fetchedBanners = [];
        querySnapshot.forEach((doc) => {
          fetchedBanners.push({ id: doc.id, ...doc.data() });
        });

        await prefetchImages(fetchedBanners);
        setHeroBanners(fetchedBanners);
        setIsLoading(false);
        setAllImagesLoaded(true);
        console.log('slider component progress', fetchedBanners);
        onSliderLoad(true); // Pass true to indicate all images are loaded
      } catch (err) {
        console.error('Error fetching hero banners:', err);
        setError('Failed to load images. Please try again later.');
        setIsLoading(false);
        onSliderLoad(false); // Pass false to indicate error in loading
      }
    };

    fetchHeroBanners();
  }, [onSliderLoad]);

  const goToPrev = () => {
    if (isAnimating || heroBanners.length <= 1) return;
    const prevIndex =
      currentIndex === 0 ? heroBanners.length - 1 : currentIndex - 1;
    startAnimation(prevIndex, 'top-to-bottom');
  };

  const goToNext = () => {
    if (isAnimating || heroBanners.length <= 1) return;
    const nextIndex = (currentIndex + 1) % heroBanners.length;
    startAnimation(nextIndex, 'bottom-to-top');
  };

  const startAnimation = (newIndex, direction) => {
    setIsAnimating(true);
    setNewIndex(newIndex);
    setAnimationDirection(direction);

    setTimeout(() => {
      setCurrentIndex(newIndex);
      setNewIndex(null);
      setIsAnimating(false);
    }, 500); // Match CSS animation duration
  };

  const handleClick = (e) => {
    const clickX = e.clientX;
    const windowWidth = window.innerWidth;

    if (clickX > windowWidth / 2) {
      goToNext();
    } else {
      goToPrev();
    }
  };

  if (error) {
    return <div className='error'>{error}</div>;
  }

  if (isLoading || heroBanners.length === 0) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div className='main-slider' onClick={handleClick}>
      <div className='slider-layer current'>
        <img
          src={heroBanners[currentIndex].imageUrl}
          alt={`Slide ${currentIndex}`}
          className='image'
          loading='lazy'
        />
      </div>
      {newIndex !== null && (
        <div className={`slider-layer new ${animationDirection}`}>
          <img
            src={heroBanners[newIndex].imageUrl}
            alt={`Slide ${newIndex}`}
            className='image'
            loading='lazy'
          />
        </div>
      )}
      {heroBanners.length > 1 && (
        <div className='dots'>
          {heroBanners.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => !isAnimating && setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
