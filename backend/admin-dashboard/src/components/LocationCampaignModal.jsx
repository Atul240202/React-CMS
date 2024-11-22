'use client';

import React, { useState } from 'react';
import { X, Pencil, Plus, LoaderCircle, Trash2 } from 'lucide-react';
import UploadModal from './HomepageModals/UploadModal';
import { addLocation } from '../firebase';

const LocationCampaignModal = ({ isOpen, onClose, onAddLocation }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [locationData, setLocationData] = useState({
    text: '',
    address: '',
    image: null,
    locationImages: {},
  });
  const [uploadType, setUploadType] = useState('');
  const [mainFile, setMainFile] = useState(null);
  const [gridFiles, setGridFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleUpload = (urls, files) => {
    if (uploadType === 'main') {
      setMainFile(files[0]);
      setLocationData((prev) => ({
        ...prev,
        image: urls[0],
      }));
      validateField('image', files[0]);
    } else if (uploadType === 'grid') {
      const newGridFiles = [...gridFiles, ...files];
      setGridFiles(newGridFiles);
      const newLocationImages = { ...locationData.locationImages };
      urls.forEach((url, index) => {
        const newImageKey = `image${Object.keys(newLocationImages).length + 1}`;
        newLocationImages[newImageKey] = url;
      });
      setLocationData((prev) => ({
        ...prev,
        locationImages: newLocationImages,
      }));
    }
    setShowUploadModal(false);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'text':
        if (!value) {
          newErrors.text = 'Title is required';
        } else {
          delete newErrors.text;
        }
        break;
      case 'address':
        if (!value) {
          newErrors.address = 'Address is required';
        } else {
          delete newErrors.address;
        }
        break;
      case 'image':
        if (!value) {
          newErrors.image = '*';
        } else {
          delete newErrors.image;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleRemoveGridImage = (keyToRemove) => {
    setLocationData((prev) => {
      const newLocationImages = { ...prev.locationImages };
      delete newLocationImages[keyToRemove];
      return { ...prev, locationImages: newLocationImages };
    });
    setGridFiles((prev) =>
      prev.filter((_, index) => `image${index + 1}` !== keyToRemove)
    );
  };

  const validateForm = () => {
    let newErrors = {};
    if (!locationData.text) newErrors.text = 'Title is required';
    if (!locationData.address) newErrors.address = 'Address is required';
    if (!mainFile) newErrors.image = 'Location Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const newLocation = await addLocation(locationData, mainFile, gridFiles);
      onAddLocation(newLocation);
      onClose();
    } catch (error) {
      console.error('Error adding new location:', error);
      alert('Failed to add new location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-[#0C0C0C] z-40 overflow-y-auto'
      style={{
        fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
      }}
    >
      <div className='min-h-screen p-4'>
        <div className='max-w-5xl mx-auto '>
          <div className='flex justify-between items-center p-6 border-b border-gray-800'>
            <h2 className='text-2xl font-bold'>FILL LOCATION DETAILS</h2>
            <button onClick={onClose}>
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='p-6 space-y-8'>
            <div className='flex bg-[#1C1C1C] p-6  justify-between'>
              {/* Main Image */}
              <div className='aspect-video bg-zinc-800 overflow-hidden w-6/12 mr-6  hover:bg-zinc-700'>
                {locationData.image ? (
                  <img
                    src={locationData.image}
                    alt='Location'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <button
                    onClick={() => {
                      setUploadType('main');
                      setShowUploadModal(true);
                    }}
                    className='w-full h-full flex items-center justify-center'
                  >
                    <Plus className='h-8 w-8' />
                  </button>
                )}
              </div>
              {errors.image && (
                <p className='text-red-500 text-sm mt-1'>{errors.image}</p>
              )}

              {/* Title and Address */}
              <div className='space-y-4 w-1/2'>
                <div className='flex flex-col'>
                  <div className='border border-white p-3 rounded'>
                    <div className='flex items-center justify-between'>
                      <span>
                        TITLE <span className='text-red-500'>*</span>
                      </span>
                      <Pencil className='h-4 w-4' />
                    </div>
                    <input
                      type='text'
                      name='text'
                      value={locationData.text}
                      onChange={handleInputChange}
                      placeholder='Write Here..'
                      className='w-full bg-transparent mt-2 focus:outline-none'
                    />
                  </div>
                  {errors.text && (
                    <p className='text-red-500 text-sm mt-1'>{errors.text}</p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='border border-white p-3 rounded'>
                    <div className='flex items-center justify-between'>
                      <span>
                        ADDRESS <span className='text-red-500'>*</span>
                      </span>
                      <Pencil className='h-4 w-4' />
                    </div>
                    <input
                      type='text'
                      name='address'
                      value={locationData.address}
                      onChange={handleInputChange}
                      placeholder='Write Here..'
                      className='w-full bg-transparent mt-2 focus:outline-none'
                    />
                  </div>
                  {errors.address && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.address}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setUploadType('main');
                    setShowUploadModal(true);
                  }}
                  className='w-full border border-white p-3 rounded text-left flex items-center justify-between'
                >
                  <span>CHANGE IMAGE</span>
                  <Pencil className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Location Grid */}
            <div>
              <h3 className='text-xl font-bold mb-4'>LOCATION GRID</h3>
              <div className='grid grid-cols-6 gap-4 bg-[#1C1C1C] p-6'>
                {Object.entries(locationData.locationImages).map(
                  ([key, url]) => (
                    <div
                      key={key}
                      className='aspect-square bg-gray-800 overflow-hidden relative group'
                    >
                      <img
                        src={url}
                        alt={`Grid ${key}`}
                        className='w-full h-full object-cover'
                      />
                      <button
                        onClick={() => handleRemoveGridImage(key)}
                        className='absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <Trash2 className='h-4 w-4 text-white' />
                      </button>
                    </div>
                  )
                )}
                <button
                  onClick={() => {
                    setUploadType('grid');
                    setShowUploadModal(true);
                  }}
                  className='aspect-square bg-zinc-800 flex items-center justify-center hover:bg-zinc-700'
                >
                  <Plus className='h-8 w-8' />
                </button>
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                className='px-8 py-2 border border-white hover:bg-zinc-800 disabled:bg-gray-600'
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'SAVING...' : 'DONE'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        multiple={uploadType === 'grid'}
        requireCrop={uploadType === 'main'}
      />

      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-4 flex flex-col items-center'>
            <LoaderCircle className='animate-spin h-8 w-8 text-blue-500 mb-2' />
            <p className='text-gray-800'>Saving new Location...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCampaignModal;
