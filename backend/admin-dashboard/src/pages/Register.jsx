import React, { useState } from 'react';
import { signUp } from '../firebase';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const user = await signUp(name, email, password, profileImage);
      // Handle successful sign-up (e.g., redirect to login or dashboard)
    } catch (err) {
      console.error('Error signing up:', err.message);
      setError(err.message); // Set error message for display
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        <h2 className='text-2xl font-semibold text-center mb-4'>
          Create an Account
        </h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='name' className='block text-gray-700'>
              Full Name
            </label>
            <input
              type='text'
              id='name'
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='email' className='block text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='password' className='block text-gray-700'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <label htmlFor='profileImage' className='block text-gray-700'>
              Profile Image
            </label>
            <input
              type='file'
              id='profileImage'
              className='w-full p-2 border border-gray-300 rounded-md'
              accept='image/*'
              onChange={handleImageChange}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600'
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
