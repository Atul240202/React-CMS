import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImagePopupComponent from '../components/ImagePopupComponent';
import PopupForm from '../components/PopupForm';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            ...(locationData.internalImages || []).map((img) => ({
              src: img.url,
              gridColumn: img.ratio > 1 ? 'span 2' : 'span 1',
              gridRow: img.ratio < 1 ? 'span 1' : 'span 2',
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

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/send-whatsapp-location`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        // alert('Request sent successfully!');
        closeForm();
      } else {
        // alert('Failed to send the request. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred while sending the request.');
    }
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
              className={`${isMobile ? 'h-[30vh]' : 'h-[90vh]'}`}
              loading='lazy'
            />
          </div>
          <div className='flex justify-between items-start ml-[5vw] mr-[5vw]'>
            <div
              className={`flex flex-col text-left ${isMobile ? 'w-[50%]' : ''}`}
            >
              <h2
                style={styles.locationTitle}
                className={`font-chesna ${
                  isMobile
                    ? 'text-[24px] mb-[2px] mt-[2px]'
                    : 'text-[36px] mb-[0.5rem] mt-[0.5rem]'
                }`}
              >
                {location.text.toUpperCase()}
              </h2>
              <p
                style={styles.locationAddress}
                className={`font-chesna ${
                  isMobile ? 'text-[12px] mt-0' : 'text-[24px] mt-[0.5rem]'
                }`}
              >
                {location.address.toUpperCase()}
              </p>
            </div>
            <div className={`mt-3 ${isMobile ? 'max-w-[40%]' : ''}`}>
              <button
                className={`${
                  isMobile ? 'text-md px-3 py-2' : 'text-xl px-6 py-3'
                } bg-white/10 border-0 uppercase font-chesna rounded-[0] border-white text-white  hover:bg-white/20 hover:border-white transition-all duration-300`}
                onClick={openForm}
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

          {isFormOpen && (
            <PopupForm
              onClose={closeForm}
              onSubmit={handleFormSubmit}
              locationName={location.text}
              locationAddress={location.address}
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
    // paddingTop: '8vh',
    cursor: 'pointer',
  },
  headerImage: {
    width: '100%',
    objectFit: 'cover',
  },
  locationTitle: {
    fontWeight: 'bold',
  },
  locationAddress: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: '1rem',
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
