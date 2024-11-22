import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X } from 'lucide-react';

const DraggableLocationItem = ({
  id,
  index,
  location,
  moveLocation,
  handleLocationClick,
  handleDeleteLocation,
  handleDragEnd,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'LOCATION_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        handleDragEnd();
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'LOCATION_ITEM',
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveLocation(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer group ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => handleLocationClick(location)}
    >
      <img
        src={location.image}
        alt={location.text}
        className='w-full h-40 object-cover'
      />
      <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
        <span className='bg-white text-black px-2 py-1 rounded text-sm font-bold'>
          EDIT DETAILS
        </span>
      </div>
      <button
        className='absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteLocation(location.id);
        }}
      >
        <X className='h-4 w-4 text-white' />
      </button>
      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2'>
        <p className='text-sm text-white'>{location.text}</p>
      </div>
    </div>
  );
};

export default DraggableLocationItem;
