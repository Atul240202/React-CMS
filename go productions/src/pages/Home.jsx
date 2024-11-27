// import React, { useState, useEffect } from 'react';
// import Header from '../components/Header';
// import Slider from '../components/Slider';
// import Still from '../components/Still';
// import Motion from '../components/Motion';
// import ClientLogo from '../components/ClientLogo';
// import ShootLocation from '../components/ShootLocation';
// import ContactUs from '../components/ContactUs';
// import TransitionEffect from '../components/TransitionEffect';

// function Home() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const [componentsLoaded, setComponentsLoaded] = useState({
//     slider: false,
//     still: false,
//     motion: false,
//     clientLogo: false,
//     shootLocation: false,
//     contactUs: false,
//   });

//   useEffect(() => {
//     const totalComponents = Object.keys(componentsLoaded).length;
//     const loadedComponents =
//       Object.values(componentsLoaded).filter(Boolean).length;
//     const newProgress = Math.round((loadedComponents / totalComponents) * 100);
//     setProgress(newProgress);

//     if (newProgress === 100) {
//       setIsLoading(false);
//     }
//   }, [componentsLoaded]);

//   const handleComponentLoad = (componentName) => {
//     setComponentsLoaded((prev) => ({ ...prev, [componentName]: true }));
//   };

//   const handleTransitionComplete = () => {
//     // You can add any additional logic here if needed after the transition is complete
//     console.log('Transition complete');
//   };

//   return (
//     <div className='App'>
//       <TransitionEffect
//         isLoading={isLoading}
//         progress={progress}
//         pageName='Home'
//         onTransitionComplete={handleTransitionComplete}
//       />
//       <Slider onLoad={() => handleComponentLoad('slider')} />
//       <Still onLoad={() => handleComponentLoad('still')} />
//       <Motion onLoad={() => handleComponentLoad('motion')} />
//       <ClientLogo />
//       <ShootLocation onLoad={() => handleComponentLoad('shootLocation')} />
//       <ContactUs />
//     </div>
//   );
// }

// export default Home;

import React from 'react';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Still from '../components/Still';
import Motion from '../components/Motion';
import ClientLogo from '../components/ClientLogo';
import ShootLocation from '../components/ShootLocation';
import ContactUs from '../components/ContactUs';

function Home() {
  return (
    <div className='App'>
      <Slider />
      <Still />
      <Motion />
      <ClientLogo />
      <ShootLocation />
      <ContactUs />
    </div>
  );
}

export default Home;
