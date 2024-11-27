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
    const newStills = [...stills];
    const draggedItems = newStills.slice(dragIndex * 2, dragIndex * 2 + 2);
    newStills.splice(dragIndex * 2, 2);
    newStills.splice(hoverIndex * 2, 0, ...draggedItems);

    newStills.forEach((item, index) => {
      item.rowOrder = Math.floor(index / 2);
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

  const handleUpload = (imageUrl, clientId, productTitle, isPortrait) => {
    setSelectedImage(imageUrl);
    setSelectedClientId(clientId);
    setSelectedProductTitle(productTitle);
    setIsPortrait(isPortrait);
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
          isPortrait
        );
        setStills([...stills, newStill]);
      }
      setShowCropModal(false);
    } catch (error) {
      console.error('Error adding/updating home still:', error);
      toast.error('Failed to add/update still');
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
      console.error('Error deleting home still:', error);
      toast.error('Failed to delete still');
    }
  };

  const rows = Math.ceil(stillGridSize / 2);

  return (
    <section className='space-y-8 py-8 bg-black'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-extrabold tracking-wider text-white'>
          STILL GRID
        </h2>
        <select
          value={stillGridSize}
          onChange={(e) => handleGridSizeChange(Number(e.target.value))}
          className='px-4 py-2 bg-zinc-800 text-white focus:outline-none'
        >
          {[2, 4, 6, 8].map((size) => (
            <option key={size} value={size}>
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
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='grid grid-cols-2 gap-4'
              >
                {Array.from({ length: rows }).map((_, rowIndex) => {
                  const startIndex = rowIndex * 2;
                  const rowStills = stills.slice(startIndex, startIndex + 2);
                  const showEmptyFrames =
                    rowStills.length < 2 && stills.length < stillGridSize;

                  return (
                    <div key={rowIndex} className='flex gap-4'>
                      {rowStills.map((still, index) => (
                        <Draggable
                          key={still.id}
                          draggableId={still.id}
                          index={startIndex + index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`relative group ${
                                index === 0
                                  ? 'aspect-w-9 aspect-h-16 '
                                  : 'aspect-w-16 aspect-h-9'
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
                                <>
                                  <button
                                    onClick={() => handleEdit(still.id)}
                                    className='absolute top-2 right-12 bg-blue-500 p-1 rounded-full'
                                  >
                                    <Pencil className='h-4 w-4 text-white' />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(still.id)}
                                    className='absolute top-2 right-2 bg-red-500 p-1 rounded-full'
                                  >
                                    <X className='h-4 w-4 text-white' />
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {showEmptyFrames && (
                        <>
                          {rowStills.length === 0 && (
                            <button
                              onClick={() => {
                                setIsPortrait(true);
                                setShowUploadModal(true);
                              }}
                              className='aspect-w-9 aspect-h-16 max-h-[70%] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
                            >
                              <Plus className='h-8 w-8 text-white' />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsPortrait(false);
                              setShowUploadModal(true);
                            }}
                            className='aspect-w-16 aspect-h-9 max-w-[30%] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
                          >
                            <Plus className='h-8 w-8 text-white' />
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
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
