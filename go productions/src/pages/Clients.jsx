import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import TransitionEffect from '../components/TransitionEffect';
import { motion } from 'framer-motion';
import '../styles/FadeInOut.css';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [hoveredLogos, setHoveredLogos] = useState({});
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsCollection = collection(db, 'clients');
        const clientSnapshot = await getDocs(clientsCollection);
        const clientList = [];
        let processedDocs = 0;

        clientSnapshot.forEach((doc) => {
          clientList.push({
            id: doc.id,
            ...doc.data(),
          });
          processedDocs++;
          setProgress((processedDocs / clientSnapshot.size) * 100);
        });

        setClients(clientList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients: ', err);
        setError('Failed to load clients. Please try again later.');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleMouseEnter = (clientId) => {
    setHoveredLogos((prev) => ({ ...prev, [clientId]: true }));
  };

  const handleMouseLeave = (clientId) => {
    setHoveredLogos((prev) => ({ ...prev, [clientId]: false }));
  };

  const navigateToClientPage = (clientId) => {
    navigate(`/clients/${clientId}`);
  };

  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName='Clients'
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && (
        <div style={styles.clientContainer}>
          <h1 style={styles.clientHeader}>Clients</h1>
          <div style={styles.logoGrid}>
            {clients.map((client) => (
              <div
                key={client.id}
                style={styles.logoItem}
                onClick={() => navigateToClientPage(client.id)}
              >
                <img
                  src={client.image}
                  alt={client.name}
                  style={styles.logoImage(hoveredLogos[client.id] || false)}
                  onMouseEnter={() => handleMouseEnter(client.id)}
                  onMouseLeave={() => handleMouseLeave(client.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <div style={styles.loadingError}>{error}</div>}
    </>
  );
}

const styles = {
  clientContainer: {
    width: '90%',
    margin: '0 auto',
    padding: '12vh 0',
    textAlign: 'center',
  },
  clientHeader: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#fff',
  },
  logoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  logoItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logoImage: (isHovered) => ({
    width: '100%',
    maxWidth: '200px',
    height: 'auto',
    filter: isHovered ? 'grayscale(0%)' : 'grayscale(100%)',
    transition: 'filter 0.3s ease-in-out',
  }),
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
