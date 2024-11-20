import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Motions from './pages/Motions';
import Stills from './pages/Stills';
import Locations from './pages/Locations';
import Clients from './pages/Clients';
import Contact from './pages/Contact';
import SpecificMotionComponent from './pages/SpecificMotionComponent';
import SpecificStillsComponent from './pages/SpecificStillsComponent';
import SpecificClientsComponent from './pages/SpecificClientsComponent';
import SpecificLocationsComponent from './pages/SpecificLocationComponent';
import TransitionEffect from './components/TransitionEffect';
import CustomCursor from './components/CustomCursor';
import './App.css';

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
      <CustomCursor />
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/motions' element={<Motions />} />
          <Route path='/motions/:text' element={<SpecificMotionComponent />} />
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
          <Route path='/contacts' element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
