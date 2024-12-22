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
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isExitingPreloader, setIsExitingPreloader] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      const visitCount = parseInt(
        sessionStorage.getItem('countVisit') || '0',
        10
      );
      console.log('visit count', visitCount);
      if (visitCount === 0) {
        setIsFirstVisit(true);
        sessionStorage.setItem('countVisit', '1');
        console.log('First visit detected.');
      } else if (visitCount > 1) {
        setIsFirstVisit(false);
        sessionStorage.setItem('countVisit', (visitCount + 1).toString());
        setShowTransition(true);
      } else if (visitCount === 1) {
        sessionStorage.setItem('countVisit', (visitCount + 1).toString());
        console.log(
          'Session storage value in else',
          sessionStorage.getItem('countVisit')
        );
      }
    }
  }, [location.pathname]);

  const handleSliderLoad = () => {
    if (isFirstVisit) {
      setIsExitingPreloader(true);
      setTimeout(() => setIsLoading(false), 2000);
    } else {
      setTransitionProgress(100);
      setTimeout(() => {
        setShowTransition(false);
        setIsLoading(false);
      }, 2000); // Adjust this timeout to match your transition duration
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
  };

  return (
    <>
      {isFirstVisit && isLoading && location.pathname === '/' && (
        <PreLoader isExiting={isExitingPreloader} />
      )}
      {!isFirstVisit && showTransition && location.pathname === '/' && (
        <TransitionEffect
          isLoading={isLoading}
          progress={transitionProgress}
          pageName='Home'
          onTransitionComplete={handleTransitionComplete}
        />
      )}
      <div>
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
