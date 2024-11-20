import React, { useState, useEffect } from 'react';
import StillsPageContent from '../components/StillsPageContent';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import TransitionEffect from '../components/TransitionEffect';
import '../styles/FadeInOut.css';

const words = ['FEATURE', 'MOTION', 'MOTIONS', 'MOVIES', 'FLICKS', 'PICTURES'];

export default function Stills() {
  const [stillsData, setStillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchStillsData = async () => {
      try {
        const clientsCollection = collection(db, 'clients');
        const clientSnapshot = await getDocs(clientsCollection);
        const stillsArray = [];

        let processedDocs = 0;
        const totalDocs = clientSnapshot.docs.length;

        for (const doc of clientSnapshot.docs) {
          const clientData = doc.data();
          if (clientData.stills) {
            const clientStills = Array.isArray(clientData.stills)
              ? clientData.stills
              : Object.values(clientData.stills);

            for (const still of clientStills) {
              stillsArray.push({
                id: `${doc.id}_${still.clientId || ''}`,
                clientKey: doc.id,
                clientName: clientData.name,
                clientImage: clientData.image,
                ...still,
              });
            }
          }
          processedDocs++;
          setLoadingProgress((processedDocs / totalDocs) * 50);
        }

        console.log('Stills data:', stillsArray);
        setStillsData(stillsArray);

        await preloadImages(stillsArray);

        setLoading(false);
        setTimeout(() => setShowContent(true), 1000); // Delay content display
      } catch (err) {
        console.error('Error fetching stills data: ', err);
        setError('Failed to load stills data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStillsData();
  }, []);

  const preloadImages = async (data) => {
    const imageUrls = data
      .flatMap((item) => [item.clientImage, item.image])
      .filter(Boolean);
    const totalImages = imageUrls.length;
    let loadedImages = 0;

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedImages++;
          setLoadingProgress(50 + (loadedImages / totalImages) * 50);
          resolve();
        };
        img.onerror = reject;
      });
    };

    try {
      await Promise.all(imageUrls.map(loadImage));
    } catch (error) {
      console.error('Error preloading images:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    initial: { opacity: 0, y: 20 }, // Start slightly below
    animate: { opacity: 1, y: 0 }, // Move to its natural position
    exit: { opacity: 0, y: -20 }, // Move upwards on exit
  };

  if (loading || error) {
    return (
      <TransitionEffect
        isLoading={loading}
        progress={loadingProgress}
        pageName='Stills'
      />
    );
  }

  return (
    <>
      <div style={styles.motionContainer}>
        <div style={styles.sliderContainer}>
          <div style={styles.inTopSliderContainer}>
            <motion.h1
              initial={{ x: '-120%' }}
              animate={{ x: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={styles.sliderHeadings}
            >
              FEATURE
            </motion.h1>
            <img
              style={styles.motionSwiperVideo}
              className='fadeinout'
              src='https://res.cloudinary.com/da3r1iagy/image/upload/v1727814576/9d8d7a1ee3ba214afae49997eaedf852_l6snn2.png'
              alt='slider-image'
            />
          </div>
          <div style={styles.inBottomSliderContainer} className='fadeinout'>
            <img
              style={styles.imageSlider}
              src='https://res.cloudinary.com/da3r1iagy/image/upload/v1728759721/FEST0088-scaled_uispvw.png'
              alt='slider-image'
            />
            <div style={styles.bottomTextContainer}>
              <motion.h1
                initial={{ x: '150%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                style={styles.sliderHeadings2}
              >
                STILL
              </motion.h1>
              <div style={styles.bottomTextAnimation}>
                <AnimatePresence mode='wait'>
                  <motion.p
                    key={words[currentIndex]}
                    variants={containerVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    style={styles.sliderText}
                  >
                    {words[currentIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showContent && <StillsPageContent stillPageData={stillsData} />}
    </>
  );
}

const styles = {
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
  motionContainer: {
    paddingTop: '15vh',
    width: '100%',
    height: '87vh',
    position: 'relative',
    overflow: 'hidden',
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
  sliderHeadings: {
    fontSize: '150px',
    alignSelf: 'center',
    marginTop: 'auto',
    fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black',
    fontWeight: '800',
    letterSpacing: '-0.015em',
    textAlign: 'center',
    marginBlockStart: '0',
    marginBlockEnd: '0',
    marginBottom: '-90px',
  },
  sliderHeadings2: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginTop: '-27px',
    marginBottom: '0',
    lineHeight: '1',
    fontSize: '170px',
    fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black',
    fontWeight: '800',
    letterSpacing: '-0.015em',
    textAlign: 'center',
  },
  motionSwiperVideo: {
    width: '30%',
    maxHeight: '30vh',
    alignSelf: 'center',
  },
  imageSlider: {
    width: '45%',
    maxHeight: '40vh',
    marginLeft: '10px',
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
    marginTop: '20px',
  },
};
