'use client';

import React, { useState } from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import DraggableStillGridItem from '../Draggable/DraggableStillGridItem';
import StillUploadModal from '../HomepageModals/StillUploadModal';
import ImageCropModal from '../HomepageModals/ImageCropModal';
import {
  updateStillGridItemOrder,
  deleteStillGridItem,
  addStillGridItem,
} from '../../firebase';

export default function StillGridSection({
  stills,
  stillGridSize,
  setStillGridSize,
  setData,
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedProductTitle, setSelectedProductTitle] = useState(null);
  const [isPortrait, setIsPortrait] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);

  const moveStillGridPair = async (dragIndex, hoverIndex) => {
    const newStills = [...stills];
    const draggedItems = newStills.slice(dragIndex * 2, dragIndex * 2 + 2);
    newStills.splice(dragIndex * 2, 2);
    newStills.splice(hoverIndex * 2, 0, ...draggedItems);

    newStills.forEach((item, index) => {
      item.rowOrder = index;
    });

    setData((prevData) => ({ ...prevData, homeStills: newStills }));
    await updateStillGridItemOrder(newStills);
  };

  const handleUpload = (imageUrl, clientId, productTitle, isPortrait) => {
    setSelectedImage(imageUrl);
    setSelectedClientId(clientId);
    setSelectedProductTitle(productTitle);
    setIsPortrait(isPortrait);
    setShowUploadModal(false);
    setShowCropModal(true);
  };

  const handleCropComplete = async (croppedImageUrl) => {
    try {
      const newStill = await addStillGridItem(
        selectedClientId,
        selectedProductTitle,
        croppedImageUrl,
        isPortrait
      );
      setData((prevData) => ({
        ...prevData,
        homeStills: [...prevData.homeStills, newStill],
      }));
      setShowCropModal(false);
    } catch (error) {
      console.error('Error adding still grid item:', error);
    }
  };

  const handleEdit = (itemId) => {
    const itemToEdit = stills.find((item) => item.id === itemId);
    if (itemToEdit) {
      setSelectedImage(itemToEdit.image);
      setSelectedClientId(itemToEdit.clientId);
      setSelectedProductTitle(itemToEdit.productTitle);
      setIsPortrait(itemToEdit.isPortrait);
      setEditingItemId(itemId);
      setShowCropModal(true);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteStillGridItem(itemId);
      setData((prevData) => ({
        ...prevData,
        homeStills: prevData.homeStills.filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error('Error deleting still grid item:', error);
    }
  };

  const rows = Math.ceil(stillGridSize / 2);

  return (
    <section className='space-y-8 py-8 bg-black'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold tracking-wider text-white'>
          STILL GRID
        </h2>
        <select
          value={stillGridSize}
          onChange={(e) => setStillGridSize(Number(e.target.value))}
          className='px-4 py-2 bg-zinc-800 text-white focus:outline-none'
        >
          {[2, 4, 6, 8].map((size) => (
            <option key={size} value={size}>
              GRID {size.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>

      <div className='space-y-6'>
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const startIndex = rowIndex * 2;
          const rowStills = stills.slice(startIndex, startIndex + 2);
          const showEmptyFrames =
            rowStills.length < 2 && stills.length < stillGridSize;

          return (
            <div
              key={rowIndex}
              className='flex gap-4'
              style={{ height: '200px' }}
            >
              {rowStills.map((still, index) => (
                <div key={still?.id || `empty-${index}`} className='relative'>
                  <DraggableStillGridItem
                    {...still}
                    index={Math.floor((startIndex + index) / 2)}
                    moveStillGridItem={moveStillGridPair}
                    isPortrait={index === 0}
                  />
                  <button
                    onClick={() => handleEdit(still.id)}
                    className='absolute top-2 left-2 bg-blue-500 p-1 rounded-full'
                  >
                    <Pencil className='h-4 w-4 text-white' />
                  </button>
                  <button
                    onClick={() => handleDelete(still.id)}
                    className='absolute top-2 right-2 bg-red-500 p-1 rounded-full'
                  >
                    <X className='h-4 w-4 text-white' />
                  </button>
                </div>
              ))}

              {showEmptyFrames && (
                <>
                  {rowStills.length === 0 && (
                    <button
                      onClick={() => {
                        setIsPortrait(true);
                        setShowUploadModal(true);
                      }}
                      className='w-[15%] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
                    >
                      <Plus className='h-8 w-8 text-white' />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsPortrait(false);
                      setShowUploadModal(true);
                    }}
                    className='w-[25%] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
                  >
                    <Plus className='h-8 w-8 text-white' />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <StillUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        isPortrait={isPortrait}
      />

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setEditingItemId(null);
        }}
        imageUrl={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={isPortrait ? 3 / 4 : 4 / 3}
        editingItemId={editingItemId}
      />
    </section>
  );
}
