import React, { useState, useEffect } from 'react';
import '../styles/ClientLogo.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';

const ClientLogo = () => {
  const [clientLogos, setClientLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        const clientLogosRef = collection(db, 'homeClients');
        const q = query(clientLogosRef, orderBy('sequence'));
        const querySnapshot = await getDocs(q);
        const fetchedLogos = [];
        querySnapshot.forEach((doc) => {
          fetchedLogos.push({ id: doc.id, ...doc.data() });
        });
        setClientLogos(fetchedLogos);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching client logos:', err);
        setError('Failed to load client logos. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchClientLogos();
  }, []);

  if (isLoading) {
    return <div className='loading'>Loading client logos...</div>;
  }

  if (error) {
    return <div className='error'>{error}</div>;
  }

  // if (clientLogos.length === 0) {
  //   return <div className='no-logos'>No client logos available</div>;
  // }

  // Duplicate the logos array to create a seamless loop
  const displayLogos = [...clientLogos, ...clientLogos];

  return (
    <div className='slider'>
      <div className='slide-track'>
        {displayLogos.map((logo, index) => (
          <div key={`${logo.id}-${index}`} className='slide'>
            <img
              src={logo.image}
              height='100'
              width='300'
              alt={`${logo.name} Logo`}
              loading='lazy'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLogo;
