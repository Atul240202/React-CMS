import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import TransitionEffect from '../components/TransitionEffect';

export default function SpecificMotionComponent() {
  const { text } = useParams();
  const location = useLocation();
  const [motion, setMotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchMotionData = async () => {
      try {
        let motionData;
        if (location.state?.motion) {
          motionData = location.state.motion;
          setProgress(100);
        } else {
          const [clientId, motionId] = text.split('_');
          const clientDoc = doc(db, 'clients', clientId);
          setProgress(25);
          const clientSnapshot = await getDoc(clientDoc);
          setProgress(50);
          if (clientSnapshot.exists()) {
            const clientData = clientSnapshot.data();
            motionData = clientData.motions.find(
              (m) => m.clientId === motionId
            );
            setProgress(75);
            if (!motionData) {
              throw new Error('Motion not found');
            }
            motionData = {
              id: text,
              clientKey: clientId,
              clientName: clientData.name,
              clientImage: clientData.image,
              ...motionData,
            };
            setProgress(100);
          } else {
            throw new Error('Client not found');
          }
        }
        setMotion(motionData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching motion data: ', err);
        setError('Failed to load motion data. Please try again later.');
        setLoading(false);
      }
    };

    fetchMotionData();
    window.scrollTo(0, 0);
  }, [text, location.state]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleVideoClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName={motion ? `${motion.text} Motion` : 'Motion...'}
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && motion && (
        <div style={styles.container}>
          <div style={styles.videoContainer}>
            <video
              src={motion.video}
              autoPlay
              muted
              loop
              style={styles.video}
              className={`${isMobile ? 'w-[90%] mt-[5vh]' : 'w-[100%]'}`}
              onClick={handleVideoClick}
            />
          </div>
          <div
            style={styles.textContainer}
            className={`${isMobile ? 'mt-3 ml-5 mr-5' : 'mt-5'}`}
          >
            <h1
              style={styles.text}
              className={`${isMobile ? 'text-sm' : 'text-4xl'}`}
            >
              {motion.text}
            </h1>
            <img
              src={motion.logo || motion.clientImage}
              alt='Logo'
              style={styles.logo}
              loading='lazy'
              className={`${isMobile ? 'w-[100px]' : 'w-[250px]'}`}
            />
          </div>
          <div style={styles.creditContainer}>
            <h3
              style={styles.creditHeader}
              className={`${isMobile ? 'text-md' : 'text-4xl'}`}
            >
              CREDITS
            </h3>
          </div>
          <hr style={styles.styleLine1} />
          <div style={styles.creditData}>
            <div
              style={styles.creditBlanks}
              className={`${isMobile ? 'flex-3' : 'flex-1'}`}
            ></div>
            <h3
              style={styles.creditContent}
              className={`${isMobile ? 'text-sm flex-7' : 'text-xl flex-1'}`}
            >
              CLIENT: {motion.clientName}
            </h3>
          </div>
          <hr style={styles.styleLine1} />
          <div style={styles.creditData}>
            <div
              style={styles.creditBlanks}
              className={`${isMobile ? 'flex-3' : 'flex-1'}`}
            ></div>
            <div
              style={styles.creditContent}
              className={`${isMobile ? 'text-sm flex-7' : 'text-xl flex-1'}`}
            >
              PRODUCTION TITLE: {motion.productTitle || 'N/A'}
            </div>
          </div>
          {motion.credits &&
            Object.entries(motion.credits).map(([key, value]) => (
              <React.Fragment key={key}>
                <hr
                  style={styles.styleLine2}
                  className={` ${
                    isMobile
                      ? 'w-[73%] ml-[25%] mr-[2%]'
                      : 'w-[50%] ml-[48%] mr-[2%]'
                  }`}
                />
                <div style={styles.creditData}>
                  <div
                    style={styles.creditBlanks}
                    className={`${isMobile ? 'flex-3' : 'flex-1'}`}
                  ></div>
                  <div
                    style={styles.creditContent}
                    className={`${
                      isMobile ? 'text-sm flex-7' : 'text-xl flex-1'
                    }`}
                  >
                    {key.toUpperCase()}: {value}
                  </div>
                </div>
              </React.Fragment>
            ))}
          <hr
            style={styles.styleLine2}
            className={`${
              isMobile ? 'w-[73%] ml-[25%] mr-[2%]' : 'w-[50%] ml-[48%] mr-[2%]'
            }`}
          />

          {isPopupOpen && (
            <div style={styles.popupOverlay}>
              <div style={styles.popupContent}>
                <button onClick={handleClosePopup} style={styles.closeButton}>
                  &times;
                </button>
                <video src={motion.video} controls style={styles.popupVideo} />
              </div>
            </div>
          )}
        </div>
      )}
      {error && <div style={styles.loadingError}>{error}</div>}
    </>
  );
}

const styles = {
  container: {
    paddingTop: '5vh',
    paddingBottom: '5vh',
    position: 'relative',
    textAlign: 'center',
    color: '#fff',
    margin: 'auto',
  },
  videoContainer: {
    position: 'relative',
  },
  video: {
    cursor: 'pointer',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditContainer: {
    marginTop: '5vh',
    marginLeft: '2vw',
    marginRight: '2vw',
    textAlign: 'left',
  },
  creditData: {
    display: 'flex',
  },
  text: {
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 0,
  },
  creditHeader: {
    marginBottom: '1rem',
    fontWeight: 800,
    marginLeft: '3vw',
  },

  creditContent: {
    display: 'flex',
  },
  creditBlanks: {},
  logo: {},
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContent: {
    position: 'relative',
    width: '80%',
    maxWidth: '900px',
    padding: '20px',
    backgroundColor: '#000',
    borderRadius: '8px',
  },
  closeButton: {
    position: 'absolute',
    top: '0',
    right: '0',
    background: 'transparent',
    color: '#fff',
    padding: 10,
    border: 'none',
    cursor: 'pointer',
  },
  popupVideo: {
    width: '100%',
  },
  styleLine1: {
    height: '1px',
    border: 'none',
    background: 'white',
    margin: '10px 20px',
  },
  styleLine2: {
    height: '1px',
    border: 'none',
    background: 'white',
  },
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
