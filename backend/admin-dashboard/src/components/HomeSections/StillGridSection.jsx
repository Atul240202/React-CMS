import React, { useState, useEffect } from 'react';
import { Plus, Pencil, X } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import StillUploadModal from '../HomepageModals/StillUploadModal';
import ImageCropModal from '../HomepageModals/ImageCropModal';
import {
  getHomeStills,
  updateHomeStillOrder,
  deleteHomeStill,
  addHomeStill,
  updateHomeStillGridSize,
} from '../../firebase';
import toast from 'react-hot-toast';

const TOTAL_FRAMES = 8;
const FRAMES_PER_ROW = 4;

export default function StillGridSection() {
  const [stills, setStills] = useState([]);
  const [stillGridSize, setStillGridSize] = useState(2);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedProductTitle, setSelectedProductTitle] = useState(null);
  const [isPortrait, setIsPortrait] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [frameIndex, setFrameIndex] = useState(null);

  useEffect(() => {
    fetchStills();
  }, []);

  const fetchStills = async () => {
    try {
      const stillsData = await getHomeStills();
      setStills(stillsData);
    } catch (error) {
      console.error('Error fetching home stills:', error);
      toast.error('Failed to load stills');
    }
  };

  const handleGridSizeChange = async (size) => {
    setStillGridSize(size);
    try {
      await updateHomeStillGridSize(size);
      fetchStills();
    } catch (error) {
      console.error('Error updating grid size:', error);
      toast.error('Failed to update grid size');
    }
  };

  const moveStillGridPair = async (dragIndex, hoverIndex) => {
    if (dragIndex === hoverIndex) return;

    const newStills = [...stills];
    const [draggedItem] = newStills.splice(dragIndex, 1);
    newStills.splice(hoverIndex, 0, draggedItem);

    newStills.forEach((item, index) => {
      item.rowOrder = Math.floor(index / FRAMES_PER_ROW);
    });

    setStills(newStills);
    try {
      await updateHomeStillOrder(newStills);
    } catch (error) {
      console.error('Error updating still order:', error);
      toast.error('Failed to update still order');
      fetchStills();
    }
  };

  const handleUpload = (
    imageUrl,
    clientId,
    productTitle,
    isPortrait,
    index
  ) => {
    setSelectedImage(imageUrl);
    setSelectedClientId(clientId);
    setSelectedProductTitle(productTitle);
    setIsPortrait(isPortrait);
    setFrameIndex(index);
    setShowUploadModal(false);
    setShowCropModal(true);
  };

  const handleCropComplete = async (itemId, file) => {
    try {
      if (itemId) {
        const updatedStill = await updateHomeStill(itemId, {
          image: file,
          clientId: selectedClientId,
          productTitle: selectedProductTitle,
          isPortrait: isPortrait,
        });
        setStills(
          stills.map((still) => (still.id === itemId ? updatedStill : still))
        );
      } else {
        const newStill = await addHomeStill(
          selectedClientId,
          selectedProductTitle,
          file,
          isPortrait,
          frameIndex
        );
        setStills([...stills, newStill]);
      }
      setShowCropModal(false);
    } catch (error) {
      console.error('Error processing still:', error);
      toast.error('Failed to process still');
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
      await deleteHomeStill(itemId);
      setStills(stills.filter((item) => item.id !== itemId));
      toast.success('Still deleted successfully');
    } catch (error) {
      console.error('Error deleting still:', error);
      toast.error('Failed to delete still');
    }
  };

  const isPortraitFrame = (index) => {
    const position = index % FRAMES_PER_ROW;
    return position === 1 || position === 2;
  };

  const renderFrame = (index) => {
    const still = stills[index];
    const isPortrait = isPortraitFrame(index);
    const canUpload = index < stillGridSize;

    if (still) {
      return (
        <Draggable key={still.id} draggableId={still.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={`relative group ${
                isPortrait
                  ? 'aspect-[9/16] w-[calc(50%-0.5rem)]'
                  : 'aspect-[16/9] w-full'
              } ${snapshot.isDragging ? 'opacity-50' : ''}`}
              onMouseEnter={() => setHoveredItemId(still.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              <LazyLoadImage
                src={still.image}
                alt={still.productTitle}
                effect='blur'
                className='w-full h-full object-cover'
              />
              {hoveredItemId === still.id && (
                <div className='absolute top-2 right-2 flex space-x-2'>
                  <button
                    onClick={() => handleEdit(still.id)}
                    className='bg-black border border-white p-1 rounded-full hover:bg-zinc-800 '
                  >
                    <Pencil className='h-4 w-4 text-white' />
                  </button>
                  <button
                    onClick={() => handleDelete(still.id)}
                    className='bg-black border border-white p-1 rounded-full hover:bg-zinc-800'
                  >
                    <X className='h-4 w-4 text-white' />
                  </button>
                </div>
              )}
            </div>
          )}
        </Draggable>
      );
    }

    return canUpload ? (
      <button
        onClick={() => {
          setIsPortrait(isPortrait);
          setFrameIndex(index);
          setShowUploadModal(true);
        }}
        className={`${
          isPortrait
            ? 'aspect-[9/16] w-[calc(50%-0.5rem)]'
            : 'aspect-[16/9] w-full'
        } bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors`}
        disabled={!canUpload}
      >
        <Plus className='h-8 w-8 text-white' />
      </button>
    ) : (
      <div
        className={`${
          isPortrait
            ? 'aspect-[9/16] w-[calc(50%-0.5rem)]'
            : 'aspect-[16/9] w-full'
        } bg-zinc-900 flex items-center justify-center`}
      />
    );
  };

  const renderRow = (rowIndex) => {
    const startIndex = rowIndex * FRAMES_PER_ROW;
    return (
      <div key={rowIndex} className='flex gap-4 mb-4'>
        <div className='w-1/3'>
          {renderFrame(startIndex)} {/* Landscape */}
        </div>
        <div className='w-1/3 flex gap-4'>
          {renderFrame(startIndex + 1)} {/* Portrait */}
          {renderFrame(startIndex + 2)} {/* Portrait */}
        </div>
        <div className='w-1/3'>
          {renderFrame(startIndex + 3)} {/* Landscape */}
        </div>
      </div>
    );
  };

  return (
    <section className='space-y-4 py-8 bg-black'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-2xl font-extrabold tracking-wider text-white'>
          STILL GRID
        </h2>
        <select
          value={stillGridSize}
          onChange={(e) => handleGridSizeChange(Number(e.target.value))}
          className='px-4 py-2 bg-zinc-800 text-white focus:outline-none'
        >
          {[2, 4, 6, 8].map((size) => (
            <option
              key={size}
              value={size}
              className='hover:text-white hover:bg-black '
            >
              GRID {size.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>

      <div className='p-8 bg-[#1C1C1C] backdrop-blur-[84px] mb-8'>
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            moveStillGridPair(result.source.index, result.destination.index);
          }}
        >
          <Droppable droppableId='stillGrid'>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {[0, 1].map((rowIndex) => renderRow(rowIndex))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <StillUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        isPortrait={isPortrait}
        frameIndex={frameIndex}
      />

      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          setEditingItemId(null);
        }}
        imageUrl={selectedImage}
        onCropComplete={handleCropComplete}
        aspectRatio={isPortrait ? 9 / 16 : 16 / 9}
        editingItemId={editingItemId}
        component='still'
      />
    </section>
  );
}
