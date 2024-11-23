import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sendPasswordReset } from '../firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await sendPasswordReset(email);
      setStatus({
        type: 'success',
        message: 'Password reset link has been sent to your email address.',
      });
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Handle specific Firebase error codes
      let errorMessage = 'Failed to send reset email.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex h-screen bg-black overflow-hidden'>
      <div className='flex-1 flex flex-col justify-center px-8 relative'>
        <Link
          to='/login'
          className='absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2'
        >
          <ArrowLeft size={20} />
          Back to Login
        </Link>

        <h1 className='text-5xl font-bold text-white mb-4'>Reset Password</h1>
        <p className='text-gray-400 mb-8'>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <div className='backdrop-blur-md bg-white/10 rounded-3xl p-8 max-w-md relative z-10'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-400 mb-1'
              >
                EMAIL ADDRESS
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                placeholder='Enter your email'
                required
                disabled={isSubmitting}
              />
            </div>

            {status.message && (
              <div
                className={`text-sm ${
                  status.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type='submit'
              className='w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
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
