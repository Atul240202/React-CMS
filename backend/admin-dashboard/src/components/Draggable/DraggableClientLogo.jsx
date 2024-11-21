import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { X } from 'lucide-react';

const DraggableClientLogo = ({
  id,
  index,
  client,
  moveClientLogo,
  handleRemove,
  handleDragEnd,
}) => {
  const ref = useRef(null);
  const [showRemove, setShowRemove] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'CLIENT_LOGO',
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
    accept: 'CLIENT_LOGO',
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

      moveClientLogo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative aspect-video p-4 flex items-center justify-center ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      onMouseEnter={() => setShowRemove(true)}
      onMouseLeave={() => setShowRemove(false)}
    >
      <img
        src={client.image}
        alt={client.name}
        className='max-w-full max-h-full object-contain'
      />
      {showRemove && (
        <button
          onClick={() => handleRemove(client)}
          className='absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/75'
        >
          <X size={16} className='text-white' />
        </button>
      )}
    </div>
  );
};

export default DraggableClientLogo;
