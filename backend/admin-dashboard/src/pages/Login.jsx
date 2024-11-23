import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      // After successful login, redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const element = document.querySelector('.sliding-text');
      if (element) {
        element.style.transform = 'translateX(0)';
        setTimeout(() => {
          element.style.transition = 'none';
          element.style.transform = 'translateX(100%)';
          setTimeout(() => {
            element.style.transition = 'transform 20s linear';
          }, 50);
        }, 20000);
      }
    }, 20050);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex h-screen bg-black overflow-hidden'>
      <div className='flex-1 flex flex-col justify-center px-8 relative'>
        <h1 className='text-5xl font-bold text-white mb-12'>Welcome Back</h1>
        <div className='backdrop-blur-md bg-white/10 rounded-3xl p-8 max-w-md relative z-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-400 mb-1'
              >
                MAIL ID
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                placeholder='Enter your email'
                required
              />
            </div>
            <div className='relative'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-400 mb-1'
              >
                Password
              </label>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                placeholder='Enter your password'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-8 text-gray-400'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className='flex items-center'>
              <input
                id='keep-logged-in'
                type='checkbox'
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <label
                htmlFor='keep-logged-in'
                className='ml-2 block text-sm text-gray-400'
              >
                Keep me logged in
              </label>
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <button
              type='submit'
              className='w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Sign in
            </button>
          </form>
        </div>
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div
            className='sliding-text absolute bottom-0 left-0 right-0 whitespace-nowrap text-[20rem] font-bold text-gray-800 opacity-5'
            style={{
              transform: 'translateX(100%)',
              transition: 'transform 20s linear',
            }}
          >
            GO PRODUCTIONS GO PRODUCTIONS GO PRODUCTIONS
          </div>
        </div>
      </div>
      <div className='hidden lg:block lg:w-1/2 p-8'>
        <img
          className='h-full w-full object-cover rounded-3xl'
          src='https://res.cloudinary.com/da3r1iagy/image/upload/v1730482611/Frame_1000003530_oncgbk.png'
          alt='Couple on beach'
          loading='lazy'
        />
      </div>
    </div>
  );
}
