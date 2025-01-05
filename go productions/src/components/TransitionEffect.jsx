import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TransitionEffect.css';

const quotes = [
  {
    text: 'It is an illusion that photos are made with the camera... they are made with the eye, heart, and head.',
    author: 'Henri Cartier-Bresson',
  },
  {
    text: 'Creativity is intelligence having fun.',
    author: 'Albert Einstein',
  },
  {
    text: 'Good advertising does not just circulate information. It penetrates the public mind with desires and belief.',
    author: 'Leo Burnett',
  },
  {
    text: 'The best ideas come as jokes. Make your thinking as funny as possible.',
    author: 'David Ogilvy',
  },
  {
    text: 'In a world where digital is default, authentic storytelling becomes invaluable.',
    author: 'Anonymous',
  },
  {
    text: 'Every great film should seem new every time you see it.',
    author: 'Roger Ebert',
  },
  {
    text: 'The role of the designer is that of a good, thoughtful host anticipating the needs of his guests.',
    author: 'Charles Eames',
  },
  {
    text: 'Design is not just what it looks like and feels like. Design is how it works.',
    author: 'Steve Jobs',
  },
  {
    text: "The best marketing doesn't feel like marketing.",
    author: 'Tom Fishburne',
  },
  {
    text: 'Your brand is a story unfolding across all customer touch points.',
    author: 'Jonah Sachs',
  },
];

export default function TransitionEffect({
  isLoading,
  progress,
  pageName,
  onTransitionComplete,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAnimating, setIsAnimating] = useState(true);
  const [minimumVisibleTime, setMinimumVisibleTime] = useState(true);
  const [randomQuote, setRandomQuote] = useState(quotes[0]);
  const location = useLocation();

  useEffect(() => {
    setIsAnimating(true);
    setMinimumVisibleTime(true);
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const timer = setTimeout(() => {
      setMinimumVisibleTime(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isLoading && progress === 100 && !minimumVisibleTime) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onTransitionComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading, progress, minimumVisibleTime, onTransitionComplete]);

  if (!isAnimating && !isLoading) return null;

  return (
    <div
      className={`transition ${isAnimating ? 'active' : ''} ${
        !isLoading && progress === 100 && !minimumVisibleTime ? 'exit' : ''
      }`}
    >
      <div className='cover'>
        <div className='content-wrapper'>
          <div
            className='logo-wrapper'
            style={{ '--progress': `${progress}%` }}
          >
            <div className='text-container'>
              <span
                className={`go font-chesna ${
                  isMobile
                    ? 'text-[34.85px] leading-[36.79px]'
                    : 'text-[54.85px] leading-[76.79px]'
                }`}
              >
                GO
              </span>
              <span
                className={`productions font-chesnal ${
                  isMobile
                    ? 'text-[34.85px] leading-[36.79px]'
                    : 'text-[54.85px] leading-[76.79px]'
                }`}
              >
                PRODUCTIONS
              </span>
            </div>
            <div className='text-overlay'>
              <span
                className={`go font-chesna ${
                  isMobile
                    ? 'text-[34.85px] leading-[36.79px]'
                    : 'text-[54.85px] leading-[76.79px]'
                }`}
              >
                GO
              </span>
              <span
                className={`productions font-chesnal ${
                  isMobile
                    ? 'text-[34.85px] leading-[36.79px]'
                    : 'text-[54.85px] leading-[76.79px]'
                }`}
              >
                PRODUCTIONS
              </span>
            </div>
          </div>
          <div className='quote-wrapper'>
            <p className='quote-text font-raleway'>"{randomQuote.text}"</p>
            <p className='quote-author font-raleway'>-{randomQuote.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
