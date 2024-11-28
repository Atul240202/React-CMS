import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImagePopupComponent from '../components/ImagePopupComponent';
import { db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import TransitionEffect from '../components/TransitionEffect';

export default function SpecificLocationComponent() {
  const { locationKey } = useParams();
  const [location, setLocation] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [imageLayout, setImageLayout] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setProgress(25);
        const locationDoc = await getDoc(doc(db, 'locations', locationKey));
        setProgress(50);
        if (locationDoc.exists()) {
          const locationData = locationDoc.data();
          setLocation(locationData);
          setProgress(75);

          // Prepare layout for images
          const layout = [
            {
              src: locationData.image,
              gridColumn: 'span 2',
              gridRow: 'span 2', // Assuming main image takes larger space
            },
            ...(locationData.internalImages || []).map((img) => ({
              src: img.url,
              gridColumn: img.ratio > 1 ? 'span 2' : 'span 1',
              gridRow: img.ratio > 1 ? 'span 1' : 'span 2',
            })),
          ];

          setImageLayout(layout);
          setProgress(100);
        } else {
          setError('Location not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching location: ', err);
        setError('Failed to load location. Please try again later.');
        setLoading(false);
      }
    };

    fetchLocation();
    window.scrollTo(0, 0);
  }, [locationKey]);
  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  const openPopup = (index) => {
    setPopupIndex(index);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName='Location'
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && location && (
        <div style={styles.specLocationContainer}>
          <div style={styles.headerImageContainer} onClick={() => openPopup(0)}>
            <img
              src={location.image}
              alt={location.text}
              style={styles.headerImage}
              loading='lazy'
            />
          </div>
          <div className='flex justify-between items-start ml-[5vw] mr-[5vw]'>
            <div className='flex flex-col text-left'>
              <h2 style={styles.locationTitle} className='font-chesna'>
                {location.text.toUpperCase()}
              </h2>
              <p style={styles.locationAddress} className='font-chesna'>
                {location.address.toUpperCase()}
              </p>
            </div>
            <div className='mt-3'>
              <button
                className='bg-white/10 border-2 rounded-[0] border-white text-white px-6 py-3 hover:bg-white/20 hover:border-white transition-all duration-300'
                onClick={() =>
                  console.log('Request availability for', location.name)
                }
              >
                Request availability
              </button>
            </div>
          </div>

          <div style={styles.imagesGrid}>
            {imageLayout.map((image, index) => (
              <div
                key={index}
                style={{
                  ...styles.gridItem,
                  gridColumn: image.gridColumn,
                  gridRow: image.gridRow,
                }}
                onClick={() => openPopup(index)}
              >
                <img
                  src={image.src}
                  alt={`Location view ${index + 1}`}
                  style={styles.locationImage}
                  loading='lazy'
                />
              </div>
            ))}
          </div>

          {isPopupOpen && (
            <ImagePopupComponent
              images={imageLayout.map((img) => img.src)}
              initialIndex={popupIndex}
              onClose={closePopup}
            />
          )}
        </div>
      )}
      {error && <div style={styles.loadingError}>{error}</div>}
    </>
  );
}

const styles = {
  specLocationContainer: {
    width: '100%',
    margin: 'auto',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#000',
    fontFamily: 'Arial, sans-serif',
  },
  headerImageContainer: {
    width: '100%',
    height: 'auto',
    marginBottom: '1.5rem',
    paddingTop: '10vh',
    cursor: 'pointer',
  },
  headerImage: {
    width: '100%',
    height: '90vh',
    objectFit: 'cover',
  },
  locationTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    marginTop: '0.5rem',
  },
  locationAddress: {
    fontSize: '24px',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '1rem',
    marginTop: '0.5rem',
  },
  imagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    width: '90%',
    margin: '20px auto',
  },
  gridItem: {
    overflow: 'hidden',
    cursor: 'pointer',
  },
  locationImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '2rem',
  },
  requestButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  requestButtonHover: {
    backgroundColor: '#0056b3', // Darker shade for hover effect
  },
};
