import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/FadeInOut.css';

const words = ['FEATURE', 'MOTION', 'MOTIONS', 'MOVIES', 'FLICKS', 'PICTURES'];

function MotionSlider() {
  // Inline styles
  const styles = {
    motionContainer: {
      paddingTop: '15vh',
      width: '100%',
      height: '85vh',
      position: 'relative',
      overflow: 'hidden',
    },
    sliderHeadings: {
      fontSize: '150px',
      alignSelf: 'center',
      marginTop: 0,
      marginBlockEnd: 0,
      marginBlockStart: 0,
      marginBottom: '-75px',
      fontWeight: 800,
    },
    sliderHeadings2: {
      position: 'relative',
      fontSize: '150px',
      alignSelf: 'flex-start',
      marginBottom: 0,
      marginBlockStart: '0em',
      marginBlockEnd: '0em',
      height: '150px',
      marginTop: '-20px',
      alignItems: 'flex-start',
      lineHeight: 1,
      fontWeight: 800,
    },
    sliderContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    inTopSliderContainer: {
      marginBottom: '5vh',
      position: 'relative',
      display: 'flex',
      gap: '10px',
      height: '30vh',
      justifyContent: 'space-between',
      width: '80vw',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    motionSwiperVideo: {
      width: '30%',
      maxHeight: '30vh',
      alignSelf: 'center',
    },
    inBottomSliderContainer: {
      marginBottom: '5vh',
      position: 'relative',
      display: 'flex',
      gap: '10px',
      height: '40vh',
      justifyContent: 'space-between',
      width: '80vw',
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    imageSlider: {
      width: '40%',
    },
    bottomTextContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    bottomTextAnimation: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'space-evenly',
    },
    sliderText: {
      position: 'relative',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '25px',
      marginTop: 0,
    },
  };

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, []);
  const containerVariants = {
    initial: { opacity: 0, y: 20 }, // Start slightly below
    animate: { opacity: 1, y: 0 }, // Move to its natural position
    exit: { opacity: 0, y: -20 }, // Move upwards on exit
  };

  return (
    <div style={styles.motionContainer}>
      <div style={styles.sliderContainer}>
        <div style={styles.inTopSliderContainer}>
          <motion.h1
            initial={{ x: '-150%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={styles.sliderHeadings}
          >
            FEATURE
          </motion.h1>
          <video
            className='fadeinout'
            style={styles.motionSwiperVideo}
            src='https://res.cloudinary.com/da3r1iagy/video/upload/v1727868661/-ceaf-47ec-8e60-9468da999b3f_gemyqj.mp4'
            muted
            autoPlay
            loop
          />
        </div>
        <div style={styles.inBottomSliderContainer}>
          {/* <img
            className='fadeinout'
            style={styles.imageSlider}
            src='https://res.cloudinary.com/da3r1iagy/image/upload/v1727814576/9d8d7a1ee3ba214afae49997eaedf852_l6snn2.png'
            alt='slider-image'
          /> */}
          <video
            className='fadeinout'
            style={styles.imageSlider}
            src='https://res.cloudinary.com/da3r1iagy/video/upload/v1727868655/-f4de-4cd6-8720-860efd6c272b_ac1fhk.mp4'
            muted
            autoPlay
            loop
          />
          <div style={styles.bottomTextContainer}>
            <motion.h1
              initial={{ x: '150%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={styles.sliderHeadings2}
            >
              MOTION
            </motion.h1>
            <div style={styles.bottomTextAnimation}>
              <div className='relative h-[150px] overflow-hidden'>
                <AnimatePresence mode='wait'>
                  <motion.h1
                    key={words[currentIndex]}
                    variants={containerVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    className='text-[150px] leading-none m-0'
                  >
                    {words[currentIndex]}
                  </motion.h1>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotionSlider;
