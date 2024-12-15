import React, { useState, useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper({ image, onComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const imgRef = useRef(null);
  const [error, setError] = useState(null);

  const getCropRatio = () => {
    if (image.ratio > 1.3) return 16 / 9;
    if (image.ratio < 0.7) return 9 / 16;
    return 1;
  };

  const onImageLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const onCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;
      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Unable to get canvas context');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error('Canvas is empty');
          const croppedFile = new File(
            [blob],
            `cropped-image-${Date.now()}.png`,
            {
              type: 'image/png',
              lastModified: Date.now(),
            }
          );
          onComplete(croppedFile);
        },
        'image/png',
        1
      );
    } catch (err) {
      console.error('Error processing image:', err);
      setError(
        'An error occurred while processing the image. Please try again.'
      );
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4'>
      <div className='bg-[#1C1C1C] max-w-4xl w-full p-6'>
        <h3 className='text-xl font-bold mb-4'>Crop Image</h3>
        <div className='relative'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={getCropRatio()}
            className='max-w-full max-h-[70vh]'
          >
            <img
              ref={imgRef}
              src={image.url}
              alt='Crop preview'
              className='max-w-full max-h-[60vh] object-contain'
              crossOrigin='anonymous'
              onLoad={(e) => onImageLoad(e.currentTarget)}
              onError={() => setError('Error loading image. Please try again.')}
            />
          </ReactCrop>
        </div>
        {error && <p className='text-red-500 mt-2'>{error}</p>}
        <div className='flex justify-end gap-4 mt-4'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-white hover:bg-gray-700 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onCropComplete}
            className='px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors'
            disabled={!!error}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
