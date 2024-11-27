import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Pencil, Plus, X, Save } from 'lucide-react';
import UploadModal from './HomepageModals/UploadModal';
import LocationCampaignModal from './LocationCampaignModal';
import DraggableLocationItem from './Draggable/DraggableLocationItem';
import {
  getLocations,
  updateLocation,
  deleteLocation,
  deleteLocationImage,
  addLocationGridImage,
  updateLocationSequence,
  uploadImage,
} from '../firebase';
import CampaignGrid from './CampaignGrid';

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
      console.log('fetched location', fetchedLocations);
      setLocations(
        fetchedLocations.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      );
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
        console.log('image url', url);
        const updatedLocation = await updateLocation(
          selectedLocation.id,
          { ...selectedLocation },
          url,
          []
        );
        console.log('Updated location', updatedLocation);
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

  const moveLocation = useCallback((dragIndex, hoverIndex) => {
    setLocations((prevLocations) => {
      const newLocations = [...prevLocations];
      const draggedLocation = newLocations[dragIndex];
      newLocations.splice(dragIndex, 1);
      newLocations.splice(hoverIndex, 0, draggedLocation);
      return newLocations;
    });
  }, []);

  const handleDragEnd = useCallback(async () => {
    const updates = locations.map((location, index) => ({
      id: location.id,
      sequence: index,
    }));

    try {
      await updateLocationSequence(updates);
    } catch (error) {
      console.error('Error updating location sequences:', error);
      fetchLocations();
    }
  }, [locations]);

  const handleGridReorder = (reorderedImages) => {
    if (selectedLocation) {
      const updatedLocation = {
        ...selectedLocation,
        internalImages: reorderedImages,
      };
      setSelectedLocation(updatedLocation);
      updateLocation(selectedLocation.id, updatedLocation);
    }
  };

  const handleGridCrop = async (id, croppedImage) => {
    if (selectedLocation) {
      try {
        const url = await uploadImage(
          croppedImage,
          `locations/${selectedLocation.id}/grid_${Date.now()}`
        );
        const updatedInternalImages = selectedLocation.internalImages.map(
          (img) => (img.id === id ? { ...img, url } : img)
        );
        const updatedLocation = {
          ...selectedLocation,
          internalImages: updatedInternalImages,
        };
        setSelectedLocation(updatedLocation);
        updateLocation(selectedLocation.id, updatedLocation);
      } catch (error) {
        console.error('Error cropping image:', error);
        alert('Failed to crop image. Please try again.');
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className='p-8 m-8'
        style={{
          fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
        }}
      >
        <h2 className='text-2xl font-extrabold mb-4'>LOCATION</h2>

        {/* Location Thumbnails */}
        <div className='grid grid-cols-4 p-8 bg-[#1C1C1C] backdrop-blur-[84px] gap-4 mb-8'>
          {locations.map((location, index) => (
            <DraggableLocationItem
              key={location.id}
              id={location.id}
              index={index}
              location={location}
              moveLocation={moveLocation}
              handleLocationClick={handleLocationClick}
              handleDeleteLocation={handleDeleteLocation}
              handleDragEnd={handleDragEnd}
            />
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
              <h3 className='text-2xl font-extrabold'>LOCATION DETAILS</h3>
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
                  loading='lazy'
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
                    <p className='mb-1 text-xl font-extrabold'>TITLE</p>
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
                    <p className='mb-1 text-xl font-extrabold'>ADDRESS</p>
                    {editingField === 'address' ? (
                      <input
                        type='text'
                        value={
                          tempEditValues.address ?? selectedLocation.address
                        }
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        onBlur={handleSaveChanges}
                        className='w-full bg-transparent text-xl font-bold focus:outline-none'
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
                  className='border border-white p-2 rounded w-full text-left text-xl font-extrabold'
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
            <h3 className='text-2xl font-extrabold mb-4 mt-6'>LOCATION GRID</h3>
            <div className='p-8 bg-[#1C1C1C]'>
              <CampaignGrid
                images={selectedLocation.internalImages}
                onReorder={handleGridReorder}
                onCrop={handleGridCrop}
                onDelete={handleDeleteGridImage}
              />
              <button
                onClick={() => {
                  setUploadType('grid');
                  setShowUploadModal(true);
                }}
                className='mt-4 w-full aspect-[3/1] bg-zinc-800 rounded flex items-center justify-center hover:bg-zinc-700 transition-colors'
              >
                <Plus className='h-8 w-8' />
              </button>
            </div>
          </div>
        )}

        <LocationCampaignModal
          isOpen={showAddLocationModal}
          onClose={() => setShowAddLocationModal(false)}
          onAddLocation={handleAddLocation}
        />

        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          acceptVideo={false}
          multiple={uploadType === 'grid'}
          requireCrop={true}
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
    </DndProvider>
  );
};

export default LocationDashboardComponent;
