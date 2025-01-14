import React, { useState, useEffect } from 'react';
import StillsPageContent from '../components/StillsPageContent';
import StillSlider from '../components/Sliders/StillSlider';
import { db } from '../Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import TransitionEffect from '../components/TransitionEffect';
import '../styles/FadeInOut.css';

export default function Stills() {
  const [stillsData, setStillsData] = useState([]);
  const [filteredStillsData, setFilteredStillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const filterOptions = [
    'All',
    'FASHION AND LIFESTYLE',
    'ADVERTISING',
    'EDITORIAL',
  ];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchStillsData = async () => {
      try {
        const clientsQuery = query(
          collection(db, 'clients'),
          orderBy('sequence', 'asc')
        );

        const clientSnapshot = await getDocs(clientsQuery);
        const stillsArray = [];

        let processedDocs = 0;
        const totalDocs = clientSnapshot.docs.length;

        for (const doc of clientSnapshot.docs) {
          const clientData = doc.data();
          if (clientData.stills) {
            const clientStills = Array.isArray(clientData.stills)
              ? clientData.stills
              : Object.values(clientData.stills);

            const sortedStills = clientStills.sort(
              (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
            );

            for (const still of sortedStills) {
              stillsArray.push({
                id: `${doc.id}_${still.clientId || ''}`,
                clientKey: doc.id,
                clientName: clientData.name,
                clientImage: clientData.image,
                sequence: still.sequence ?? Infinity,
                ...still,
              });
            }
          }
          processedDocs++;
          setLoadingProgress((processedDocs / totalDocs) * 50);
        }

        const sortedStillsArray = stillsArray.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );

        setStillsData(sortedStillsArray);
        setFilteredStillsData(sortedStillsArray);
        await preloadImages(sortedStillsArray);
        setLoading(false);
        setTimeout(() => setShowContent(true), 1000);
      } catch (err) {
        console.error('Error fetching stills data: ', err);
        setError('Failed to load stills data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStillsData();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredStillsData(stillsData);
    } else {
      const filtered = stillsData.filter(
        (still) => still.filter && still.filter.includes(activeFilter)
      );
      setFilteredStillsData(filtered);
    }
  }, [activeFilter, stillsData]);

  const preloadImages = async (data) => {
    const imageUrls = data
      .flatMap((item) => [item.clientImage, item.image])
      .filter(Boolean);
    const totalImages = imageUrls.length;
    let loadedImages = 0;

    const loadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedImages++;
          setLoadingProgress(50 + (loadedImages / totalImages) * 50);
          resolve();
        };
        img.onerror = reject;
      });
    };

    try {
      await Promise.all(imageUrls.map(loadImage));
    } catch (error) {
      console.error('Error preloading images:', error);
    }
  };

  if (loading || error) {
    return (
      <TransitionEffect
        isLoading={loading}
        progress={loadingProgress}
        pageName='Stills'
      />
    );
  }

  return (
    <>
      <StillSlider />
      <div
        className={`flex flex-row justify-evenly my-4 ${
          isMobile ? 'space-x-2 mx-2' : 'space-x-4 max-w-[50%] ml-[12vw]'
        }`}
      >
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`relative focus:outline-none border-0 bg-black text-white ${
              activeFilter === option
                ? 'border-b-2 border-white'
                : 'border-b-2 border-transparent group'
            } ${
              isMobile
                ? 'text-md px-2 py-1 font-raleway'
                : 'font-raleway text-xl px-4 py-2'
            }`}
            onClick={() => setActiveFilter(option)}
          >
            {option}
            {activeFilter !== option && (
              <span
                className={`absolute left-1/2 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 ease-in-out group-hover:w-full group-hover:left-0`}
              ></span>
            )}
          </button>
        ))}
      </div>

      {showContent && <StillsPageContent stillsData={filteredStillsData} />}
    </>
  );
}
