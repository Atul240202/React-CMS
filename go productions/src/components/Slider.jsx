import React, { useState, useEffect } from 'react';
import '../styles/Slider.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroBanners, setHeroBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setHeroBanners(fetchedBanners);
        setIsLoading(false);
        // onLoad();
      } catch (err) {
        console.error('Error fetching hero banners:', err);
        setError('Failed to load images. Please try again later.');
        setIsLoading(false);
        // onLoad();
      }
    };

    fetchHeroBanners();
  }, []);

  const goToPrev = () => {
    if (isAnimating || heroBanners.length <= 1) return;
    const nextIndex = (currentIndex + 1) % heroBanners.length;
    startAnimation(nextIndex, 'top-to-bottom');
  };

  const goToNext = () => {
    if (isAnimating || heroBanners.length <= 1) return;
    const prevIndex =
      currentIndex === 0 ? heroBanners.length - 1 : currentIndex - 1;
    startAnimation(prevIndex, 'bottom-to-top');
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

  if (heroBanners.length === 0) {
    return <div className='no-images'>No images available</div>;
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
