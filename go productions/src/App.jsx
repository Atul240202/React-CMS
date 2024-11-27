import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import TransitionEffect from './components/TransitionEffect';
import CustomCursor from './components/CustomCursor';
import './App.css';

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
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* <CustomCursor /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes location={location}>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/motions' element={<Motions />} />
            <Route
              path='/motions/:text'
              element={<SpecificMotionComponent />}
            />
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
            <Route path='/contactsus' element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
