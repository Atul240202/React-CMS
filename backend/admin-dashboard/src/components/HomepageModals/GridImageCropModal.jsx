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

    // Log original image size
    fetch(imageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        console.log(
          'Original Image Size:',
          (blob.size / 1024).toFixed(2),
          'KB'
        );
      });
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    // Create a high-resolution canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('No 2d context');
      return;
    }

    // Set the canvas size to match the original image dimensions for the crop area
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    // Use the scaled dimensions to maintain original resolution
    canvas.width = Math.floor(completedCrop.width * scaleX);
    canvas.height = Math.floor(completedCrop.height * scaleY);

    // Configure canvas for maximum quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the cropped image at full resolution
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Create a high-quality blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas to Blob failed');
          return;
        }

        console.log('Cropped Image Size:', (blob.size / 1024).toFixed(2), 'KB');

        // Create file with original image type if possible
        const originalType =
          imgRef.current?.src.match(/^data:([^;]+);/)?.[1] || 'image/jpeg';
        const croppedFile = new File(
          [blob],
          `locationMainImg-${Date.now()}.${originalType.split('/')[1]}`,
          {
            type: originalType,
          }
        );

        onCropComplete(croppedFile);
      },
      imgRef.current.src.startsWith('data:image/png')
        ? 'image/png'
        : 'image/jpeg',
      1.0 // Maximum quality (1.0)
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center'>
      <div className='bg-white dark:bg-gray-900 p-6 w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold dark:text-white'>
            Crop Image (16:9)
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='flex flex-col items-center'>
          <div className='relative w-full max-h-[60vh] overflow-hidden'>
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
                alt='Image to crop'
                loading='lazy'
              />
            </ReactCrop>
          </div>

          <div className='mt-6 flex justify-end w-full space-x-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
            >
              Cancel
            </button>
            <button
              onClick={handleCropComplete}
              className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors'
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
