import React, { useState, useEffect, useCallback } from 'react';
// import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { Pencil, Plus, X, Eye, EyeOff, Save } from 'lucide-react';
import UploadModal from './HomepageModals/UploadModal';
import AddCampaignModal from './AddCampaignModal';
import DraggableStillItem from './Draggable/DraggableStillItem';
import {
  getClients,
  getStills,
  updateStill,
  deleteStill,
  updateStillDashboardSequence,
  storage,
} from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CampaignGrid from './CampaignGrid';
import ImageCropper from './ImageCropper';
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-black border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4'>
        <h2 className='text-white text-xl font-bold text-center mb-6'>
          ARE YOU SURE YOU WANT TO REMOVE THIS STILL?
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

const StillDashboardComponent = () => {
  const [stills, setStills] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedStill, setSelectedStill] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [stillToDelete, setStillToDelete] = useState(null);
  const [hoveredStill, setHoveredStill] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [hiddenFields, setHiddenFields] = useState({});
  const [visibleFields, setVisibleFields] = useState({});
  const [croppingImage, setCroppingImage] = useState(null);
  const [newlyAddedImages, setNewlyAddedImages] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  const creditOptions = ['PHOTOGRAPHER', 'BRAND', 'STYLIST', 'CREW MEMBERS'];

  useEffect(() => {
    fetchStills();
    fetchClients();
  }, []);

  const fetchStills = async () => {
    try {
      const fetchedStills = await getStills();
      setStills(fetchedStills);
      // Initialize visibility state based on fetched data
      if (fetchedStills.length > 0) {
        const initialVisibility = {};
        fetchedStills.forEach((still) => {
          initialVisibility[still.id] = still.visibleFields || {};
        });
        setVisibleFields(initialVisibility);
      }
    } catch (error) {
      console.error('Error fetching stills:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleStillClick = (still) => {
    setSelectedStill(still);
    setEditingField(null);
  };

  const handleAddNew = () => {
    setShowAddCampaignModal(true);
  };

  const handleUpload = async (urls, files) => {
    if (selectedStill) {
      try {
        let updatedStillData = { ...selectedStill };
        if (uploadType === 'main') {
          updatedStillData.image = urls[0];
          await updateStill(
            selectedStill.clientId,
            selectedStill.id,
            updatedStillData
          );
        } else if (uploadType === 'grid') {
          console.log('handle upload still dashboard files', files);
          const newImages = await Promise.all(
            files.map(async (file, index) => {
              console.log('handle upload still dashboard', file);
              const img = new Image();
              img.src = URL.createObjectURL(file);
              await new Promise((resolve) => {
                img.onload = resolve;
              });
              return {
                id: `${Date.now()}-${index}`,
                url: urls[index],
                ratio: img.width / img.height,
                order: updatedStillData.internalImages.length + index,
              };
            })
          );
          updatedStillData.internalImages = [
            ...updatedStillData.internalImages,
            ...newImages,
          ];
          setNewlyAddedImages([...newlyAddedImages, ...newImages]);
          setShowSaveButton(true);
        }
        setSelectedStill(updatedStillData);
      } catch (error) {
        console.error('Error updating still:', error);
      }
    }
    setShowUploadModal(false);
  };

  const handleDeleteClick = (e, still) => {
    e.stopPropagation();
    setStillToDelete(still);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (stillToDelete) {
      try {
        await deleteStill(stillToDelete.clientId, stillToDelete.id);
        setStills(stills.filter((s) => s.id !== stillToDelete.id));
        if (selectedStill && selectedStill.id === stillToDelete.id) {
          setSelectedStill(null);
        }
      } catch (error) {
        console.error('Error deleting still:', error);
      } finally {
        setShowDeleteModal(false);
        setStillToDelete(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('credits.')) {
      const creditKey = name.split('.')[1];
      setSelectedStill((prev) => ({
        ...prev,
        credits: { ...prev.credits, [creditKey]: value },
      }));
    } else {
      setSelectedStill((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const updatedStill = await updateStill(
        selectedStill.clientId,
        selectedStill.id,
        {
          ...selectedStill,
          visibleFields: visibleFields[selectedStill.id] || {},
        }
      );
      setStills(
        stills.map((s) => (s.id === updatedStill.id ? updatedStill : s))
      );
      setEditingField(null);
    } catch (error) {
      console.error('Error saving still:', error);
    }
  };

  const handleGridReorder = (reorderedImages) => {
    setSelectedStill((prev) => ({
      ...prev,
      internalImages: reorderedImages,
    }));
    setShowSaveButton(true);
  };

  const handleGridCrop = (id, croppedImage) => {
    console.log('handleGrid cropped image', croppedImage);
    setCroppingImage({ id, image: croppedImage });
  };

  const handleCropComplete = async (id, croppedFile) => {
    if (croppingImage) {
      try {
        // const formData = new FormData();
        // formData.append('file', croppedFile);
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const { url } = await response.json();
        const storageRef = ref(storage, `stills/${id}/grid_${Date.now()}`);
        await uploadBytes(storageRef, croppedFile);
        const url = await getDownloadURL(storageRef);
        console.log('cropped image url', url);
        setSelectedStill((prev) => ({
          ...prev,
          internalImages: prev.internalImages.map((img) =>
            img.id === croppingImage.id ? { ...img, url } : img
          ),
        }));
        setShowSaveButton(true);
      } catch (error) {
        console.error('Error uploading cropped image:', error);
      } finally {
        setCroppingImage(null);
      }
    }
  };

  const handleGridDelete = (id) => {
    setSelectedStill((prev) => ({
      ...prev,
      internalImages: prev.internalImages.filter((img) => img.id !== id),
    }));
    setShowSaveButton(true);
  };

  const handleSaveChanges = async () => {
    try {
      await updateStill(selectedStill.clientId, selectedStill.id, {
        ...selectedStill,
        visibleFields: visibleFields[selectedStill.id] || {},
      });
      setNewlyAddedImages([]);
      setShowSaveButton(false);
      fetchStills();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleAddCredit = (creditType) => {
    if (creditType === 'CREW MEMBERS') {
      const newKey = `CREW MEMBER ${
        Object.keys(selectedStill.credits).filter((k) =>
          k.startsWith('CREW MEMBER')
        ).length + 1
      }`;
      setSelectedStill((prev) => ({
        ...prev,
        credits: { ...prev.credits, [newKey]: '' },
      }));
    } else {
      setSelectedStill((prev) => ({
        ...prev,
        credits: { ...prev.credits, [creditType]: '' },
      }));
    }
    setShowCreditDropdown(false);
    handleSave();
  };

  const handleRemoveCredit = (creditKey) => {
    setSelectedStill((prev) => {
      const newCredits = { ...prev.credits };
      delete newCredits[creditKey];
      return { ...prev, credits: newCredits };
    });
    handleSave();
  };

  const toggleFieldVisibility = async (field) => {
    if (selectedStill) {
      const updatedVisibility = {
        ...visibleFields[selectedStill.id],
        [field]: !visibleFields[selectedStill.id]?.[field],
      };

      setVisibleFields((prev) => ({
        ...prev,
        [selectedStill.id]: updatedVisibility,
      }));

      try {
        // Update the still in Firestore
        await updateStill(selectedStill.clientId, selectedStill.id, {
          ...selectedStill,
          visibleFields: updatedVisibility,
        });
      } catch (error) {
        console.error('Error updating field visibility:', error);
        // Revert the local state if the update fails
        setVisibleFields((prev) => ({
          ...prev,
          [selectedStill.id]: visibleFields[selectedStill.id],
        }));
      }
    }
  };

  const moveStill = useCallback((dragIndex, hoverIndex) => {
    setStills((prevStills) => {
      const newStills = [...prevStills];
      const draggedStill = newStills[dragIndex];
      newStills.splice(dragIndex, 1);
      newStills.splice(hoverIndex, 0, draggedStill);
      return newStills;
    });
  }, []);

  const handleDragEnd = async () => {
    const updates = stills.map((item, index) => ({
      id: item.id,
      clientId: item.clientId,
      sequence: index,
    }));

    try {
      await updateStillDashboardSequence(updates);
    } catch (error) {
      console.error('Error updating still sequences:', error);
      fetchStills();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-8 m-8'>
        <h2 className='text-2xl font-extrabold mb-4'>STILL CAMPAIGN</h2>

        <div className='grid grid-cols-1 p-8 bg-[#1C1C1C] backdrop-blur-[84px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
          {stills.map((still, index) => (
            <DraggableStillItem
              key={still.id}
              id={still.id}
              index={index}
              still={still}
              moveStill={moveStill}
              handleDragEnd={handleDragEnd}
              handleDeleteClick={handleDeleteClick}
              handleStillClick={handleStillClick}
              setHoveredStill={setHoveredStill}
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
        {selectedStill && (
          <div className='relative'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-2xl font-extrabold'>CAMPAIGN DETAILS</h3>
              <button
                onClick={() => setSelectedStill(null)}
                className='bg-white text-black rounded-full p-1'
              >
                <X className='h-4 w-4' />
              </button>
            </div>

            <div className='p-6 bg-[#1C1C1C] backdrop-blur-[84px] grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <img
                  src={selectedStill.image}
                  alt='Campaign'
                  className='w-full h-64 object-cover'
                  loading='lazy'
                />
              </div>
              <div className='space-y-4'>
                <div className='flex items-center justify-between border border-white p-2 rounded'>
                  <span className='font-extrabold text-lg'>LOGO</span>
                  <div className='flex flex-row'>
                    <img
                      src={selectedStill.logo}
                      alt='Logo'
                      className='h-8'
                      loading='lazy'
                    />
                  </div>
                </div>
                <div className='border border-white p-2 rounded'>
                  <div className='flex items-center justify-between'>
                    <span className='font-extrabold text-lg'>TITLE</span>
                    <div>
                      <button
                        onClick={() => setEditingField('teaxt')}
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
                      value={selectedStill.text}
                      onChange={handleInputChange}
                      onBlur={handleSave}
                      className='w-full bg-transparent mt-2 focus:outline-none'
                      placeholder='Enter title'
                      autoFocus
                    />
                  ) : (
                    <p
                      className={`mt-2 ${
                        hiddenFields['title'] ? 'opacity-50' : ''
                      }`}
                    >
                      {selectedStill.text}
                    </p>
                  )}
                </div>
                <button
                  className='border border-white font-extrabold text-lg p-2 rounded w-full text-left flex items-center justify-between'
                  onClick={() => {
                    setUploadType('main');
                    setShowUploadModal(true);
                  }}
                >
                  <span>CHANGE PICTURE</span>
                  <Pencil className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Campaign Grid */}
            <h3 className='text-2xl font-extrabold mb-4 mt-8'>CAMPAIGN GRID</h3>
            <div className='p-6 bg-[#1C1C1C] backdrop-blur-[84px]'>
              <CampaignGrid
                images={selectedStill.internalImages}
                onReorder={handleGridReorder}
                onCrop={handleCropComplete}
                onDelete={handleGridDelete}
              />
              <button
                className='mt-4 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 h-32 w-full cursor-pointer'
                onClick={() => {
                  setUploadType('grid');
                  setShowUploadModal(true);
                }}
              >
                <Plus className='h-8 w-8' />
              </button>
            </div>
            {/* Campaign Credits */}
            <h3 className='text-2xl font-extrabold mb-4 mt-8'>
              CAMPAIGN CREDITS
            </h3>
            <div className='p-6 bg-[#1C1C1C] backdrop-blur-[84px] space-y-2'>
              <div className='flex flex-row items-center border border-white p-2 rounded'>
                <span className='text-white text-xl font-extrabold'>
                  CLIENT :{' '}
                </span>
                <div className='text-lg font-bold ml-4'>
                  {clients.find(
                    (client) => client.id === selectedStill.clientId
                  )?.name || 'Unknown Client'}
                </div>
              </div>

              {Object.entries(selectedStill.credits).map(([key, value]) => (
                <div
                  key={key}
                  className='flex items-center justify-between border border-white p-3 rounded'
                >
                  <div className='flex items-center flex-row'>
                    <span className='text-white text-xl font-extrabold'>
                      {key} :
                    </span>
                    <div className='flex items-center ml-3 text-lg font-medium  space-x-2'>
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
                          className='bg-transparent text-left focus:outline-none'
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`text-white font-medium text-xl ${
                            hiddenFields[`credits.${key}`] ? 'opacity-50' : ''
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
                    {key !== 'PRODUCT TITLE' && (
                      <button
                        onClick={() => toggleFieldVisibility(`credits.${key}`)}
                      >
                        {visibleFields[selectedStill.id]?.[`credits.${key}`] ===
                        false ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className='relative'>
                <button
                  className='flex items-center space-x-2 w-1/6 border border-white px-4 py-2 rounded justify-between'
                  onClick={() => setShowCreditDropdown(!showCreditDropdown)}
                >
                  <span className='font-extrabold text-xl'>ADD</span>
                  <Plus className='h-4 w-4' />
                </button>
                {showCreditDropdown && (
                  <div className='absolute top-full left-0 w-1/6 bg-white text-black mt-1 rounded shadow-lg'>
                    {creditOptions.map((option) => (
                      <button
                        key={option}
                        className='block w-full text-left px-4 py-2 font-bold hover:bg-black hover:text-white'
                        onClick={() => handleAddCredit(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showSaveButton && (
          <div className='fixed bottom-4 right-4'>
            <button
              onClick={handleSaveChanges}
              className='flex items-center gap-2 px-4 py-2 mr-6 bg-black border border-white text-white rounded hover:bg-zinc-800 transition-colors'
            >
              <Save className='h-4 w-4' />
              Save Changes
            </button>
          </div>
        )}

        <AddCampaignModal
          isOpen={showAddCampaignModal}
          onClose={() => setShowAddCampaignModal(false)}
          onAddStill={fetchStills}
          clients={clients}
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
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setStillToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        {/* {croppingImage && (
          <ImageCropper
            image={croppingImage.image}
            onComplete={handleCropComplete}
            onCancel={() => setCroppingImage(null)}
          />
        )} */}
      </div>
    </DndProvider>
  );
};

export default StillDashboardComponent;
