import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Scissors, Trash2 } from 'lucide-react';
import ImageCropper from './ImageCropper';

function CampaignGrid({ images, onReorder, onCrop, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);

  const getGridSpan = (ratio) => {
    if (ratio > 1.3) return 'col-span-2 row-span-1'; // landscape 16:9
    if (ratio < 0.7) return 'col-span-1 row-span-2'; // portrait 9:16
    return 'col-span-1 row-span-1'; // square 1:1
  };

  const getAspectRatio = (ratio) => {
    if (ratio > 1.3) return 'aspect-[16/9]';
    if (ratio < 0.7) return 'aspect-[9/16]';
    return 'aspect-square';
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for each image
    const reorderedImages = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onReorder(reorderedImages);
  };

  const handleCropComplete = (croppedImage) => {
    console.log('Campaign grid', croppedImage);
    if (croppingImage) {
      onCrop(croppingImage.id, croppedImage);
      setCroppingImage(null);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='campaign-grid' direction='horizontal'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                        group relative overflow-hidden
                        ${getGridSpan(image.ratio)}
                        ${getAspectRatio(image.ratio)}
                        ${
                          snapshot.isDragging
                            ? 'ring-2 ring-blue-500 shadow-lg z-50'
                            : ''
                        }
                        transition-all duration-200 ease-in-out
                        transform ${
                          snapshot.isDragging ? 'scale-105' : 'scale-100'
                        }
                        cursor-grab active:cursor-grabbing
                        bg-zinc-800
                      `}
                      onMouseEnter={() => setHoveredId(image.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <img
                        src={image.url}
                        alt=''
                        className='w-full h-full object-cover'
                        loading='lazy'
                        crossOrigin='anonymous'
                      />

                      {hoveredId === image.id && (
                        <div className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-200'>
                          <div className='absolute top-2 right-2 flex gap-2'>
                            <button
                              onClick={() => setCroppingImage(image)}
                              className='p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-200'
                              title='Crop image'
                            >
                              <Scissors className='w-4 h-4 text-white' />
                            </button>
                            <button
                              onClick={() => onDelete(image.id)}
                              className='p-2 bg-red-500 bg-opacity-75 hover:bg-opacity-100 rounded-full transition-all duration-200'
                              title='Delete image'
                            >
                              <Trash2 className='w-4 h-4 text-white' />
                            </button>
                          </div>
                          <div className='absolute bottom-2 right-2'>
                            <GripVertical className='w-4 h-4 text-white opacity-50' />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {croppingImage && (
        <ImageCropper
          image={croppingImage}
          onComplete={handleCropComplete}
          onCancel={() => setCroppingImage(null)}
        />
      )}
    </>
  );
}

export default CampaignGrid;
