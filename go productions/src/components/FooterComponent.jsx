import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import gopro from '../assets/gopro.png';
const FooterComponent = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer
      className='bg-black text-white w-full'
      style={styles.footerContainer}
    >
      <div className='max-w-screen-2xl mx-auto px-4 py-8'>
        {isMobile ? (
          // Mobile Layout
          <div className='flex flex-col font-chesna'>
            <div className='flex justify-between items-center mb-8'>
              <Link to='/' className='w-32'>
                <img src={gopro} alt='GO PRODUCTIONS' className='w-[200px]' />
              </Link>
              <div className='flex gap-4 text-xl'>
                <FaInstagram />
                <FaTwitter />
                <FaFacebook />
                <FaYoutube />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-8 mb-8'>
              <div className='space-y-2'>
                <Link to='/motions' className='block font-semibold text-white'>
                  MOTION
                </Link>
                <Link to='/stills' className='block font-semibold text-white'>
                  STILL
                </Link>
              </div>
              <div className='space-y-2'>
                <Link to='/contacts' className='block font-semibold text-white'>
                  CONTACT US
                </Link>
                <Link
                  to='/locations'
                  className='block font-semibold text-white'
                >
                  LOCATION
                </Link>
              </div>
              <div className='space-y-2'>
                <Link to='#' className='block font-semibold text-white'>
                  CAREERS
                </Link>
                <Link to='/contact' className='block font-semibold text-white'>
                  CONTACT
                </Link>
              </div>
            </div>
            <div className='space-y-4 mb-8'>
              <div className='flex items-center gap-2'>
                <FiMapPin className='text-sm' />
                <span className='text-sm'>NYC, United States</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiPhone className='text-sm' />
                <span className='text-sm'>000111222333</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiMail className='text-sm' />
                <span className='text-sm'>somebody@gmail.com</span>
              </div>
            </div>

            <div className='border-t border-gray-800 pt-4 text-end'>
              <div className='text-sm mb-2'>Legal and Policies</div>
              <div className='text-sm text-gray-400'>
                ©2024 Go Productions / All rights reserved
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className='flex flex-col font-chesna'>
            <div className='flex justify-between items-start mb-12'>
              <Link to='/' className='w-1/4'>
                <img src={gopro} alt='logo' className='w-[400px]' />
              </Link>
              <div className='flex gap-6 text-2xl'>
                <FaInstagram />
                <FaTwitter />
                <FaFacebook />
                <FaYoutube />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-12'>
              <div>
                <div className='space-y-2 '>
                  <div>
                    <Link to='/motions' className='font-semibold text-white'>
                      MOTIONS
                    </Link>
                  </div>
                  <div>
                    <Link to='/stills' className='font-semibold text-white'>
                      STILLS
                    </Link>
                  </div>
                  <div>
                    <Link to='/clients' className='font-semibold text-white'>
                      CLIENTS
                    </Link>
                  </div>
                  <div>
                    <Link to='/locations' className='font-semibold text-white'>
                      LOCATIONS
                    </Link>
                  </div>
                  <div>
                    <Link to='/contacts' className='font-semibold text-white'>
                      CONTACT US
                    </Link>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='flex items-center gap-3'>
                  <FiMapPin className='text-xl' />
                  <span>Faridabad, United Pradesh</span>
                </div>
                <div className='flex items-center gap-3 font-sans font-extrabold'>
                  <FiPhone className='text-xl' />
                  <span>+91 9876543210</span>
                </div>
                <div className='flex items-center gap-3 font-sans font-extrabold'>
                  <FiMail className='text-xl' />
                  <span>somebody@gmail.com</span>
                </div>
              </div>

              <div className='flex flex-col justify-end'>
                <div className='text-sm mb-4'>Legal and Policies</div>
                <div className='text-sm text-gray-400 font-sans font-extrabold'>
                  ©2024 Go Productions / All rights reserved
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

const styles = {
  footerContainer: {
    backgroundColor: '#000',
    color: '#fff',
    backgroundImage:
      'linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2))',
    backgroundSize: '100% 1px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top',
  },
};

export default FooterComponent;
