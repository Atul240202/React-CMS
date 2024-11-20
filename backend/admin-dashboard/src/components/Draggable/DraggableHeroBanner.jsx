import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X, Edit2 } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const DraggableHeroBanner = ({
  id,
  src,
  index,
  moveHeroBanner,
  onRemove,
  onEdit,
}) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'HERO_BANNER',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'HERO_BANNER',
    hover: (item, monitor) => {
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

      moveHeroBanner(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`
        relative group h-60 overflow-hidden
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${isOver ? 'ring-2 ring-blue-500' : ''}
        transition-all duration-200
      `}
      style={{ cursor: 'move' }}
    >
      <LazyLoadImage
        src={src}
        alt={`Hero banner ${index + 1}`}
        effect='blur'
        className='w-full h-full object-cover'
        wrapperClassName='w-full h-full'
      />
      <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200'>
        <div className='absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id);
            }}
            className='p-2 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
            aria-label='Edit banner'
          >
            <Edit2 className='h-4 w-4 text-white' />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(id);
            }}
            className='p-2 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
            aria-label='Remove banner'
          >
            <X className='h-4 w-4 text-white' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableHeroBanner;
