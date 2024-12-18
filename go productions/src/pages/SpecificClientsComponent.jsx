import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import StillsPageContent from '../components/StillsPageContent';
import MotionContent from '../components/MotionComponents/MotionContent';
import TransitionEffect from '../components/TransitionEffect';

export default function SpecificClientsComponent() {
  const { clientKey } = useParams();
  const location = useLocation();
  const [isStill, setIsStill] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true); // Keeps track of loading state for TransitionEffect
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false); // Controls when to show the content

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientDoc = doc(db, 'clients', clientKey);
        const clientSnapshot = await getDoc(clientDoc);

        if (clientSnapshot.exists()) {
          const data = clientSnapshot.data();
          const stillsArray = data.stills ? Object.values(data.stills) : [];
          data.stills = stillsArray;

          // Simulate loading progress
          const totalItems =
            stillsArray.length + (data.motions ? data.motions.length : 0);
          let loadedItems = 0;

          for (const item of [...stillsArray, ...(data.motions || [])]) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            loadedItems++;
            setProgress((loadedItems / totalItems) * 100);
          }

          setClientData(data);
        } else {
          setError('Client not found');
        }
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to load client data. Please try again later.');
      } finally {
        setTimeout(() => setLoading(false), 500); // Ensure the transition effect exits smoothly
      }
    };

    fetchClientData();
    window.scrollTo(0, 0);
  }, [clientKey]);

  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName={location.state?.name || 'Client'}
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && !loading && (
        <div style={styles.specClientContainer}>
          <div style={styles.specClientHeader}>
            <h2 style={styles.headerText}>
              CLIENTS {clientData?.name && ` ✦`}
            </h2>
            <img
              src={clientData?.image || '#'}
              alt={clientData?.name || ''}
              style={styles.clientLogo}
              loading='lazy'
            />
          </div>
          <div style={styles.specificClientContent}>
            <div style={styles.clientContentSections}>
              <div
                onClick={() => setIsStill(true)}
                style={{
                  ...styles.clientContentSection,
                  ...(isStill ? styles.activeTab : {}),
                }}
              >
                STILL
              </div>
              <div
                onClick={() => setIsStill(false)}
                style={{
                  ...styles.clientContentSection,
                  ...(!isStill ? styles.activeTab : {}),
                }}
              >
                MOTION
              </div>
            </div>

            <div style={styles.contentDisplay}>
              {isStill ? (
                <StillsPageContent stillPageData={clientData?.stills || []} />
              ) : (
                <MotionContent motionData={clientData?.motions || []} />
              )}
            </div>
          </div>
        </div>
      )}
      {error && <div style={styles.loadingError}>{error}</div>}
    </>
  );
}

const styles = {
  specClientContainer: {
    backgroundColor: '#000',
    color: '#fff',
    width: '90%',
    fontFamily: 'Arial, sans-serif',
    margin: 'auto',
    paddingTop: '4rem',
  },
  specClientHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '10px',
    marginBottom: '20px',
    width: '100%',
  },
  headerText: {
    fontSize: '30px',
    fontWeight: 'bold',
  },
  clientLogo: {
    height: '40px',
    objectFit: 'contain',
    marginLeft: '10px',
  },
  specificClientContent: {
    marginTop: '20px',
  },
  clientContentSections: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  clientContentSection: {
    cursor: 'pointer',
    fontSize: '20px',
    margin: '0 10px',
    color: '#ccc',
    fontWeight: 'bold',
  },
  activeTab: {
    color: '#fff',
  },
  contentDisplay: {
    marginTop: '20px',
  },
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
