import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MotionContent = ({ motionData }) => {
  const navigate = useNavigate();
  const [visibleItems, setVisibleItems] = useState({});

  const itemsRef = useRef([]);

  const handleClick = (motion) => {
    navigate(`/motions/${motion.id}`, { state: { motion } });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prevVisibleItems) => ({
              ...prevVisibleItems,
              [entry.target.dataset.id]: true,
            }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  if (!motionData || motionData.length === 0) {
    return <div style={styles.noData}>No motion data available</div>;
  }

  return (
    <div style={styles.motionContentContainer}>
      {motionData.map((motion, index) => (
        <div
          key={motion.id}
          style={styles.motionContentItem}
          data-id={motion.id}
          className={visibleItems[motion.id] ? 'animate' : ''}
          ref={(el) => (itemsRef.current[index] = el)}
        >
          <div style={styles.videoContainer} className='video-container'>
            <video
              style={styles.motionVideo}
              src={motion.video}
              muted
              loop
              onClick={() => handleClick(motion)}
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
          </div>
          <div
            style={styles.textAndLogoContainer}
            onClick={() => handleClick(motion)}
          >
            <img
              src={motion.logo || motion.clientImage}
              alt='Logo'
              style={styles.motionLogo}
              className='logo'
              loading='lazy'
            />
            <h2 style={styles.videoText} className='video-text'>
              {motion.text}
            </h2>
            <div className='border-top'></div>
          </div>
        </div>
      ))}
      <style jsx>{`
        .animate .video-container {
          animation: expandVideo 1s ease-out forwards;
        }
        .animate .video-text {
          animation: slideTextFromBehind 1s ease-out forwards;
        }
        .animate .logo {
          animation: slideLogoFromRight 1s ease-out forwards;
        }
        .animate .border-top {
          animation: expandBorderFromLeft 1s ease-out forwards;
        }

        @keyframes expandVideo {
          from {
            transform: scale(0.5);
            transform-origin: bottom left;
          }
          to {
            transform: scale(1);
            transform-origin: bottom left;
          }
        }

        @keyframes slideTextFromBehind {
          0% {
            transform: translateX(-120%);
            opacity: 0;
          }
          70% {
            transform: translateX(20%);
            opacity: 1;
          }
          100% {
            transform: translateX(10%);
          }
        }

        @keyframes slideLogoFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes expandBorderFromLeft {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        .border-top {
          position: absolute;
          top: 0;
          left: 0;
          height: 1px;
          background-color: #fff;
          width: 0;
        }

        .video-container,
        .video-text,
        .logo {
          opacity: 0;
        }

        .animate .video-container,
        .animate .video-text,
        .animate .logo {
          opacity: 1;
        }

        /* Responsive styles */
        @media (max-width: 1024px) {
          .video-text {
            font-size: 2.5rem;
          }
          .logo {
            max-width: 180px;
          }
          .motionContentItem {
            padding-bottom: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .video-text {
            font-size: 2rem;
          }
          .logo {
            max-width: 140px;
          }
          .motionContentItem {
            padding-bottom: 1rem;
            flex-direction: column;
            align-items: center;
          }
          .video-container {
            max-width: 100%;
            padding-right: 0;
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 480px) {
          .video-text {
            font-size: 1.5rem;
          }
          .logo {
            max-width: 100px;
          }
          .motionContentContainer {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  motionContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '85rem',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#000',
  },
  motionContentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: '2rem',
    color: '#fff',
    position: 'relative',
    marginBottom: '2rem',
  },
  videoContainer: {
    flex: 1,
    maxWidth: '40%',
  },
  motionVideo: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    marginTop: '-1px',
  },
  textAndLogoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: '100%',
    height: '100%',
    position: 'relative',
  },
  motionLogo: {
    alignSelf: 'flex-end',
    marginBottom: 'auto',
    maxWidth: '220px',
    height: 'auto',
  },
  videoText: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
    paddingTop: '21%',
    margin: 0,
  },
  noData: {
    color: '#fff',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};

export default MotionContent;
