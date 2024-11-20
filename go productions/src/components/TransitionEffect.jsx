import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TransitionEffect.css';

export default function TransitionEffect({
  isLoading,
  progress,
  pageName,
  onTransitionComplete,
}) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [minimumVisibleTime, setMinimumVisibleTime] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsAnimating(true);
    setMinimumVisibleTime(true);

    const timer = setTimeout(() => {
      setMinimumVisibleTime(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    if (!isLoading && progress === 100 && !minimumVisibleTime) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 100);
      onTransitionComplete();

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
        <div className='page-name'>{pageName}</div>
        <div className='progress-counter'>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
