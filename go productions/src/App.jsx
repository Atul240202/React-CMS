import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import TransitionEffect from './components/TransitionEffect';
import './App.css';
import PreLoader from './components/PreLoader/PreLoader';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Motions = lazy(() => import('./pages/Motions'));
const Stills = lazy(() => import('./pages/Stills'));
const Locations = lazy(() => import('./pages/Locations'));
const Clients = lazy(() => import('./pages/Clients'));
const Contact = lazy(() => import('./pages/Contact'));
const SpecificMotionComponent = lazy(() =>
  import('./pages/SpecificMotionComponent')
);
const SpecificStillsComponent = lazy(() =>
  import('./pages/SpecificStillsComponent')
);
const SpecificClientsComponent = lazy(() =>
  import('./pages/SpecificClientsComponent')
);
const SpecificLocationsComponent = lazy(() =>
  import('./pages/SpecificLocationComponent')
);

function App() {
  return (
    <BrowserRouter>
      <AppWithRouter />
    </BrowserRouter>
  );
}

function AppWithRouter() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check session storage for the countVisit value
    const visitCount = parseInt(
      sessionStorage.getItem('countVisit') || '0',
      10
    );

    if (visitCount === 0 && location.pathname === '/') {
      // First visit: Set isLoading to true and increment visit count
      setIsLoading(true);
      sessionStorage.setItem('countVisit', 1);
    } else {
      // Not the first visit: Increment visit count without showing preloader
      if (location.pathname === '/') {
        sessionStorage.setItem('countVisit', visitCount + 1);
      }
    }
  }, [location.pathname]);

  const handleSliderLoad = () => {
    console.log('handle slider load in app');
    setIsExiting(true);

    setTimeout(() => {
      setIsLoading(false); // Hide the PreLoader after the animation
    }, 1500);
  };

  return (
    <>
      {isLoading && location.pathname === '/' && (
        <PreLoader isExiting={isExiting} />
      )}
      <div
        style={{
          visibility:
            isLoading && location.pathname === '/' ? 'hidden' : 'visible',
        }}
      >
        <AppContent onSliderLoad={handleSliderLoad} />
      </div>
    </>
  );
}

function AppContent({ onSliderLoad }) {
  const location = useLocation();

  return (
    <Suspense fallback={<div></div>}>
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route path='/' element={<Home onSliderLoad={onSliderLoad} />} />
          <Route path='/motions' element={<Motions />} />
          <Route
            path='/motions/:clientId/:id'
            element={<SpecificMotionComponent />}
          />
          <Route path='/motions/:id' element={<SpecificMotionComponent />} />
          <Route path='/stills' element={<Stills />} />
          <Route
            path='/stills/:clientId/:stillId'
            element={<SpecificStillsComponent />}
          />
          <Route path='/locations' element={<Locations />} />
          <Route
            path='/locations/:locationKey'
            element={<SpecificLocationsComponent />}
          />
          <Route path='/clients' element={<Clients />} />
          <Route
            path='/clients/:clientKey'
            element={<SpecificClientsComponent />}
          />
          <Route path='/contact' element={<Contact />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
