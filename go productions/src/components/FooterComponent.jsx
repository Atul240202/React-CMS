import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import gopro from '../assets/gopro.png';
import { color } from 'framer-motion';

const FooterComponent = () => {
  const styles = {
    footerContainer: {
      position: 'relative',
      bottom: 0,
      width: 'calc(100% - 40px)',
      backgroundColor: '#000',
      color: '#fff',
      backgroundImage:
        'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))',
      backgroundSize: '100% 1px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top',
      padding: '20px',
      '@media (maxWidth: 900px)': {
        padding: '20px 10px',
      },
    },
    logo: {
      width: '30%',
    },
    logoImage: {
      width: '100%',
    },
    footerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      maxWidth: 'calc(100% - 40px)',
      margin: '0 auto',
      '@media (maxWidth: 900px)': {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    footerHeader: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginRight: '20vh',
      marginLeft: '2.5vh',
      '@media (maxWidth: 900px)': {
        marginRight: 0,
        marginLeft: 0,
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    header1: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      '@media (maxWidth: 900px)': {
        fontSize: '1.2rem',
      },
    },
    navLinks: {
      listStyle: 'none',
      padding: 0,
      marginTop: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(1, 1fr)',
      '@media (maxWidth: 1000px)': {
        gap: '10px',
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
      marginLeft: '1%',
      width: '15vw',
    },
    navLink: {
      marginBottom: '10px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: 'white',
      fontWeight: 600,
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      marginTop: '20px',
    },
    contactIcon: {
      marginRight: '10px',
      fontSize: '1rem',
    },
    socialIcons: {
      display: 'flex',
      gap: '15px',
      fontSize: '1.2rem',
      marginBottom: '15px',
    },
    legalLinks: {
      fontSize: '0.8rem',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      paddingTop: '20vh',
      height: '100%',
      '@media (maxWidth: 900px)': {
        alignItems: 'center',
      },
    },
    footerBottom: {
      textAlign: 'center',
      fontSize: '0.8rem',
      marginTop: '20px',
      color: '#999',
    },
  };

  return (
    <div style={styles.footerContainer}>
      <footer>
        <div style={styles.footerHeader}>
          <Link to='/' style={styles.logo}>
            <img src={gopro} alt='logo' style={styles.logoImage} />
          </Link>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={styles.socialIcons}>
              <FaInstagram />
              <FaTwitter />
              <FaFacebook />
              <FaYoutube />
            </div>
          </div>
        </div>
        <div style={styles.footerContent}>
          {/* Logo and Navigation Links */}
          <div>
            <ul style={styles.navLinks}>
              <Link to='/motions' style={styles.navLink}>
                MOTIONS
              </Link>
              <Link to='/stills' style={styles.navLink}>
                STILLS
              </Link>
              <Link to='/clients' style={styles.navLink}>
                CLIENTS
              </Link>
              <Link to='/locations' style={styles.navLink}>
                LOCATIONS
              </Link>
              <Link to='/contacts' style={styles.navLink}>
                CONTACT US
              </Link>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <div style={styles.contactItem}>
              <FiMapPin style={styles.contactIcon} />
              <span>NYC, United States</span>
            </div>
            <div style={styles.contactItem}>
              <FiPhone style={styles.contactIcon} />
              <span>00011222333</span>
            </div>
            <div style={styles.contactItem}>
              <FiMail style={styles.contactIcon} />
              <span>somebody@gmail.com</span>
            </div>
          </div>

          {/* Social Media Icons and Legal Links */}
          <div style={styles.legalLinks}>
            <span>Legal and Policies</span>
            <div style={styles.footerBottom}>
              <span>&copy; 2024 Go Productions / All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterComponent;
