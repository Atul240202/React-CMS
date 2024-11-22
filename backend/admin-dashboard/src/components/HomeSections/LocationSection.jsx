import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import LocationUploadModal from '../HomepageModals/LocationUploadModal';
import { getHomeLocationsData, deleteHomeLocation } from '../../firebase';
import toast from 'react-hot-toast';

export default function LocationSection() {
  const [locations, setLocations] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const locationsData = await getHomeLocationsData();
      setLocations(locationsData);
    } catch (error) {
      console.error('Error fetching home locations:', error);
      toast.error('Failed to load locations');
    }
  };

  const handleUpload = (newLocation) => {
    setLocations([...locations, newLocation]);
  };

  const handleUpdate = (updatedLocation) => {
    setLocations(
      locations.map((loc) =>
        loc.id === updatedLocation.id ? updatedLocation : loc
      )
    );
    setEditingLocation(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHomeLocation(id);
      setLocations(locations.filter((loc) => loc.id !== id));
      toast.success('Location deleted successfully');
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Failed to delete location');
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setShowUploadModal(true);
  };

  return (
    <section className='mb-12'>
      <h2 className='text-2xl font-bold mb-4'>LOCATION</h2>
      <div className='p-8 bg-[#1C1C1C] backdrop-blur-[84px] mb-8'>
        <div className='grid grid-cols-4 gap-4'>
          {locations.map((location) => (
            <div
              key={location.id}
              className='relative aspect-[4/3] overflow-hidden group'
            >
              <Link to={location.url} className='block w-full h-full'>
                <LazyLoadImage
                  src={location.image}
                  alt={location.name}
                  effect='blur'
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              </Link>
              <div className='absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <button
                  onClick={() => handleEdit(location)}
                  className='p-2 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
                >
                  <Pencil className='h-4 w-4 text-white' />
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className='p-2 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
                >
                  <X className='h-4 w-4 text-white' />
                </button>
              </div>
            </div>
          ))}
          {locations.length < 4 && (
            <button
              className='aspect-[4/3] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
              onClick={() => setShowUploadModal(true)}
            >
              <Plus className='h-8 w-8' />
            </button>
          )}
        </div>
      </div>

      <LocationUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setEditingLocation(null);
        }}
        onUpload={handleUpload}
        onUpdate={handleUpdate}
        editingLocation={editingLocation}
      />
    </section>
  );
}
