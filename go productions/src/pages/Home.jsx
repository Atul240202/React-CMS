import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Still from '../components/Still';
import Motion from '../components/Motion';
import ClientLogo from '../components/ClientLogo';
import ShootLocation from '../components/ShootLocation';
import ContactUs from '../components/ContactUs';

function Home({ onSliderLoad }) {
  return (
    <div className='App'>
      <Slider onSliderLoad={onSliderLoad} />
      <Still />
      <Motion />
      <ClientLogo />
      <ShootLocation />
      <ContactUs />
    </div>
  );
}

export default Home;
