import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HeroBannerSection from './HomeSections/HeroBannerSection';
import StillGridSection from './HomeSections/StillGridSection';
import MotionSection from './HomeSections/MotionSection';
import ClientSection from './HomeSections/ClientSection';
import LocationSection from './HomeSections/LocationSection';
export default function HomePage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='min-h-screen bg-black text-white p-8'>
        <HeroBannerSection />

        <StillGridSection />

        <MotionSection />

        <ClientSection />

        <LocationSection />
      </div>
    </DndProvider>
  );
}
