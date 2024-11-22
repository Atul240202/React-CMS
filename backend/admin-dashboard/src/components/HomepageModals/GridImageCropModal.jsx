import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { X } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const GridImageCropModal = ({ isOpen, onClose, imageUrl, onCropComplete }) => {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, 16 / 9);
    setCrop(crop);
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedFile = new File(
        [blob],
        `locationMainImg-${Date.now()}.png`,
        {
          type: 'image/png',
        }
      );
      onCropComplete(croppedFile);
    }, 'image/png');
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center'>
      <div className='bg-gray-900 rounded-lg p-6 w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>Crop Image (16:9)</h2>
          <button onClick={onClose}>
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='flex flex-col items-center'>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={16 / 9}
            className='max-h-[60vh]'
          >
            <img
              ref={imgRef}
              src={imageUrl}
              onLoad={onImageLoad}
              crossOrigin='anonymous'
              className='max-w-full max-h-[60vh] object-contain'
            />
          </ReactCrop>

          <div className='mt-6 flex justify-end w-full space-x-2'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded bg-gray-800 hover:bg-gray-700'
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700'
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridImageCropModal;
