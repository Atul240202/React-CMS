import React, { useState, useEffect } from 'react';
import { Menu, User, LogOut, X } from 'lucide-react';
import { logout, auth, db } from '../firebase'; // Import the logout function
import jamMenu from '../assets/jam_menu.png';
import gopro from '../assets/gopro.png';
import { doc, getDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';

const ProfileModal = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Fetch additional user data if stored in Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        const additionalData = docSnap.exists() ? docSnap.data() : {};
        setUserData({
          name: additionalData.name || 'Go Productions',
          email: user.email,
          profileImage:
            additionalData.profileImage ||
            'https://res.cloudinary.com/da3r1iagy/image/upload/v1732738850/WhatsApp_Image_2024-11-28_at_1.50.16_AM_lolf0g.jpg',
        });
      }
    };

    fetchUserData();
  }, [isOpen]);

  const handlePasswordChange = async () => {
    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    try {
      await updatePassword(auth.currentUser, newPassword);
      setPasswordSuccess('Password updated successfully.');
      setPasswordError('');
    } catch (error) {
      setPasswordError(error.message);
      setPasswordSuccess('');
    }
  };

  if (!isOpen || !userData) return null;

  return (
    <div
      className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'
      style={{
        fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
      }}
    >
      <div className='bg-zinc-900 w-full max-w-md p-6 relative'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-white hover:text-zinc-500'
        >
          X {/* Replace with your close icon component */}
        </button>
        <div className='flex flex-col items-center pt-4'>
          <div className='relative mb-6'>
            <img
              loading='lazy'
              src={userData.profileImage}
              alt='Profile'
              className='w-28 h-28 rounded-full object-cover'
            />
          </div>
          <div className='w-full space-y-4'>
            <div className='flex flex-row border text-white rounded p-3'>
              <div className='text-lg font-black text-white pr-2'>NAME:</div>
              <div className='text-lg text-white'>{userData.name}</div>
            </div>
            <div className='flex flex-row border text-white rounded p-3'>
              <div className='text-lg font-black text-white pr-2'>MAIL ID:</div>
              <div className='text-lg text-white'>{userData.email}</div>
            </div>
            {/* <div className='space-y-2'>
              <input
                type='password'
                placeholder='Enter new password'
                className='w-full p-2 border border-gray-300 rounded-md'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={handlePasswordChange}
                className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'
              >
                Change Password
              </button>
              {passwordError && (
                <p className='text-red-500 text-sm'>{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className='text-green-500 text-sm'>{passwordSuccess}</p>
              )}
            </div> */}
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
      <div className='bg-zinc-900 rounded-lg w-full max-w-sm p-6 relative'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 text-white hover:text-zinc-700'
        >
          <X className='h-6 w-6' />
        </button>
        <div className='flex flex-col items-center pt-4'>
          <h2 className='text-xl font-bold text-white mb-6'>
            ARE YOU SURE YOU WANT TO LOG OUT?
          </h2>
          <button
            onClick={onLogout}
            className='w-full py-3 bg-zinc-800 border border-white rounded-lg text-white hover:bg-gray-700 transition-colors'
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
        className='flex justify-between items-center p-2 text-white'
      >
        <button onClick={toggleSidebar} className='text-white pl-2'>
          <img loading='lazy' src={jamMenu} alt='Menu' className='h-10 w-10' />
        </button>
        <img src={gopro} alt='' className='w-1/4' />
        <div className='flex items-center space-x-4 pr-4'>
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
      <hr className='h-px bg-gradient-to-l from-white to-transparent border-none' />
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
