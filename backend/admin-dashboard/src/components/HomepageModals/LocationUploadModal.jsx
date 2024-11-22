import React, { useState, useEffect } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import {
  getHomeLocations,
  getHomeLocationImage,
  uploadHomeLocation,
  updateHomeLocation,
} from '../../firebase';
import { LazyLoadImage } from 'react-lazy-load-image-component';

Modal.setAppElement('#root');

export default function LocationUploadModal({
  isOpen,
  onClose,
  onUpload,
  onUpdate,
  editingLocation,
}) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationImage, setLocationImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingLocation) {
      setSelectedLocation(editingLocation.linkedLocationId);
      setLocationImage(editingLocation.image);
    } else {
      resetForm();
    }
  }, [editingLocation]);

  const fetchLocations = async () => {
    try {
      const locationsData = await getHomeLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
    }
  };

  const handleLocationChange = async (e) => {
    const locationId = e.target.value;
    setSelectedLocation(locationId);
    if (locationId) {
      try {
        const imageUrl = await getHomeLocationImage(locationId);
        setLocationImage(imageUrl);
      } catch (error) {
        console.error('Error fetching location image:', error);
        toast.error('Failed to fetch location image');
      }
    } else {
      setLocationImage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedLocation || !locationImage) {
      toast.error('Please select a location');
      return;
    }

    setIsUploading(true);

    try {
      const selectedLocationData = locations.find(
        (loc) => loc.id === selectedLocation
      );
      if (editingLocation) {
        const updatedLocation = {
          ...editingLocation,
          linkedLocationId: selectedLocation,
          name: selectedLocationData.text,
          image: locationImage,
          url: `/location/${selectedLocation}`,
        };
        await updateHomeLocation(updatedLocation);
        onUpdate(updatedLocation);
      } else {
        const newLocation = {
          linkedLocationId: selectedLocation,
          name: selectedLocationData.text,
          image: locationImage,
          url: `/location/${selectedLocation}`,
        };
        const uploadedLocation = await uploadHomeLocation(newLocation);
        onUpload(uploadedLocation);
      }
      toast.success(
        editingLocation
          ? 'Location updated successfully'
          : 'Location uploaded successfully'
      );
      onClose();
    } catch (error) {
      console.error('Error uploading/updating location:', error);
      toast.error(
        editingLocation
          ? 'Failed to update location'
          : 'Failed to upload location'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedLocation('');
    setLocationImage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='fixed inset-0 flex items-center justify-center p-4'
      overlayClassName='fixed inset-0 bg-black bg-opacity-80'
    >
      <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-white'>
            {editingLocation ? 'Update Location' : 'Upload Location'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Select Location
            </label>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className='w-full bg-zinc-800 text-white rounded p-2'
            >
              <option value=''>Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.text}
                </option>
              ))}
            </select>
          </div>

          {locationImage && (
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-1'>
                Location Image
              </label>
              <LazyLoadImage
                src={locationImage}
                alt='Selected location'
                effect='blur'
                className='w-full rounded'
              />
            </div>
          )}
        </div>

        <div className='flex justify-between items-center mt-6'>
          <button className='flex items-center text-gray-400 hover:text-gray-300'>
            <HelpCircle className='h-4 w-4 mr-1' />
            Help
          </button>
          <div className='space-x-2'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-white'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-white disabled:opacity-50'
              disabled={isUploading || !selectedLocation || !locationImage}
            >
              {isUploading ? (
                <>
                  <Upload className='animate-spin h-4 w-4 mr-2 inline' />
                  {editingLocation ? 'Updating...' : 'Uploading...'}
                </>
              ) : editingLocation ? (
                'Update'
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
