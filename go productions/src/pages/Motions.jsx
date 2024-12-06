import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
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
        // Create a query to order clients by sequence
        const clientsQuery = query(
          collection(db, 'clients'),
          orderBy('sequence', 'asc')
        );

        const clientSnapshot = await getDocs(clientsQuery);
        const motionList = [];
        let processedDocs = 0;

        clientSnapshot.forEach((doc) => {
          const clientData = doc.data();
          if (clientData.motions) {
            const clientMotions = Array.isArray(clientData.motions)
              ? clientData.motions
              : [clientData.motions];

            // Sort motions by sequence if it exists
            const sortedMotions = clientMotions.sort(
              (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
            );

            sortedMotions.forEach((motion) => {
              motionList.push({
                id: `${doc.id}_${motion.clientId || ''}`,
                clientKey: doc.id,
                clientName: clientData.name,
                clientImage: clientData.image,
                sequence: motion.sequence ?? Infinity, // Add sequence to the final object
                ...motion,
              });
            });
          }
          processedDocs++;
          setProgress((processedDocs / clientSnapshot.size) * 100);
        });

        // Sort the final array by sequence
        const sortedMotionList = motionList.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );

        setMotionData(sortedMotionList);
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
