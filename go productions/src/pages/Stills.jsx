import React, { useState, useEffect } from 'react';
import StillsPageContent from '../components/StillsPageContent';
import StillSlider from '../components/Sliders/StillSlider';
import { db } from '../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import TransitionEffect from '../components/TransitionEffect';
import '../styles/FadeInOut.css';

export default function Stills() {
  const [stillsData, setStillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchStillsData = async () => {
      try {
        const clientsCollection = collection(db, 'clients');
        const clientSnapshot = await getDocs(clientsCollection);
        const stillsArray = [];

        let processedDocs = 0;
        const totalDocs = clientSnapshot.docs.length;

        for (const doc of clientSnapshot.docs) {
          const clientData = doc.data();
          if (clientData.stills) {
            const clientStills = Array.isArray(clientData.stills)
              ? clientData.stills
              : Object.values(clientData.stills);

            for (const still of clientStills) {
              stillsArray.push({
                id: `${doc.id}_${still.clientId || ''}`,
                clientKey: doc.id,
                clientName: clientData.name,
                clientImage: clientData.image,
                ...still,
              });
            }
          }
          processedDocs++;
          setLoadingProgress((processedDocs / totalDocs) * 50);
        }

        setStillsData(stillsArray);
        await preloadImages(stillsArray);
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
      {showContent && <StillsPageContent stillPageData={stillsData} />}
    </>
  );
}
