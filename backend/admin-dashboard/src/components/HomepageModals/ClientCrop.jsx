import React, { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import { ClipLoader } from 'react-spinners';
import 'react-image-crop/dist/ReactCrop.css';

export default function ClientCrop({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
}) {
  const [crop, setCrop] = useState({ unit: '%', width: 100, height: 100 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onImageLoad = useCallback((img) => {
    setImageRef(img);
  }, []);

  const createCroppedImage = useCallback(async () => {
    if (!imageRef || !completedCrop?.width || !completedCrop?.height) {
      return;
    }

    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      // Configure canvas for maximum quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      ctx.drawImage(
        imageRef,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/png',
          1
        );
      });

      const file = new File([blob], `client-logo-${Date.now()}.png`, {
        type: 'image/png',
      });
      console.log('cropped logo file', file);
      const croppedImageUrl = URL.createObjectURL(blob);
      onCropComplete(file, croppedImageUrl);
    } catch (error) {
      console.error('Error creating cropped image:', error);
      alert('An error occurred while processing the image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [imageRef, completedCrop, onCropComplete]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50'>
      <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-white'>Crop Client Logo</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='relative max-h-[70vh] overflow-auto'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className='max-w-full'
          >
            <img
              src={imageUrl}
              onLoad={(e) => onImageLoad(e.currentTarget)}
              alt='Crop preview'
              className='max-w-full max-h-[70vh] object-contain'
              crossOrigin='anonymous'
              loading='lazy'
            />
          </ReactCrop>
        </div>

        <div className='flex justify-end mt-6 space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-white'
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={createCroppedImage}
            className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-white flex items-center'
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <ClipLoader size={16} color='#ffffff' className='mr-2' />
                Processing...
              </>
            ) : (
              'Apply Crop'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
