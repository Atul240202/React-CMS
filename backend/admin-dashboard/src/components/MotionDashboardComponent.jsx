import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Plus, X, Eye, EyeOff } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import MotionCampaignModal from './MotionCampaignModal';
import UploadModal from './HomepageModals/UploadModal';
import DraggableMotionItem from './Draggable/DraggableMotionItem';
import {
  getMotions,
  updateMotion,
  deleteMotion,
  getClientsByName,
  updateMotionSequence,
} from '../firebase';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-black border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4'>
        <h2 className='text-white text-xl font-bold text-center mb-6'>
          ARE YOU SURE YOU WANT TO REMOVE THIS MOTION?
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

const MotionDashboardComponent = () => {
  const [motions, setMotions] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedMotion, setSelectedMotion] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [motionToDelete, setMotionToDelete] = useState(null);
  const [visibleFields, setVisibleFields] = useState({});

  useEffect(() => {
    fetchMotions();
    fetchClients();
  }, []);

  const fetchMotions = async () => {
    try {
      const fetchedMotions = await getMotions();
      setMotions(
        fetchedMotions.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      );
      // Initialize visibility state based on fetched data
      if (fetchedMotions.length > 0) {
        const initialVisibility = {};
        fetchedMotions.forEach((motion) => {
          initialVisibility[motion.id] = motion.visibleFields || {};
        });
        setVisibleFields(initialVisibility);
      }
    } catch (error) {
      console.error('Error fetching motions:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const fetchedClients = await getClientsByName();
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleMotionClick = (motion) => {
    setSelectedMotion(motion);
    setEditingField(null);
  };

  const handleAddNew = () => {
    setShowAddCampaignModal(true);
  };

  const handleUpload = async (files, urls) => {
    if (selectedMotion && files.length > 0) {
      console.log('uploading motion data', selectedMotion);
      console.log('uploading motion urls', urls[0].type, urls[0].name);
      console.log('uploading motion files', files);
      try {
        const updatedMotion = await updateMotion(
          selectedMotion.clientId,
          selectedMotion.id,
          urls[0],
          files[0]
        );
        console.log('uploading motion', updatedMotion);
        setMotions(
          motions.map((m) => (m.id === updatedMotion.id ? updatedMotion : m))
        );
        setSelectedMotion(updatedMotion);
      } catch (error) {
        console.error('Error updating motion:', error);
      }
    }
    setShowUploadModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('credits.')) {
      const creditKey = name.split('.')[1];
      setSelectedMotion((prev) => ({
        ...prev,
        credits: { ...prev.credits, [creditKey]: value },
      }));
    } else {
      setSelectedMotion((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedMotion = await updateMotion(
        selectedMotion.clientId,
        selectedMotion.id,
        {
          ...selectedMotion,
          visibleFields: visibleFields[selectedMotion.id] || {},
        }
      );
      setMotions(
        motions.map((m) => (m.id === updatedMotion.id ? updatedMotion : m))
      );
      setEditingField(null);
    } catch (error) {
      console.error('Error saving motion:', error);
    }
  };

  const handleDeleteClick = (e, motion) => {
    e.stopPropagation();
    setMotionToDelete(motion);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    if (motionToDelete) {
      try {
        await deleteMotion(motionToDelete.clientId, motionToDelete.id);
        setMotions(motions.filter((m) => m.id !== motionToDelete.id));
        if (selectedMotion && selectedMotion.id === motionToDelete.id) {
          setSelectedMotion(null);
        }
      } catch (error) {
        console.error('Error deleting motion:', error);
      } finally {
        setShowConfirmationModal(false);
        setMotionToDelete(null);
      }
    }
  };

  const toggleFieldVisibility = async (field) => {
    if (selectedMotion) {
      const updatedVisibility = {
        ...visibleFields[selectedMotion.id],
        [field]: !visibleFields[selectedMotion.id]?.[field],
      };

      setVisibleFields((prev) => ({
        ...prev,
        [selectedMotion.id]: updatedVisibility,
      }));

      try {
        await updateMotion(selectedMotion.clientId, selectedMotion.id, {
          ...selectedMotion,
          visibleFields: updatedVisibility,
        });
      } catch (error) {
        console.error('Error updating field visibility:', error);
        setVisibleFields((prev) => ({
          ...prev,
          [selectedMotion.id]: visibleFields[selectedMotion.id],
        }));
      }
    }
  };
  const moveMotion = useCallback((dragIndex, hoverIndex) => {
    setMotions((prevMotions) => {
      const newMotions = [...prevMotions];
      const draggedMotion = newMotions[dragIndex];
      newMotions.splice(dragIndex, 1);
      newMotions.splice(hoverIndex, 0, draggedMotion);
      return newMotions;
    });
  }, []);

  const handleDragEnd = useCallback(async () => {
    const updates = motions.map((motion, index) => ({
      id: motion.id,
      clientId: motion.clientId,
      sequence: index,
    }));

    try {
      await updateMotionSequence(updates);
    } catch (error) {
      console.error('Error updating motion sequences:', error);
      fetchMotions();
    }
  }, [motions]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-8 m-8'>
        <h2 className='text-2xl font-bold mb-4'>MOTION CAMPAIGN</h2>

        {/* Campaign Thumbnails */}
        <div className='grid grid-cols-1 p-8 bg-[#1C1C1C] backdrop-blur-[84px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
          {motions.map((motion, index) => (
            <DraggableMotionItem
              key={motion.id}
              id={motion.id}
              index={index}
              motion={motion}
              moveMotion={moveMotion}
              handleDeleteClick={handleDeleteClick}
              handleMotionClick={handleMotionClick}
              handleDragEnd={handleDragEnd}
            />
          ))}
          <div
            className='flex items-center justify-center bg-zinc-800 h-40 cursor-pointer hover:bg-gray-700 transition-colors'
            onClick={handleAddNew}
          >
            <Plus className='h-8 w-8' />
          </div>
        </div>

        {/* Campaign Details */}
        {selectedMotion && (
          <div className='relative'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold'>CAMPAIGN DETAILS</h3>
              <button
                onClick={() => setSelectedMotion(null)}
                className='bg-white text-black rounded-full p-1'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
            <div className='p-6 bg-[#1C1C1C] backdrop-blur-[84px] grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <video
                  className='w-full h-64 object-cover'
                  controls
                  poster={selectedMotion.thumbnail}
                >
                  <source src={selectedMotion.video} type='video/mp4' />
                </video>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center justify-between border border-white p-2 rounded'>
                  <span>LOGO</span>
                  <img src={selectedMotion.logo} alt='Logo' className='h-8' />
                </div>
                <div className='border border-white p-2 rounded'>
                  <div className='flex items-center justify-between'>
                    <span>TITLE</span>
                    <div>
                      <button
                        onClick={() => setEditingField('text')}
                        className='mr-2'
                      >
                        <Pencil className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                  {editingField === 'text' ? (
                    <input
                      type='text'
                      name='text'
                      value={selectedMotion.text}
                      onChange={handleInputChange}
                      onBlur={handleSave}
                      className='w-full bg-transparent mt-2 focus:outline-none animate-pulse'
                      placeholder='Enter title'
                      autoFocus
                    />
                  ) : (
                    <p
                      className={`mt-2 ${
                        visibleFields[selectedMotion.id]?.['title'] === false
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      {selectedMotion.text}
                    </p>
                  )}
                </div>
                <button
                  className='border border-white p-2 rounded w-full text-left flex items-center justify-between'
                  onClick={() => setShowUploadModal(true)}
                >
                  <span>CHANGE VIDEO</span>
                  <Pencil className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Campaign Credits */}
            <h3 className='text-xl font-bold my-4'>CAMPAIGN CREDITS</h3>
            <div className='p-6 bg-[#1C1C1C] backdrop-blur-[84px] space-y-2'>
              {Object.entries(selectedMotion.credits || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between border border-white p-3 rounded'
                  >
                    <div className='flex items-center flex-row'>
                      <span>{key}:</span>
                      <div className='flex items-center ml-3 space-x-2'>
                        {editingField === `credits.${key}` ? (
                          <input
                            type='text'
                            name={`credits.${key}`}
                            value={value}
                            onChange={handleInputChange}
                            onBlur={() => {
                              handleSave();
                              setEditingField(null);
                            }}
                            className='bg-transparent text-left focus:outline-none animate-pulse'
                            autoFocus
                          />
                        ) : (
                          <span
                            className={`text-gray-400 ${
                              visibleFields[selectedMotion.id]?.[
                                `credits.${key}`
                              ] === false
                                ? 'opacity-50'
                                : ''
                            }`}
                          >
                            {value || 'Click pencil to edit...'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center flex-row gap-2'>
                      <Pencil
                        className='h-4 w-4 cursor-pointer'
                        onClick={() => setEditingField(`credits.${key}`)}
                      />
                      <button
                        onClick={() => toggleFieldVisibility(`credits.${key}`)}
                      >
                        {visibleFields[selectedMotion.id]?.[
                          `credits.${key}`
                        ] === false ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <MotionCampaignModal
          isOpen={showAddCampaignModal}
          onClose={() => setShowAddCampaignModal(false)}
          onAddMotion={fetchMotions}
          clients={clients}
        />

        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          acceptVideo={true}
        />

        <ConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => {
            setShowConfirmationModal(false);
            setMotionToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DndProvider>
  );
};

export default MotionDashboardComponent;
