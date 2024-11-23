import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import './App.css';
import { Navigate } from 'react-router-dom';
import StillDashboard from './pages/StillDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logout } from './firebase';

const TIMEOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const AuthWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is a public route
  const isPublicRoute = () => {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    return publicRoutes.includes(location.pathname);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isPublicRoute()) {
        navigate('/login');
      } else if (user && isPublicRoute()) {
        // Redirect to dashboard if user is logged in and tries to access public routes
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate, location]);

  useEffect(() => {
    let timeoutId;

    // Function to reset the timeout
    const resetTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Only set timeout if user is logged in and not on a public route
      if (auth.currentUser && !isPublicRoute()) {
        timeoutId = setTimeout(async () => {
          try {
            await logout();
            navigate('/login');
          } catch (error) {
            console.error('Logout error:', error);
          }
        }, TIMEOUT_DURATION);
      }
    };

    // Function to handle user activity
    const handleUserActivity = () => {
      if (!isPublicRoute()) {
        resetTimeout();
      }
    };

    // Add event listeners only if not on public routes
    if (!isPublicRoute()) {
      // Add event listeners
      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keypress', handleUserActivity);
      window.addEventListener('scroll', handleUserActivity);
      window.addEventListener('click', handleUserActivity);
      window.addEventListener('touchstart', handleUserActivity);

      // Initial timeout set
      resetTimeout();
    }

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [navigate, location]);

  // Show loading state while checking authentication
  if (auth.currentUser === undefined) {
    return (
      <div className='flex h-screen items-center justify-center bg-black'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/' element={<StillDashboard />} />
      {/* Catch all route - redirect to login */}
      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthWrapper />
    </BrowserRouter>
  );
};

export default App;
