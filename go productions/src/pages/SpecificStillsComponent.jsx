import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ImagePopupComponent from '../components/ImagePopupComponent';
import TransitionEffect from '../components/TransitionEffect';
import { db } from '../Firebase';
import { doc, getDoc, orderBy } from 'firebase/firestore';

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
    if (still && still.internalImages) {
      // Extract the URLs from internalImages
      const internalImages = still.internalImages
        .filter(Boolean)
        .map((image) => image.url);

      let loadedImages = 0;
      const totalImages = internalImages.length + 1; // +1 for the main image

      // Create a layout for each image
      const layout = internalImages.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            loadedImages++;
            setProgress(50 + (loadedImages / totalImages) * 50);

            const isLandscape = img.width > img.height;
            resolve({
              src: url,
              isLandscape,
              gridColumn: isLandscape ? 'span 2' : 'span 1',
              gridRow: isLandscape ? 'span 1' : 'span 2',
            });
          };
          img.src = url;
        });
      });

      // Load main image
      const mainImg = new Image();
      mainImg.onload = () => {
        loadedImages++;
        setProgress(50 + (loadedImages / totalImages) * 50);
      };
      mainImg.src = still.image;

      // When all images are loaded, update the layout
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
        <img src={still.image} alt={still.text} style={styles.mainImage} />
        <div style={styles.imgTextContainer}>
          <div style={styles.logoContainer}>
            <img
              src={still.logo || still.clientImage}
              alt='Client Logo'
              style={styles.logo}
              loading='lazy'
            />
          </div>
          <div style={styles.descriptionContainer}>
            <h2 style={styles.description}>{still.text}</h2>
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
        <h3 style={styles.creditHeader}>CREDITS</h3>
        <hr style={styles.styleLine1} />

        {still.credits &&
          Object.entries(still.credits).map(([key, value]) => (
            <React.Fragment key={key}>
              <div style={styles.creditData}>
                <div style={styles.creditBlanks}></div>
                <div style={styles.creditContent}>
                  {key.toUpperCase()}: {value}
                </div>
              </div>
              <hr style={styles.styleLine2} />
            </React.Fragment>
          ))}
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
    paddingTop: '10vh',
    paddingBottom: '15vh',
    textAlign: 'center',
    backgroundColor: '#000',
    color: '#fff',
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
    height: '105vh',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  mainImage: {
    width: '100%',
    height: '90vh',
    objectFit: 'cover',
  },
  logoContainer: {},
  logo: {
    width: '200px',
  },
  descriptionContainer: {},
  description: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 0,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 4fr)',
    gap: '30px',
    width: '90%',
    margin: '20px auto',
  },
  gridItem: {
    overflow: 'hidden',
    cursor: 'pointer',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  creditsContainer: {
    marginTop: '30px',
    paddingTop: '20px',
    color: '#fff',
    textAlign: 'center',
  },
  creditHeader: {
    fontSize: '2rem',
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
    margin: '10px 0',
    width: '52%',
    marginLeft: '48%',
  },
  creditData: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '10px 0',
  },
  creditContent: {
    flex: '1',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  creditBlanks: {
    flex: '1',
  },
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
