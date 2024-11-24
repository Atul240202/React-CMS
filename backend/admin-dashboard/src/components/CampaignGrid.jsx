import React, { useState, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ImageCropper from './ImageCropper';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Scissors, Trash2, GripVertical } from 'lucide-react';

export function DraggableImage({
  image,
  index,
  moveImage,
  onCrop,
  onDelete,
  isHovered,
  onHover,
  onLeaveHover,
}) {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'CAMPAIGN_IMAGE',
    item: { id: image.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'CAMPAIGN_IMAGE',
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const getGridSpan = (ratio) => {
    if (ratio > 1.3) return 'col-span-3 row-span-2';
    if (ratio < 0.7) return 'col-span-1 row-span-2';
    return 'col-span-2 row-span-2';
  };

  const getAspectRatio = (ratio) => {
    if (ratio > 1.3) return 'aspect-[16/9]';
    if (ratio < 0.7) return 'aspect-[9/16]';
    return 'aspect-[10/8]';
  };

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`
        group relative overflow-hidden
        ${getGridSpan(image.ratio)}
        ${getAspectRatio(image.ratio)}
        ${isDragging ? 'z-50 opacity-50 rotate-[2deg]' : 'z-0'}
        transition-all duration-200 ease-out
        transform-gpu
        ${
          isDragging
            ? 'scale-105 shadow-2xl'
            : 'scale-100 shadow-md hover:shadow-lg'
        }
        bg-zinc-800
      `}
      onMouseEnter={() => onHover(image.id)}
      onMouseLeave={onLeaveHover}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transformOrigin: isDragging ? '50% 50%' : 'center',
      }}
    >
      <LazyLoadImage
        src={image.url}
        alt=''
        effect='blur'
        className={`
          w-full h-full object-cover
          transition-transform duration-200
          ${isDragging ? 'scale-[1.02]' : ''}
        `}
      />

      <div
        className={`
          absolute inset-0 bg-black
          transition-opacity duration-200
          ${
            isHovered || isDragging
              ? 'bg-opacity-50'
              : 'bg-opacity-0 pointer-events-none'
          }
        `}
      >
        {!isDragging && (
          <div className='absolute top-2 right-2 flex gap-2'>
            <button
              onClick={() => onCrop(image)}
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
        )}

        <div className='absolute bottom-2 right-2 p-2 rounded-full bg-white/10 cursor-grab active:cursor-grabbing hover:bg-white/20 transition-all duration-200'>
          <GripVertical className='w-4 h-4 text-white' />
        </div>

        {isDragging && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='px-3 py-1.5 bg-black/75 rounded-full backdrop-blur-sm'>
              <span className='text-white text-sm font-medium'>
                Release to drop
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CampaignGrid({ images, onReorder, onCrop, onDelete }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);

  const moveImage = useCallback(
    (dragIndex, hoverIndex) => {
      const items = Array.from(images);
      const [reorderedItem] = items.splice(dragIndex, 1);
      items.splice(hoverIndex, 0, reorderedItem);

      const reorderedImages = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      onReorder(reorderedImages);
    },
    [images, onReorder]
  );

  const handleCropComplete = (croppedImage) => {
    if (croppingImage) {
      onCrop(croppingImage.id, croppedImage);
      setCroppingImage(null);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {images.map((image, index) => (
          <DraggableImage
            key={image.id}
            image={image}
            index={index}
            moveImage={moveImage}
            onCrop={setCroppingImage}
            onDelete={onDelete}
            isHovered={hoveredId === image.id}
            onHover={setHoveredId}
            onLeaveHover={() => setHoveredId(null)}
          />
        ))}
      </div>

      {croppingImage && (
        <ImageCropper
          image={croppingImage}
          onComplete={handleCropComplete}
          onCancel={() => setCroppingImage(null)}
        />
      )}
    </DndProvider>
  );
}

export default CampaignGrid;
