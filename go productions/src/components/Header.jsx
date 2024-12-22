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
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <style>
        {`
          @keyframes rubberBand {
            from { transform: scale3d(1, 1, 1); }
            30% { transform: scale3d(1.25, 0.75, 1); }
            40% { transform: scale3d(0.75, 1.25, 1); }
            50% { transform: scale3d(1.15, 0.85, 1); }
            65% { transform: scale3d(0.95, 1.05, 1); }
            75% { transform: scale3d(1.05, 0.95, 1); }
            to { transform: scale3d(1, 1, 1); }
          }

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
            color: white;
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
        `}
      </style>
      <header className='fixed top-0 flex justify-between items-center w-screen h-[5vh] p-[18px] bg-[#0c0c0c] z-[999]'>
        <Link
          to='/'
          className={`z-[1001] ml-[1%]  ${isMobile ? 'w-[50%]' : 'w-[30%]'}`}
        >
          <img src={gopro} alt='logo' className='w-full' />
        </Link>

        {isMobile ? (
          <>
            <button
              onClick={toggleMenu}
              className='flex md:hidden flex-col justify-around w-8 h-8 bg-transparent border-none cursor-pointer p-0 z-[1001] mr-8 focus:outline-none'
            >
              <div
                className={`w-8 h-1 bg-white rounded-[10px] transition-all duration-300 origin-[1px] ${
                  isMenuOpen ? 'rotate-45' : 'rotate-0'
                }`}
              />
              <div
                className={`w-8 h-1 bg-white rounded-[10px] transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <div
                className={`w-8 h-1 bg-white rounded-[10px] transition-all duration-300 origin-[1px] ${
                  isMenuOpen ? '-rotate-45' : 'rotate-0'
                }`}
              />
            </button>

            <nav
              className={`flex md:hidden flex-col justify-center items-center fixed top-0 left-0 h-screen w-screen bg-opacity-90 backdrop-blur-lg transition-all duration-300 z-[1000] ${
                isMenuOpen
                  ? 'translate-x-0 opacity-100 bg-[#0c0c0c]'
                  : 'translate-x-full opacity-0 bg-transparent'
              }`}
            >
              {['MOTIONS', 'STILLS', 'LOCATIONS', 'CLIENTS', 'CONTACT'].map(
                (item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase().replace(' ', 's')}`}
                    className='mobile-nav-link text-2xl text-white my-8 font-bold tracking-[0.5rem] transition-all duration-300'
                    data-hover={item}
                    onClick={closeMenu}
                  >
                    <span>{item}</span>
                  </Link>
                )
              )}
            </nav>
          </>
        ) : (
          <nav className='hidden md:flex items-center gap-5 mr-[5%]'>
            {['MOTIONS', 'STILLS', 'LOCATIONS', 'CLIENTS', 'CONTACT'].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className='nav-link ml-5 text-white text-lg font-semibold relative overflow-hidden inline-block transition-colors duration-300'
                  data-hover={item}
                >
                  <span>{item}</span>
                </Link>
              )
            )}
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
