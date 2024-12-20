import React, { useState, useEffect } from 'react';
import '../styles/ClientLogo.css';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';

const ClientLogo = () => {
  const [clientLogos, setClientLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className={`slider ${isMobile ? 'h-auto mb-[5vh]' : 'h-[20vh]'}`}>
      <div className='slide-track'>
        {displayLogos.map((logo, index) => (
          <div key={`${logo.id}-${index}`} className='slide'>
            <img
              src={logo.image}
              className={`${
                isMobile ? 'h-[50px] w-[150px]' : 'h-[100px] w-[300px]'
              }`}
              // height='50'
              // width='150'
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
