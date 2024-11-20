import React, { useState } from 'react';

function ImagePopupComponent({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div style={styles.modal}>
      <button style={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <button style={styles.prevButton} onClick={handlePrevious}>
        &#10094;
      </button>
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        style={styles.modalImage}
      />
      <button style={styles.nextButton} onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
}

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalImage: {
    maxWidth: '80%',
    maxHeight: '80%',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '20px',
    fontSize: '30px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  prevButton: {
    position: 'absolute',
    top: '50%',
    left: '20px',
    fontSize: '40px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transform: 'translateY(-50%)',
  },
  nextButton: {
    position: 'absolute',
    top: '50%',
    right: '20px',
    fontSize: '40px',
    color: '#fff',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transform: 'translateY(-50%)',
  },
};

export default ImagePopupComponent;
