import React, { useState } from 'react';
import { sliderImages } from '../data/data';
import '../styles/Slider.css';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newIndex, setNewIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(''); // 'top-to-bottom' or 'bottom-to-top'
  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrev = () => {
    if (isAnimating) return;
    const nextIndex = (currentIndex + 1) % sliderImages.length;
    startAnimation(nextIndex, 'top-to-bottom');
  };

  const goToNext = () => {
    if (isAnimating) return;
    const prevIndex =
      currentIndex === 0 ? sliderImages.length - 1 : currentIndex - 1;
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

  return (
    <div className='main-slider' onClick={handleClick}>
      <div className='slider-layer current'>
        <img
          src={sliderImages[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className='image'
          loading='lazy'
        />
      </div>
      {newIndex !== null && (
        <div className={`slider-layer new ${animationDirection}`}>
          <img
            src={sliderImages[newIndex]}
            alt={`Slide ${newIndex}`}
            className='image'
            loading='lazy'
          />
        </div>
      )}
      <div className='dots'>
        {sliderImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => !isAnimating && setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
