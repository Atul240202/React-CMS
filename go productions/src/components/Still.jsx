import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Firebase';
import '../styles/Still.css';

const Still = () => {
  const [stillImages, setStillImages] = useState([]);
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
    const fetchHomeStills = async () => {
      try {
        const homeStillsQuery = query(
          collection(db, 'homeStills'),
          orderBy('rowOrder', 'asc')
        );
        const querySnapshot = await getDocs(homeStillsQuery);
        const stills = [];
        querySnapshot.forEach((doc) => {
          stills.push(doc.data());
        });
        setStillImages(stills);
      } catch (error) {
        console.error('Error fetching home stills:', error);
      }
    };

    fetchHomeStills();
  }, []);

  const arrangeStills = () => {
    if (isMobile) {
      if (stillImages.length === 2 || stillImages.length === 6) {
        return stillImages.map((still) => [still]);
      } else {
        const rows = [];
        for (let i = 0; i < stillImages.length; i += 3) {
          rows.push([stillImages[i]]);
          if (i + 1 < stillImages.length && i + 2 < stillImages.length) {
            rows.push([stillImages[i + 1], stillImages[i + 2]]);
          }
        }
        return rows;
      }
    } else {
      // Desktop layout remains the same
      const rows = [];
      let currentRow = [];
      let isLandscapeFirst = true;

      stillImages.forEach((still) => {
        if (currentRow.length === 2) {
          rows.push(currentRow);
          currentRow = [];
          isLandscapeFirst = !isLandscapeFirst;
        }

        if (currentRow.length === 0) {
          if (isLandscapeFirst) {
            currentRow.push(still.isPortrait ? null : still);
          } else {
            currentRow.push(still.isPortrait ? still : null);
          }
        } else {
          if (isLandscapeFirst) {
            currentRow.push(still.isPortrait ? still : null);
          } else {
            currentRow.push(still.isPortrait ? null : still);
          }
        }

        if (currentRow[0] === null) {
          currentRow[0] = still;
        } else if (currentRow[1] === null) {
          currentRow[1] = still;
        }
      });

      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      return rows;
    }
  };

  const stillRows = arrangeStills();

  return (
    <section className='still-section'>
      <div className='still-header'>
        <div>
          <h2 className='font-chesna'>STILL</h2>
          <p>YOUR VISION, OUR EXPERTISE</p>
        </div>
        <a href='https://react-cms-ygwg.vercel.app/stills' className='see-more'>
          SEE MORE
        </a>
      </div>

      {stillRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`still-images ${isMobile ? 'mobile' : ''}`}
        >
          {row.map((still, index) => {
            if (!still) return null;

            const isLarge = isMobile
              ? row.length === 1
              : (rowIndex % 2 === 0 && index === 0) ||
                (rowIndex % 2 !== 0 && index !== 0);

            return (
              <div
                key={still.clientId}
                className={`image-container ${isLarge ? 'large' : 'small'}`}
              >
                <a href={still.urlForSpecificStillPage}>
                  <img
                    src={still.image}
                    alt={still.productTitle}
                    className='main-image'
                    loading='lazy'
                  />
                  {!isMobile && (
                    <div className='overlay'>
                      <img
                        src={still.logo}
                        alt={`${still.clientName} Logo`}
                        className={`logo ${
                          isLarge ? 'top-center' : 'left-center'
                        }`}
                        loading='lazy'
                      />
                      <p
                        className={`hover-text ${
                          isLarge ? 'bottom-center' : 'right-center'
                        }`}
                      >
                        {still.productTitle}
                      </p>
                    </div>
                  )}
                </a>
                {isMobile && (
                  <div className='mobile-overlay'>
                    <img
                      src={still.logo}
                      alt={`${still.clientName} Logo`}
                      className='logo mobile'
                      loading='lazy'
                    />
                    <p className='hover-text mobile'>{still.productTitle}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
};

export default Still;
