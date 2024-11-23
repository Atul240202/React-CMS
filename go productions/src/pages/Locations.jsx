import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import TransitionEffect from '../components/TransitionEffect';
import '../styles/FadeInOut.css';
import { motion } from 'framer-motion';

export default function Locations() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsCollection = collection(db, 'locations');
        const locationSnapshot = await getDocs(locationsCollection);
        const locationList = [];
        let processedDocs = 0;

        locationSnapshot.forEach((doc) => {
          locationList.push({
            id: doc.id,
            ...doc.data(),
          });
          processedDocs++;
          setProgress((processedDocs / locationSnapshot.size) * 100);
        });

        setLocations(locationList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching locations: ', err);
        setError('Failed to load locations. Please try again later.');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const navigateToLocationPage = (locationId) => {
    navigate(`/locations/${locationId}`);
  };
  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  const textVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName='Locations'
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && (
        <>
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
                <img
                  className='fadeinout'
                  style={styles.motionSwiperVideo}
                  src='https://res.cloudinary.com/da3r1iagy/image/upload/v1728323935/1ad23f85ffce6677e3e4a7975417c597_y5rffi.png'
                  alt='slider-image'
                  loading='lazy'
                />
              </div>
              <div style={styles.inBottomSliderContainer}>
                <img
                  className='fadeinout'
                  style={styles.imageSlider}
                  src='https://res.cloudinary.com/da3r1iagy/image/upload/v1728323935/abd03797bf7fe8d160553bd5d01191bd_gv5vbi.png'
                  alt='slider-image'
                  loading='lazy'
                />
                <div style={styles.bottomTextContainer}>
                  <motion.h1
                    initial={{ x: '150%' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    style={styles.sliderHeadings2}
                  >
                    LOCATION
                  </motion.h1>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.container}>
            {locations.map((item, index) => (
              <div
                key={item.id}
                style={{
                  ...styles.itemContainer,
                  flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
                }}
              >
                <div
                  style={styles.imageContainer}
                  onClick={() => navigateToLocationPage(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.text}
                    style={styles.image}
                    loading='lazy'
                  />
                </div>
                <motion.div
                  style={styles.blankContainer}
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: '-100px' }}
                >
                  <motion.h2 variants={textVariants} style={styles.text}>
                    {item.text}
                  </motion.h2>
                  <motion.h2
                    variants={textVariants}
                    style={styles.text}
                    transition={{ delay: 0.2 }}
                  >
                    {item.address}
                  </motion.h2>
                </motion.div>
              </div>
            ))}
          </div>
        </>
      )}
      {error && <div style={styles.loadingError}>{error}</div>}
    </>
  );
}

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
    alignSelf: 'end',
    marginTop: 'auto',
    fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black',
    fontWeight: '800',
    letterSpacing: '-0.015em',
    textAlign: 'center',
    marginBlockStart: '0',
    marginBlockEnd: '0',
    marginBottom: '-30px',
  },
  sliderHeadings2: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: '0',
    lineHeight: '1',
    fontSize: '150px',
    fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black',
    fontWeight: '800',
    letterSpacing: '-0.015em',
    textAlign: 'center',
    marginTop: '-27px',
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
    height: '35vh',
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
    height: '35vh',
    justifyContent: 'space-between',
    width: '80vw',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  imageSlider: {
    width: '30%',
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
    marginTop: '0',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#000',
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85rem',
    height: '60vh',
  },
  imageContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '60vh',
  },

  blankContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: '40px',
    fontWeight: 800,
    color: '#fff',
    margin: '0',
  },
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
