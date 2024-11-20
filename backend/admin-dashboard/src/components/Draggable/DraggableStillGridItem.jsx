'use client';

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';

export default function DraggableStillGridItem({
  id,
  image,
  index,
  moveStillGridItem,
  isPortrait,
  urlForSpecificStillPage,
  productTitle,
}) {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'STILL_GRID_PAIR',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'STILL_GRID_PAIR',
    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveStillGridItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  if (!image) {
    return (
      <div
        ref={ref}
        className={`${
          isPortrait ? 'w-[15%]' : 'w-[25%]'
        } bg-zinc-800 rounded-lg ${isDragging ? 'opacity-50' : ''}`}
      />
    );
  }

  return (
    <Link
      to={urlForSpecificStillPage}
      ref={ref}
      className={`block ${
        isPortrait ? 'w-[15%]' : 'w-[25%]'
      } rounded-lg overflow-hidden ${isDragging ? 'opacity-50' : ''}`}
    >
      <LazyLoadImage
        src={image}
        alt={productTitle}
        effect='blur'
        className='w-full h-full object-cover'
      />
    </Link>
  );
}
