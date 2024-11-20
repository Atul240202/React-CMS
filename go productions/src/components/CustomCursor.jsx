import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', mouseMove);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, []);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;

      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        setCursorVariant('hover');
      } else if (target.tagName === 'BUTTON' || target.closest('button')) {
        setCursorVariant('click');
      } else if (target.tagName === 'A') {
        setCursorVariant('navigation');
      } else {
        setCursorVariant('default');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 5,
      y: mousePosition.y - 5,
      height: 10,
      width: 10,
      fontSize: '0px',
      backgroundColor: 'rgba(100, 100, 100, 0.5)',
      border: '2px solid white',
    },
    hover: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      fontSize: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid white',
    },
    click: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      fontSize: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid white',
    },
    navigation: {
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      height: 40,
      width: 40,
      fontSize: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid white',
    },
  };

  return (
    <motion.div
      className='custom-cursor'
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      {cursorVariant === 'hover' && 'View'}
      {cursorVariant === 'click' && 'Click'}
      {cursorVariant === 'navigation' && 'Go'}
    </motion.div>
  );
}
