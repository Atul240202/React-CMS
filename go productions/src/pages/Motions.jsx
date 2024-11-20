import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';
import MotionSlider from '../components/Sliders/MotionSlider';
import MotionContent from '../components/MotionComponents/MotionContent';
import TransitionEffect from '../components/TransitionEffect';

export default function Motions() {
  const [motionData, setMotionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchMotionData = async () => {
      try {
        const clientsCollection = collection(db, 'clients');
        const clientSnapshot = await getDocs(clientsCollection);
        const motionList = [];
        let processedDocs = 0;

        clientSnapshot.forEach((doc) => {
          const clientData = doc.data();
          if (clientData.motions) {
            const clientMotions = Array.isArray(clientData.motions)
              ? clientData.motions
              : [clientData.motions];

            clientMotions.forEach((motion) => {
              motionList.push({
                id: `${doc.id}_${motion.clientId || ''}`,
                clientKey: doc.id,
                clientName: clientData.name,
                clientImage: clientData.image,
                ...motion,
              });
            });
          }
          processedDocs++;
          setProgress((processedDocs / clientSnapshot.size) * 100);
        });

        setMotionData(motionList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching motion data: ', err);
        setError('Failed to load motion data. Please try again later.');
        setLoading(false);
      }
    };

    fetchMotionData();
  }, []);

  const handleTransitionComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName='Motion'
        onTransitionComplete={handleTransitionComplete}
      />
      {showContent && (
        <>
          <MotionSlider />
          <MotionContent motionData={motionData} />
        </>
      )}
      {error && <div style={styles.loadingError}>{error}</div>}
    </>
  );
}

const styles = {
  loadingError: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};
