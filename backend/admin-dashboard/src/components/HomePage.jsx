import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HeroBannerSection from './HomeSections/HeroBannerSection';
import StillGridSection from './HomeSections/StillGridSection';
import MotionSection from './HomeSections/MotionSection';
import ClientSection from './HomeSections/ClientSection';
import LocationSection from './HomeSections/LocationSection';
// import HomeUploadModal from './HomepageModals/HomeUploadModal';
// import ImageCropModal from './HomepageModals/ImageCropModal';
import { getHomeMotions } from '../firebase';
export default function HomePage({ initialData = {} }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stillShowUploadModal, setstillShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropAspectRatio, setCropAspectRatio] = useState(16 / 9);
  const [stillGridSize, setStillGridSize] = useState(2);

  const [data, setData] = useState({
    heroBanners: initialData.heroBanners || [],
    homeStills: initialData.homeStills || [],
    homeMotions: [],
    homeClients: initialData.homeClients || [],
    homeLocations: initialData.homeLocations || [],
  });

  // useEffect(() => {
  //   const fetchHomeMotions = async () => {
  //     try {
  //       const motions = await getHomeMotions();
  //       setData((prevData) => ({ ...prevData, homeMotions: motions }));
  //     } catch (error) {
  //       console.error('Error fetching home motions:', error);
  //     }
  //   };

  //   fetchHomeMotions();
  // }, []);

  const handleMotionUpload = (newMotion) => {
    setData((prevData) => ({
      ...prevData,
      homeMotions: [...prevData.homeMotions, newMotion],
    }));
  };

  // const handleUpload = async (urls, files, metadata) => {
  //   switch (uploadType) {
  //     case 'hero':
  //       setCropImage(urls[0]);
  //       setCropAspectRatio(16 / 9);
  //       setShowCropModal(true);
  //       break;
  //     case 'still':
  //       const newStill = {
  //         id: Date.now().toString(),
  //         image: urls[0],
  //         clientId: metadata.clientId,
  //         productTitle: metadata.productTitle,
  //         imagePortrait: metadata.isPortrait,
  //         rowOrder: data.homeStills.length,
  //         logoUrl: metadata.logoUrl,
  //         urlForSpecificStillPage: `/stills/${
  //           metadata.clientId
  //         }/${Date.now().toString()}`,
  //       };
  //       setData((prev) => ({
  //         ...prev,
  //         homeStills: [...prev.homeStills, newStill],
  //       }));
  //       break;
  //     case 'motion':
  //       if (urls.length === 1) {
  //         setData((prev) => ({
  //           ...prev,
  //           homeMotions: [
  //             ...prev.homeMotions,
  //             {
  //               id: Date.now().toString(),
  //               thumbnail: urls[0],
  //               video: urls[0],
  //               clientId: metadata.clientId,
  //               productTitle: metadata.productTitle,
  //               order: prev.homeMotions.length,
  //             },
  //           ],
  //         }));
  //       }
  //       break;
  //     case 'client':
  //       if (urls.length === 1) {
  //         setData((prev) => ({
  //           ...prev,
  //           homeClients: [
  //             ...prev.homeClients,
  //             {
  //               id: Date.now().toString(),
  //               name: metadata.clientName,
  //               logo: urls[0],
  //               originalClientId: metadata.originalClientId,
  //               order: prev.homeClients.length,
  //             },
  //           ],
  //         }));
  //       }
  //       break;
  //     case 'location':
  //       if (urls.length === 1) {
  //         setData((prev) => ({
  //           ...prev,
  //           homeLocations: [
  //             ...prev.homeLocations,
  //             {
  //               id: Date.now().toString(),
  //               image: urls[0],
  //               name: metadata.locationName,
  //               linkedLocationId: metadata.linkedLocationId,
  //               order: prev.homeLocations.length,
  //             },
  //           ],
  //         }));
  //       }
  //       break;
  //   }
  //   setShowUploadModal(false);
  // };

  const handleCropComplete = (croppedImageUrl) => {
    if (uploadType === 'hero') {
      setData((prev) => ({
        ...prev,
        heroBanners: [
          ...prev.heroBanners,
          {
            id: Date.now().toString(),
            image: croppedImageUrl,
            order: prev.heroBanners.length,
          },
        ].slice(0, 4),
      }));
    }
    setShowCropModal(false);
    setCropImage(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='min-h-screen bg-black text-white p-8'>
        <HeroBannerSection
          banners={data.heroBanners}
          onUpload={() => {
            setUploadType('hero');
            setShowUploadModal(true);
          }}
          setData={setData}
        />

        <StillGridSection
          stills={data.homeStills}
          stillGridSize={stillGridSize}
          setStillGridSize={setStillGridSize}
          onUpload={() => {
            setUploadType('still');
            setShowUploadModal(true);
          }}
          setData={setData}
        />

        <MotionSection
          motions={data.homeMotions}
          onUpload={handleMotionUpload}
        />

        <ClientSection
          clients={data.homeClients}
          onUpload={() => {
            setUploadType('client');
            setShowUploadModal(true);
          }}
        />

        <LocationSection
          locations={data.homeLocations}
          onUpload={() => {
            setUploadType('location');
            setShowUploadModal(true);
          }}
        />
      </div>
    </DndProvider>
  );
}
