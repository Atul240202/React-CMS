import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gopro from '../assets/gopro.png';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Add/remove body scroll when menu is open/closed
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 'calc(100% - 36px)',
      height: '5vh',
      padding: '18px',
      background: '#0c0c0c',
      backdropFilter: 'blur(19.9px)',
      zIndex: 1000,
    },
    logo: {
      zIndex: 1001,
      marginLeft: '1%',
      width: '30%',
    },
    logoImage: {
      width: '100%',
    },

    navbar: {
      display: isMobile ? 'none' : 'flex',
      alignItems: 'center',
      gap: '20px',
      marginRight: '3%',
    },
    navLink: {
      marginLeft: '20px',
      textDecoration: 'none',
      color: 'white',
      fontSize: '18px',
      fontWeight: 600,
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
      transition: 'color 0.3s ease',
    },
    hamburger: {
      display: isMobile ? 'flex' : 'none',
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '2rem',
      height: '2rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      zIndex: 1001, // Ensure hamburger stays above mobile menu
      outline: 'none', // Remove focus border
    },
    hamburgerLine: {
      width: '2rem',
      height: '0.25rem',
      background: 'white',
      borderRadius: '10px',
      transition: 'all 0.3s linear',
      position: 'relative',
      transformOrigin: '1px',
    },
    mobileMenu: {
      display: isMobile ? 'flex' : 'none',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      background: 'rgba(12, 12, 12, 0)', // Start transparent
      backdropFilter: 'blur(0px)', // Start with no blur
      transition: 'all 0.3s ease-in-out',
      transform: 'translateX(100%)',
      opacity: 0,
      zIndex: 1000,
    },
    mobileMenuOpen: {
      transform: 'translateX(0)',
      background: 'rgba(12, 12, 12, 0.9)', // End with semi-transparent background
      backdropFilter: 'blur(10px)', // End with blur
      opacity: 2,
    },
    mobileNavLink: {
      fontSize: '1.5rem',
      textDecoration: 'none',
      color: 'white',
      margin: '2rem 0',
      fontWeight: 'bold',
      letterSpacing: '0.5rem',
      transition: 'color 0.3s linear, transform 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-block',
    },
  };

  const hoverStyles = `
    @keyframes rubberBand {
      from { transform: scale3d(1, 1, 1); }
      30% { transform: scale3d(1.25, 0.75, 1); }
      40% { transform: scale3d(0.75, 1.25, 1); }
      50% { transform: scale3d(1.15, 0.85, 1); }
      65% { transform: scale3d(0.95, 1.05, 1); }
      75% { transform: scale3d(1.05, 0.95, 1); }
      to { transform: scale3d(1, 1, 1); }
    }

    /* Common styles for both desktop and mobile nav links */
    .nav-link, .mobile-nav-link {
      position: relative;
      overflow: hidden;
      display: inline-block;
      text-align: center;
    }

    .nav-link span, .mobile-nav-link span {
      display: inline-block;
      transition: transform 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .nav-link:after, .mobile-nav-link:after {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      content: attr(data-hover);
      text-align: center;
      transition: top 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .nav-link:hover, .mobile-nav-link:hover {
      color: #cc8e35;
    }

    .nav-link:hover span, .mobile-nav-link:hover span {
      transform: translateY(-100%);
    }

    .nav-link:hover:after, .mobile-nav-link:hover:after {
      top: 0;
    }

    .nav-link:active, .mobile-nav-link:active {
      animation: rubberBand 1s;
    }

    /* Remove focus outline from hamburger button */
    button:focus {
      outline: none;
    }
  `;

  return (
    <>
      <style>{hoverStyles}</style>
      <header style={styles.header}>
        <Link to='/' style={styles.logo}>
          <img src={gopro} alt='logo' style={styles.logoImage} />
        </Link>
        {isMobile ? (
          <>
            <button onClick={toggleMenu} style={styles.hamburger}>
              <div
                style={{
                  ...styles.hamburgerLine,
                  transform: isMenuOpen ? 'rotate(45deg)' : 'rotate(0)',
                }}
              />
              <div
                style={{
                  ...styles.hamburgerLine,
                  opacity: isMenuOpen ? '0' : '1',
                }}
              />
              <div
                style={{
                  ...styles.hamburgerLine,
                  transform: isMenuOpen ? 'rotate(-45deg)' : 'rotate(0)',
                }}
              />
            </button>
            <nav
              style={{
                ...styles.mobileMenu,
                ...(isMenuOpen ? styles.mobileMenuOpen : {}),
              }}
            >
              <Link
                to='/motions'
                style={styles.mobileNavLink}
                className='mobile-nav-link'
                data-hover='MOTION'
                onClick={closeMenu}
              >
                <span>MOTION</span>
              </Link>
              <Link
                to='/stills'
                style={styles.mobileNavLink}
                className='mobile-nav-link'
                data-hover='STILL'
                onClick={closeMenu}
              >
                <span>STILL</span>
              </Link>
              <Link
                to='/locations'
                style={styles.mobileNavLink}
                className='mobile-nav-link'
                data-hover='LOCATION'
                onClick={closeMenu}
              >
                <span>LOCATION</span>
              </Link>
              <Link
                to='/clients'
                style={styles.mobileNavLink}
                className='mobile-nav-link'
                data-hover='CLIENT'
                onClick={closeMenu}
              >
                <span>CLIENT</span>
              </Link>
              <Link
                to='/contacts'
                style={styles.mobileNavLink}
                className='mobile-nav-link'
                data-hover='CONTACT US'
                onClick={closeMenu}
              >
                <span>CONTACT US</span>
              </Link>
            </nav>
          </>
        ) : (
          <nav style={styles.navbar}>
            <Link
              to='/motions'
              style={styles.navLink}
              className='nav-link'
              data-hover='MOTION'
            >
              <span>MOTION</span>
            </Link>
            <Link
              to='/stills'
              style={styles.navLink}
              className='nav-link'
              data-hover='STILL'
            >
              <span>STILL</span>
            </Link>
            <Link
              to='/locations'
              style={styles.navLink}
              className='nav-link'
              data-hover='LOCATION'
            >
              <span>LOCATION</span>
            </Link>
            <Link
              to='/clients'
              style={styles.navLink}
              className='nav-link'
              data-hover='CLIENT'
            >
              <span>CLIENT</span>
            </Link>
            <Link
              to='/contacts'
              style={styles.navLink}
              className='nav-link'
              data-hover='CONTACT US'
            >
              <span>CONTACT US</span>
            </Link>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
