import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X, Pencil } from 'lucide-react';

const DraggableMotionItem = ({
  id,
  index,
  motion,
  moveMotion,
  handleDeleteClick,
  handleMotionClick,
  handleDragEnd,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'MOTION_ITEM',
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
    accept: 'MOTION_ITEM',
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

      moveMotion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative cursor-move group ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onClick={() => handleMotionClick(motion)}
    >
      <video className='w-full h-40 object-cover' poster={motion.thumbnail}>
        <source src={motion.video} type='video/mp4' />
      </video>
      <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2'>
        <p className='text-sm'>{motion.text}</p>
      </div>
      <button
        className='absolute top-2 right-2 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10'
        onClick={(e) => handleDeleteClick(e, motion)}
      >
        <X className='h-4 w-4 text-white' />
      </button>
      <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity'>
        <span className='bg-white text-black px-2 py-1 rounded flex items-center'>
          <Pencil className='h-4 w-4 mr-1' /> EDIT DETAILS
        </span>
      </div>
    </div>
  );
};

export default DraggableMotionItem;
