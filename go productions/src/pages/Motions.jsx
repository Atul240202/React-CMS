import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';
import MotionSlider from '../components/Sliders/MotionSlider';
import MotionContent from '../components/MotionComponents/MotionContent';
import TransitionEffect from '../components/TransitionEffect';

export default function Motions() {
  const [motionData, setMotionData] = useState([]);
  const [filteredMotionData, setFilteredMotionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const filterOptions = [
    'All',
    'FASHION AND LIFESTYLE',
    'ADVERTISING',
    'DIGITAL',
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
    const fetchMotionData = async () => {
      try {
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

            const sortedMotions = clientMotions.sort(
              (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
            );

            sortedMotions.forEach((motion) => {
              motionList.push({
                id: `${doc.id}_${motion.clientId || ''}`,
                clientKey: doc.id,
                clientName: clientData.name,
                clientImage: clientData.image,
                sequence: motion.sequence ?? Infinity,
                ...motion,
              });
            });
          }
          processedDocs++;
          setProgress((processedDocs / clientSnapshot.size) * 100);
        });

        const sortedMotionList = motionList.sort(
          (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity)
        );

        setMotionData(sortedMotionList);
        setFilteredMotionData(sortedMotionList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching motion data: ', err);
        setError('Failed to load motion data. Please try again later.');
        setLoading(false);
      }
    };

    fetchMotionData();
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredMotionData(motionData);
    } else {
      const filtered = motionData.filter(
        (motion) => motion.filter && motion.filter.includes(activeFilter)
      );
      setFilteredMotionData(filtered);
    }
  }, [activeFilter, motionData]);

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
          <div
            className={`flex flex-row justify-evenly my-4 font-raleway ${
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
                    ? 'text-md px-2 py-1 font-raleway font-medium'
                    : 'font-raleway font-medium text-xl px-4 py-2'
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

          <MotionContent motionData={filteredMotionData} />
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
