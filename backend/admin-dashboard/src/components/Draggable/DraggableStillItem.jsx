import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X, Pencil } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const DraggableStillItem = ({
  id,
  index,
  still,
  moveStill,
  handleDragEnd,
  handleDeleteClick,
  handleStillClick,
  setHoveredStill,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'STILL_ITEM',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        handleDragEnd();
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'STILL_ITEM',
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

      moveStill(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  preview(drop(ref));
  drag(ref);

  return (
    <div
      ref={ref}
      className={`
        relative cursor-move group
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-all duration-200
      `}
      onClick={() => handleStillClick(still)}
      onMouseEnter={() => setHoveredStill(still.id)}
      onMouseLeave={() => setHoveredStill(null)}
    >
      <LazyLoadImage
        src={still.image}
        alt={still.text}
        effect='blur'
        className='w-full h-40 object-cover'
        wrapperClassName='w-full h-40'
      />
      <button
        onClick={(e) => handleDeleteClick(e, still)}
        className='absolute top-2 right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10'
      >
        <X className='h-4 w-4 text-white' />
      </button>
      <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
        <span className='bg-white text-black px-2 py-1 rounded text-sm font-bold'>
          EDIT DETAILS
        </span>
      </div>
      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2'>
        <p className='text-sm'>{still.text}</p>
      </div>
    </div>
  );
};

export default DraggableStillItem;
