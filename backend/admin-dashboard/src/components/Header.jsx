import React, { useState } from 'react';
import { Menu, User, LogOut, X } from 'lucide-react';
import { logout } from '../firebase'; // Import the logout function
import jamMenu from '../assets/jam_menu.png';
import gopro from '../assets/gopro.png';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'
      style={{
        fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
      }}
    >
      <div className='bg-white w-full max-w-md p-6 relative'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-zinc-900 hover:text-zinc-500'
        >
          <X className='h-6 w-6' />
        </button>
        <div className='flex flex-col items-center pt-4'>
          <div className='relative mb-6'>
            <img
              loading='lazy'
              src='https://res.cloudinary.com/da3r1iagy/image/upload/v1731682579/Profile_1_rhsgml.png'
              alt='Profile'
              className='w-28 h-28 rounded-full object-cover'
            />
          </div>
          <div className='w-full space-y-4'>
            <div className='flex flex-row border border-gray-700 rounded p-3'>
              <div className='text-lg font-black text-zinc-800 pr-2'>NAME:</div>
              <div className='text-lg text-zinc-700'>JONAS KAHNWALD</div>
            </div>
            <div className='flex flex-row border border-gray-700 rounded p-3'>
              <div className='text-lg font-black text-zinc-800 pr-2'>
                MAIL ID:
              </div>
              <div className='text-lg text-zinc-700'>JONAS@GMAIL.COM</div>
            </div>
            <button className='text-blue-500 hover:text-blue-400 font-medium'>
              CHANGE PASSWORD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'
      style={{
        fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
      }}
    >
      <div className='bg-white rounded-lg w-full max-w-sm p-6 relative'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-zinc-900 hover:text-zinc-700'
        >
          <X className='h-6 w-6' />
        </button>
        <div className='flex flex-col items-center pt-4'>
          <h2 className='text-xl font-bold text-zinc-900 mb-6'>
            ARE YOU SURE YOU WANT TO LOG OUT?
          </h2>
          <button
            onClick={onLogout}
            className='w-full py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors'
          >
            LOG OUT
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const styles = {
    header: {
      color: '#0C0C0C',
    },
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout(); // Log out the user
      setShowLogoutModal(false); // Close the modal
      window.location.href = '/'; // Redirect to login or homepage
    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };

  return (
    <>
      <header
        style={styles.header}
        className='flex justify-between items-center p-4 text-white'
      >
        <button onClick={toggleSidebar} className='text-white'>
          <img loading='lazy' src={jamMenu} alt='Menu' className='h-10 w-10' />
        </button>
        <img src={gopro} alt='' className='w-1/5' />
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => setShowProfileModal(true)}
            className='text-white hover:text-gray-300 transition-colors'
          >
            <User className='h-6 w-6' />
          </button>
          <button
            onClick={() => setShowLogoutModal(true)}
            className='text-white hover:text-gray-300 transition-colors'
          >
            <LogOut className='h-6 w-6' />
          </button>
        </div>
      </header>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
