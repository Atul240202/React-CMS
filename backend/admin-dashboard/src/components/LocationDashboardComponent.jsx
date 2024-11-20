import React, { useState, useEffect } from 'react';
import { Pencil, Plus, X, Save } from 'lucide-react';
import UploadModal from './UploadModal';
import LocationCampaignModal from './LocationCampaignModal';
import {
  getLocations,
  updateLocation,
  deleteLocation,
  deleteLocationImage,
  addLocationGridImage,
} from '../firebase';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-black border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4'>
        <h2 className='text-white text-xl font-bold text-center mb-6'>
          {message}
        </h2>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onConfirm}
            className='px-8 py-2 bg-transparent border border-green-500 text-green-500 rounded hover:bg-green-500/10'
          >
            YES
          </button>
          <button
            onClick={onClose}
            className='px-8 py-2 bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-500/10'
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

const LocationDashboardComponent = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [tempEditValues, setTempEditValues] = useState({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const fetchedLocations = await getLocations();
      setLocations(fetchedLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setIsAddingNew(false);
    setTempEditValues({});
    setEditingField(null);
  };

  const handleAddNew = () => {
    setShowAddLocationModal(true);
  };

  const handleUpload = async (url, file) => {
    if (uploadType === 'main' && selectedLocation) {
      try {
        const updatedLocation = await updateLocation(
          selectedLocation.id,
          { ...selectedLocation },
          file,
          []
        );
        setSelectedLocation(updatedLocation);
        setLocations(
          locations.map((loc) =>
            loc.id === updatedLocation.id ? updatedLocation : loc
          )
        );
      } catch (error) {
        console.error('Error updating location:', error);
      }
    } else if (uploadType === 'grid' && selectedLocation) {
      try {
        console.log('URL file value', url);
        console.log('Location file value', file);
        const newGridImage = await addLocationGridImage(
          selectedLocation.id,
          file,
          url
        );
        const updatedLocation = {
          ...selectedLocation,
          locationImages: {
            ...selectedLocation.locationImages,
            ...newGridImage,
          },
        };
        setSelectedLocation(updatedLocation);
        setLocations(
          locations.map((loc) =>
            loc.id === updatedLocation.id ? updatedLocation : loc
          )
        );
      } catch (error) {
        console.error('Error adding grid image:', error);
      }
    }
    setShowUploadModal(false);
  };

  const handleAddLocation = async (newLocation) => {
    setLocations([...locations, newLocation]);
    setShowAddLocationModal(false);
  };

  const handleDeleteLocation = async (locationId) => {
    setConfirmMessage('ARE YOU SURE YOU WANT TO REMOVE THIS LOCATION?');
    setConfirmAction(() => async () => {
      try {
        await deleteLocation(locationId);
        setLocations(locations.filter((loc) => loc.id !== locationId));
        setSelectedLocation(null);
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    });
    setShowConfirmModal(true);
  };

  const handleDeleteGridImage = async (imageKey) => {
    setConfirmMessage('ARE YOU SURE YOU WANT TO REMOVE THIS IMAGE?');
    setConfirmAction(() => async () => {
      try {
        await deleteLocationImage(selectedLocation.id, imageKey);
        const updatedImages = { ...selectedLocation.locationImages };
        delete updatedImages[imageKey];
        const updatedLocation = {
          ...selectedLocation,
          locationImages: updatedImages,
        };
        setSelectedLocation(updatedLocation);
        setLocations(
          locations.map((loc) =>
            loc.id === updatedLocation.id ? updatedLocation : loc
          )
        );
      } catch (error) {
        console.error('Error deleting grid image:', error);
      }
    });
    setShowConfirmModal(true);
  };

  const handleInputChange = (field, value) => {
    setTempEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async (field) => {
    const updatedLocation = {
      ...selectedLocation,
      [field]: tempEditValues[field],
    };
    try {
      const updated = await updateLocation(
        selectedLocation.id,
        updatedLocation
      );
      setSelectedLocation(updated);
      setLocations(
        locations.map((loc) => (loc.id === updated.id ? updated : loc))
      );
      setTempEditValues((prev) => ({ ...prev, [field]: undefined }));
      setEditingField(null);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleCancelEdit = (field) => {
    setTempEditValues((prev) => ({ ...prev, [field]: undefined }));
    setEditingField(null);
  };

  return (
    <div
      className='p-8 m-8'
      style={{
        fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
      }}
    >
      <h2 className='text-2xl font-bold mb-4'>LOCATION</h2>

      {/* Location Thumbnails */}
      <div className='grid grid-cols-4 p-8 bg-[#1C1C1C] backdrop-blur-[84px] gap-4 mb-8'>
        {locations.map((location) => (
          <div
            key={location.id}
            className='relative cursor-pointer group'
            onClick={() => handleLocationClick(location)}
          >
            <img
              src={location.image}
              alt={location.text}
              className='w-full h-40 object-cover rounded'
            />
            <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
              <span className='bg-white text-black px-2 py-1 rounded text-sm font-bold'>
                EDIT DETAILS
              </span>
            </div>
            <button
              className='absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteLocation(location.id);
              }}
            >
              <X className='h-4 w-4 text-white' />
            </button>
            <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2'>
              <p className='text-sm text-white'>{location.text}</p>
            </div>
          </div>
        ))}
        <div
          className='flex items-center justify-center bg-zinc-800 h-40 cursor-pointer hover:bg-zinc-700 transition-colors'
          onClick={handleAddNew}
        >
          <Plus className='h-8 w-8' />
        </div>
      </div>

      {/* Location Details */}
      {selectedLocation && (
        <div className='relative'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-bold'>LOCATION DETAILS</h3>
            <button
              className='bg-white rounded-full p-2'
              onClick={() => setSelectedLocation(null)}
            >
              <X className='h-4 w-4 text-black' />
            </button>
          </div>
          <div className='grid p-8 bg-[#1C1C1C] backdrop-blur-[84px] grid-cols-2 gap-4'>
            <div className='relative'>
              <img
                src={selectedLocation.image}
                alt='Location'
                className='w-full h-64 object-cover'
              />
              {/* <button
                className='absolute top-2 right-2 bg-red-500 p-1 rounded-full'
                onClick={() => handleDeleteLocation(selectedLocation.id)}
              >
                <X className='h-4 w-4 text-white' />
              </button> */}
            </div>
            <div className='space-y-4'>
              <div className='border border-white p-2 flex items-center justify-between relative'>
                <div className='flex-grow'>
                  <p className='mb-1'>TITLE</p>
                  {editingField === 'text' ? (
                    <input
                      type='text'
                      value={tempEditValues.text ?? selectedLocation.text}
                      onChange={(e) =>
                        handleInputChange('text', e.target.value)
                      }
                      onBlur={handleSaveChanges}
                      className='w-full bg-transparent focus:outline-none'
                      placeholder='Enter title'
                    />
                  ) : (
                    <p>{selectedLocation.text}</p>
                  )}
                </div>
                {editingField !== 'text' ? (
                  <button onClick={() => setEditingField('text')}>
                    <Pencil className='h-4 w-4 text-white' />
                  </button>
                ) : (
                  <div className='absolute bottom-2 right-2 flex space-x-2'>
                    <button
                      className='border border-white text-white px-2 py-1 rounded text-sm'
                      onClick={() => handleCancelEdit('text')}
                    >
                      Cancel
                    </button>
                    <button
                      className='border border-white text-white px-2 py-1 rounded text-sm'
                      onClick={() => handleSaveChanges('text')}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              <div className='border border-white p-2 rounded flex items-center justify-between relative'>
                <div className='flex-grow'>
                  <p className='mb-1'>ADDRESS</p>
                  {editingField === 'address' ? (
                    <input
                      type='text'
                      value={tempEditValues.address ?? selectedLocation.address}
                      onChange={(e) =>
                        handleInputChange('address', e.target.value)
                      }
                      onBlur={handleSaveChanges}
                      className='w-full bg-transparent focus:outline-none'
                      placeholder='Enter address'
                    />
                  ) : (
                    <p>{selectedLocation.address}</p>
                  )}
                </div>
                {editingField !== 'address' ? (
                  <button onClick={() => setEditingField('address')}>
                    <Pencil className='h-4 w-4 text-white' />
                  </button>
                ) : (
                  <div className='absolute bottom-2 right-2 flex space-x-2'>
                    <button
                      className='border border-white text-white px-2 py-1 rounded text-sm'
                      onClick={() => handleCancelEdit('address')}
                    >
                      Cancel
                    </button>
                    <button
                      className='border border-white text-white px-2 py-1 rounded text-sm'
                      onClick={() => handleSaveChanges('address')}
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              <button
                className='border border-white p-2 rounded w-full text-left'
                onClick={() => {
                  setUploadType('main');
                  setShowUploadModal(true);
                }}
              >
                CHANGE PICTURE
              </button>
            </div>
          </div>

          {/* Location Grid */}
          <h3 className='text-xl font-bold my-4'>LOCATION GRID</h3>
          <div className='p-8 bg-[#1C1C1C] grid grid-cols-6 gap-4'>
            {selectedLocation.locationImages &&
              Object.entries(selectedLocation.locationImages).map(
                ([key, url]) => (
                  <div key={key} className='relative group'>
                    <img
                      src={url}
                      alt={`Grid ${key}`}
                      className='w-full h-32 object-cover'
                    />
                    <button
                      className='absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                      onClick={() => handleDeleteGridImage(key)}
                    >
                      <X className='h-4 w-4 text-white' />
                    </button>
                  </div>
                )
              )}
            <div
              className='flex items-center justify-center bg-zinc-800 h-32 cursor-pointer hover:bg-zinc-700'
              onClick={() => {
                setUploadType('grid');
                setShowUploadModal(true);
              }}
            >
              <Plus className='h-8 w-8' />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LocationCampaignModal
        isOpen={showAddLocationModal}
        onClose={() => setShowAddLocationModal(false)}
        onAddLocation={handleAddLocation}
      />

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          confirmAction();
          setShowConfirmModal(false);
        }}
        message={confirmMessage}
      />
    </div>
  );
};

export default LocationDashboardComponent;
