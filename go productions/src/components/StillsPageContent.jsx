import React from 'react';
import { useNavigate } from 'react-router-dom';

const StillsPageContent = ({ stillPageData }) => {
  const navigate = useNavigate();

  const handleClick = (still) => {
    navigate(`/stills/${still.clientKey}/${still.id}`, { state: { still } });
  };

  if (!Array.isArray(stillPageData) || stillPageData.length === 0) {
    return <div style={styles.noData}>No stills available.</div>;
  }

  return (
    <div style={styles.container}>
      {stillPageData.map((item, index) => (
        <div
          key={item.id || index}
          style={{
            ...styles.itemContainer,
            flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
          }}
        >
          <div style={styles.imageContainer}>
            <img
              src={item.image}
              alt={item.text}
              style={styles.image}
              onClick={() => handleClick(item)}
              loading='lazy'
            />
            <div style={styles.textContainer}>
              <h2 style={styles.text}>{item.text}</h2>
              <img
                src={item.logo || item.clientImage}
                alt='Logo'
                style={styles.logo}
                loading='lazy'
              />
            </div>
          </div>
          <div style={styles.blankContainer}></div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#000',
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '85rem',
    height: '80vh',
    marginBottom: '2rem',
  },
  imageContainer: {
    flex: '2',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '70vh',
    objectFit: 'cover',
    cursor: 'pointer',
  },
  textContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  blankContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '1rem',
  },
  logo: {
    width: '150px',
    height: 'auto',
  },
  noData: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};

export default StillsPageContent;
