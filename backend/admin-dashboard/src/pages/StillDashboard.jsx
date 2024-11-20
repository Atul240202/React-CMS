import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StillDashboardComponent from '../components/StillDashboardComponent';
import MotionDashboardComponent from '../components/MotionDashboardComponent';
import LocationDashboardComponent from '../components/LocationDashboardComponent';
import ClientDashboardComponent from '../components/ClientDashboardComponent';
import HomePage from '../components/HomePage';

export default function StillDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('home');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className='flex flex-col h-screen bg-black text-white'>
      <Header toggleSidebar={toggleSidebar} />
      <div className='flex flex-1 overflow-hidden'>
        <Sidebar
          isOpen={isSidebarOpen}
          onNavigate={handleNavigation}
          activeComponent={activeComponent}
        />
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          {activeComponent === 'still' ? (
            <StillDashboardComponent />
          ) : activeComponent === 'motion' ? (
            <MotionDashboardComponent />
          ) : activeComponent === 'map' ? (
            <LocationDashboardComponent />
          ) : activeComponent === 'client' ? (
            <ClientDashboardComponent />
          ) : activeComponent === 'home' ? (
            <HomePage />
          ) : null}
        </main>
      </div>
    </div>
  );
}
