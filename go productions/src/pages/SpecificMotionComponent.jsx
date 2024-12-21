import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import TransitionEffect from '../components/TransitionEffect';

export default function SpecificMotionComponent() {
  const { clientId, id } = useParams();
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
          const clientDoc = doc(db, 'clients', clientId);
          setProgress(25);
          const clientSnapshot = await getDoc(clientDoc);
          setProgress(50);
          if (clientSnapshot.exists()) {
            const clientData = clientSnapshot.data();
            motionData = clientData.motions.find((m) => m.id === id);
            setProgress(75);
            if (!motionData) {
              throw new Error('Motion not found');
            }
            motionData = {
              id: id,
              clientId: clientId,
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
  }, [clientId, id, location.state]);

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
        <div
          style={styles.container}
          className={`${isMobile ? 'w-[95vw]' : ''}`}
        >
          <div style={styles.videoContainer}>
            <video
              src={motion.video}
              autoPlay
              muted
              loop
              style={styles.video}
              className={`${
                isMobile ? 'w-[100%] mt-[5vh] ' : 'w-[100%] h-[95vh]'
              }`}
              onClick={handleVideoClick}
            />
          </div>
          <div
            style={styles.textContainer}
            className={`${isMobile ? 'mt-3' : 'mx-7 '}`}
          >
            <h1
              style={styles.text}
              className={`${isMobile ? 'text-sm' : 'text-4xl my-[auto]'}`}
            >
              {motion.text}
            </h1>
            <img
              src={motion.logo || motion.clientImage}
              alt='Logo'
              style={styles.logo}
              loading='lazy'
              className={`${isMobile ? 'max-w-[200px]' : 'w-[250px]'}`}
            />
          </div>
          <div
            style={styles.creditContainer}
            className={`${isMobile ? '' : 'ml-[2vw] mr-[2vw]'}`}
          >
            <h3
              style={styles.creditHeader}
              className={`${isMobile ? 'text-md' : 'text-4xl'}`}
            >
              CREDITS
            </h3>
          </div>
          <hr
            style={styles.styleLine1}
            className={`${isMobile ? '' : 'ml-[20px] mr-[20px]'}`}
          />
          <div style={styles.creditData}>
            <div
              style={styles.creditBlanks}
              className={`${isMobile ? '' : 'flex-1'}`}
            ></div>
            <h3
              style={styles.creditContent}
              className={`${
                isMobile ? 'text-sm ' : 'text-2xl leading-[0] flex-1'
              }`}
            >
              CLIENT- {motion.clientName}
            </h3>
          </div>
          <hr
            style={styles.styleLine1}
            className={`${isMobile ? '' : 'ml-[20px] mr-[20px]'}`}
          />
          <div style={styles.creditData}>
            <div
              style={styles.creditBlanks}
              className={`${isMobile ? '' : 'flex-1'}`}
            ></div>
            <div
              style={styles.creditContent}
              className={`${isMobile ? 'text-sm' : 'text-2xl  flex-1'}`}
            >
              CAMPAIGN TITLE- {motion.productTitle || 'N/A'}
            </div>
          </div>
          {motion.credits &&
            Object.entries(motion.credits).map(([key, value]) => {
              // Check if the credit should be visible
              const isVisible =
                motion.visibleFields[`credits.${key}`] !== false;
              if (isVisible) {
                return (
                  <React.Fragment key={key}>
                    <hr
                      style={styles.styleLine2}
                      className={` ${
                        isMobile ? 'w-[100%]' : 'w-[49%] ml-[50%] mr-[1%]'
                      }`}
                    />
                    <div style={styles.creditData}>
                      <div
                        style={styles.creditBlanks}
                        className={`${isMobile ? '' : ' text-2xl flex-1'}`}
                      ></div>
                      <div
                        style={styles.creditContent}
                        className={`${
                          isMobile ? 'text-sm' : 'text-2xl flex-1'
                        }`}
                      >
                        {key.toUpperCase()}: {value}
                      </div>
                    </div>
                  </React.Fragment>
                );
              }
              return null;
            })}
          <hr
            style={styles.styleLine2}
            className={`${isMobile ? 'w-[100%]' : 'w-[49%] ml-[50%] mr-[1%]'}`}
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
    // marginLeft: '2vw',
    // marginRight: '2vw',
    textAlign: 'left',
  },
  creditData: {
    display: 'flex',
  },
  text: {
    fontWeight: 'bold',
  },
  creditHeader: {
    marginBottom: '1rem',
    fontWeight: 800,
  },

  creditContent: {
    display: 'flex',
    fontWeight: 'bold',
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
    maxHeight: '80vh',
  },
  styleLine1: {
    height: '1px',
    border: 'none',
    background: 'white',
    // marginLeft: '20px',
    // marginRight: '20px',
  },
  styleLine2: {
    height: '1px',
    border: 'none',
    background: 'white',
    marginBottom: '10px',
    marginTop: '10px',
  },
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
