import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db } from '../Firebase';
import TransitionEffect from '../components/TransitionEffect';
import '../styles/FadeInOut.css';
import '../styles/ClientsPage.css';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [hoveredLogos, setHoveredLogos] = useState({});
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Create a query to order by sequence
        const clientsQuery = query(
          collection(db, 'clients'),
          orderBy('sequence', 'asc')
        );

        // Get the ordered documents
        const clientSnapshot = await getDocs(clientsQuery);
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

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual logos
  const logoVariants = {
    hidden: {
      opacity: 0,
      y: -50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        duration: 0.6,
        bounce: 0.35,
      },
    },
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
        <div className='client-container'>
          <motion.h1
            className='client-header'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Clients
          </motion.h1>
          <motion.div
            className='logo-grid'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {clients.map((client) => (
              <motion.div
                key={client.id}
                className='logo-item'
                variants={logoVariants}
                onClick={() => navigateToClientPage(client.id)}
              >
                <img
                  src={client.image}
                  alt={client.name}
                  className={`logo-image ${
                    hoveredLogos[client.id] ? 'hovered' : ''
                  }`}
                  onMouseEnter={() => handleMouseEnter(client.id)}
                  onMouseLeave={() => handleMouseLeave(client.id)}
                  loading='lazy'
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
      {error && <div className='loading-error'>{error}</div>}
    </>
  );
}
