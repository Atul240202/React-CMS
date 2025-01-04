import React, { useState, useEffect } from 'react';
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaYoutube,
  FaBehance,
  FaLinkedin,
} from 'react-icons/fa';
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
      <div className='max-w-[95vw] mx-auto px-4 py-8'>
        {isMobile ? (
          // Mobile Layout
          <div className='flex flex-col'>
            <div className='flex justify-between items-center mb-8'>
              <Link to='/' className='w-32'>
                <img src={gopro} alt='GO PRODUCTIONS' className='w-[200px]' />
              </Link>
              <div className='flex gap-4 text-md'>
                <a
                  href='https://www.instagram.com/goproductions.in/?hl=en'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaInstagram />
                </a>
                <a
                  href='https://m.facebook.com/gostudio.in/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaFacebook />
                </a>
                <a
                  href='https://in.linkedin.com/company/goproductions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaLinkedin />
                </a>
                <a
                  href='https://www.behance.net/gostudioproductions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaBehance />
                </a>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-8 mb-8'>
              <div className='space-y-2'>
                <Link to='/motions' className='block text-sm text-white'>
                  MOTION
                </Link>
                <Link to='/stills' className='block text-sm text-white'>
                  STILL
                </Link>
              </div>
              <div className='space-y-2'>
                <Link to='/contacts' className='block text-sm text-white'>
                  CONTACT US
                </Link>
                <Link to='/locations' className='block text-sm text-white'>
                  LOCATION
                </Link>
              </div>
              <div className='space-y-2'>
                <Link to='#' className='block text-sm text-white'>
                  CAREERS
                </Link>
                <Link to='/contact' className='block text-sm text-white'>
                  CONTACT
                </Link>
              </div>
            </div>
            <div className='space-y-4 mb-8'>
              <div className='flex items-center gap-2'>
                <FiMapPin className='text-sm' />
                <span className='text-sm'>New Delhi, India</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiPhone className='text-sm' />
                <span className='text-sm'>+91-8130405967</span>
              </div>
              <div className='flex items-center gap-2'>
                <FiMail className='text-sm' />
                <span className='text-sm'>help@gostudio.in</span>
              </div>
            </div>

            <div className='border-t border-gray-800 pt-4 text-end'>
              {/* <div className='text-sm mb-2'>Legal and Policies</div> */}
              <div className='text-sm text-gray-400'>
                ©2025 Go Productions / All rights reserved
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className='flex flex-col font-ralewaylight'>
            <div className='flex justify-between items-start mb-12'>
              <Link to='/' className='w-1/4'>
                <img src={gopro} alt='logo' className='w-[300px]' />
              </Link>
              <div className='flex gap-6 text-xl'>
                <a
                  href='https://www.instagram.com/goproductions.in/?hl=en'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaInstagram />
                </a>
                <a
                  href='https://m.facebook.com/gostudio.in/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaFacebook />
                </a>
                <a
                  href='https://in.linkedin.com/company/goproductions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaLinkedin />
                </a>
                <a
                  href='https://www.behance.net/gostudioproductions'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-white'
                >
                  <FaBehance />
                </a>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-12'>
              <div>
                <div className='space-y-2 '>
                  <div>
                    <Link to='/motions' className='text-white'>
                      MOTIONS
                    </Link>
                  </div>
                  <div>
                    <Link to='/stills' className='text-white'>
                      STILLS
                    </Link>
                  </div>
                  <div>
                    <Link to='/clients' className='text-white'>
                      CLIENTS
                    </Link>
                  </div>
                  <div>
                    <Link to='/locations' className='text-white'>
                      LOCATIONS
                    </Link>
                  </div>
                  <div>
                    <Link to='/contacts' className='text-white'>
                      CONTACT US
                    </Link>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='flex items-center gap-3'>
                  <FiMapPin className='text-lg' />
                  <span>New Delhi, India</span>
                </div>
                <div className='flex items-center gap-3 '>
                  <FiPhone className='text-lg' />
                  <span>+91-8130405967</span>
                </div>
                <div className='flex items-center gap-3 '>
                  <FiMail className='text-lg' />
                  <span>help@gostudio.in</span>
                </div>
              </div>

              <div className='flex flex-col justify-end'>
                {/* <div className='text-sm mb-4'>Legal and Policies</div> */}
                <div className='text-sm text-gray-400'>
                  ©2025 Go Productions / All rights reserved
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
