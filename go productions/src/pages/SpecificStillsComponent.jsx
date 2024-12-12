import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ImagePopupComponent from '../components/ImagePopupComponent';
import TransitionEffect from '../components/TransitionEffect';
import { db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function SpecificStillsComponent() {
  const { clientId, stillId } = useParams();
  const location = useLocation();
  const [client, setClient] = useState(null);
  const [still, setStill] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupImages, setPopupImages] = useState([]);
  const [imageLayout, setImageLayout] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [transitionComplete, setTransitionComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProgress(10);
        if (location.state?.still) {
          setStill(location.state.still);
          setProgress(50);
        } else {
          const clientDoc = await getDoc(doc(db, 'clients', clientId));
          setProgress(30);
          if (clientDoc.exists()) {
            const clientData = clientDoc.data();
            setClient(clientData);
            const stillData =
              clientData.stills[stillId] ||
              Object.values(clientData.stills).find((s) => s.id === stillId);

            if (stillData) {
              setStill(stillData);
              setProgress(50);
            } else {
              console.error('Still not found');
              setProgress(100);
              setIsLoading(false);
            }
          } else {
            console.error('Client not found');
            setProgress(100);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        setProgress(100);
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [clientId, stillId, location.state]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (still && still.internalImages) {
      const internalImages = still.internalImages
        .filter(Boolean)
        .map((image) => image.url);

      const getGridSpan = (ratio) => {
        if (ratio > 1.3) return { gridColumn: 'span 3', gridRow: 'span 2' };
        if (ratio < 0.7) return { gridColumn: 'span 1', gridRow: 'span 2' };
        if (ratio >= 0.8 && ratio <= 1.1)
          return { gridColumn: 'span 2', gridRow: 'span 2' }; // Square condition
        return { gridColumn: 'span 2', gridRow: 'span 2' }; // Default for other ratios
      };

      let loadedImages = 0;
      const totalImages = internalImages.length + 1;

      const layout = internalImages.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedImages++;
            setProgress(50 + (loadedImages / totalImages) * 50);

            const ratio = img.width / img.height;
            resolve({
              src: url,
              ratio,
              ...getGridSpan(ratio),
            });
          };
          img.src = url;
        });
      });

      const mainImg = new Image();
      mainImg.onload = () => {
        loadedImages++;
        setProgress(50 + (loadedImages / totalImages) * 50);
      };
      mainImg.src = still.image;

      Promise.all(layout).then((resolvedLayout) => {
        setImageLayout(resolvedLayout);
        setIsLoading(false);
        setProgress(100);
      });
    }
  }, [still]);

  const openMainImagePopup = () => {
    setPopupImages([still.image, ...imageLayout.map((img) => img.src)]);
    setCurrentImageIndex(0);
    setIsPopupVisible(true);
  };

  const openGridImagePopup = (index) => {
    setPopupImages(imageLayout.map((img) => img.src));
    setCurrentImageIndex(index);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleTransitionComplete = () => {
    setTransitionComplete(true);
  };

  if (!still || isLoading || !transitionComplete) {
    return (
      <TransitionEffect
        isLoading={isLoading}
        progress={progress}
        pageName={still ? `${still.text} Still` : 'Still...'}
        onTransitionComplete={handleTransitionComplete}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.mainImageContainer} onClick={openMainImagePopup}>
        <img
          src={still.image}
          alt={still.text}
          style={styles.mainImage}
          className={`${
            isMobile ? 'h-[30vh] w-[90%] m-auto' : 'h-[90vh] w-[100%]'
          }`}
        />
        <div style={styles.imgTextContainer}>
          <div style={styles.logoContainer}>
            <img
              src={still.logo || still.clientImage}
              alt='Client Logo'
              style={styles.logo}
              loading='lazy'
              className={`${isMobile ? 'w-[124px]' : 'w-[200px]'}`}
            />
          </div>
          <div style={styles.descriptionContainer}>
            <h2
              style={styles.description}
              className={`${isMobile ? 'text-[1.5rem]' : 'text-[2.5rem]'}`}
            >
              {still.text}
            </h2>
          </div>
        </div>
      </div>
      {imageLayout.length > 0 && (
        <div style={styles.gridContainer}>
          {imageLayout.map((image, index) => (
            <div
              key={index}
              style={{
                ...styles.gridItem,
                gridColumn: image.gridColumn,
                gridRow: image.gridRow,
                aspectRatio: styles.gridItem.aspectRatio(image),
              }}
              onClick={() => openGridImagePopup(index)}
            >
              <img
                src={image.src}
                alt={`Internal Image ${index + 1}`}
                style={styles.gridImage}
                loading='lazy'
              />
            </div>
          ))}
        </div>
      )}
      <div style={styles.creditsContainer}>
        <h3
          style={styles.creditHeader}
          className={`${isMobile ? 'text-md' : 'text-4xl'}`}
        >
          CREDITS
        </h3>
        <hr style={styles.styleLine1} />

        <div style={styles.creditData}>
          <div
            style={styles.creditBlanks}
            className={`${isMobile ? '' : 'flex-1'}`}
          ></div>
          <div
            style={styles.creditContent}
            className={`${isMobile ? 'text-sm' : 'text-2xl flex-1 px-4'}`}
          >
            CLIENT: {still.clientName}
          </div>
        </div>
        <hr style={styles.styleLine1} />
        {still.credits &&
          Object.entries(still.credits).map(([key, value]) => {
            // Check if the credit should be visible
            const isVisible = still.visibleFields[`credits.${key}`] !== false;
            if (isVisible) {
              return (
                <React.Fragment key={key}>
                  <div style={styles.creditData}>
                    <div
                      style={styles.creditBlanks}
                      className={`${isMobile ? 'flex-3' : 'flex-1'}`}
                    ></div>
                    <div
                      style={styles.creditContent}
                      className={`${
                        isMobile
                          ? 'text-sm flex-7 ml-[2vw]'
                          : 'text-2xl flex-1 ml-[0]'
                      }`}
                    >
                      {key.toUpperCase()}: {value}
                    </div>
                  </div>
                  <hr
                    style={styles.styleLine2}
                    className={`${
                      isMobile ? 'w-[98%] my-[1%]' : 'w-[50%] ml-[50%]'
                    }`}
                  />
                </React.Fragment>
              );
            }
            return null;
          })}
      </div>

      {isPopupVisible && (
        <ImagePopupComponent
          images={popupImages}
          initialIndex={currentImageIndex}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '5vh',
    textAlign: 'center',
    backgroundColor: '#000',
    color: '#fff',
    marginTop: '10vh',
  },
  imgTextContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px',
  },
  mainImageContainer: {
    position: 'relative',
    marginBottom: '20px',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  mainImage: {
    objectFit: 'cover',
  },
  logoContainer: {},
  logo: {},
  descriptionContainer: {},
  description: {
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 0,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '16px',
    width: '90%',
    margin: '20px auto',
  },
  gridItem: {
    overflow: 'hidden',
    cursor: 'pointer',
    position: 'relative',
    aspectRatio: (image) => {
      if (image.ratio > 1.3) return '16/9';
      if (image.ratio < 0.7) return '9/16';
      return '10/8.5'; // Square or near-square
    },
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  creditsContainer: {
    marginTop: '30px',
    paddingTop: '20px',
    marginLeft: '2vw',
    marginRight: '2vw',
    color: '#fff',
    textAlign: 'left',
  },
  creditHeader: {
    marginBottom: '1rem',
    fontWeight: 800,
  },
  styleLine1: {
    height: '1px',
    border: 'none',
    background: 'white',
    margin: '10px 0',
  },
  styleLine2: {
    height: '1px',
    border: 'none',
    background: 'white',
    marginTop: '10px',
  },
  creditData: {
    display: 'flex',
    margin: '10px 0',
  },
  creditContent: {
    display: 'flex',
    fontWeight: 'bold',
  },
  creditBlanks: {},
  creditLabel: {
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
