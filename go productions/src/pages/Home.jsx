import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Still from '../components/Still';
import Motion from '../components/Motion';
import ClientLogo from '../components/ClientLogo';
import ShootLocation from '../components/ShootLocation';
import ContactUs from '../components/ContactUs';
import TransitionEffect from '../components/TransitionEffect';

function Home({ onSliderLoad }) {
  const handleSliderLoad = () => {
    onSliderLoad();
  };
  return (
    <div className='App'>
      <Slider onSliderLoad={handleSliderLoad} />
      <Still />
      <Motion />
      <ClientLogo />
      <ShootLocation />
      <ContactUs />
    </div>
  );
}

export default Home;
