import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function ImageCropper({ image, onComplete, onCancel }) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const imgRef = useRef(null);

  const getCropRatio = () => {
    if (image.ratio > 1.3) return 16 / 9;
    if (image.ratio < 0.7) return 9 / 16;
    return 1;
  };

  const onCropComplete = async () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Configure canvas for maximum quality

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
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
      'image/jpeg',
      1 // max quality
    );
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4'>
      <div className='bg-[#1C1C1C] rounded-lg max-w-4xl w-full p-6'>
        <h3 className='text-xl font-bold mb-4'>Crop Image</h3>
        <div className='relative'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={getCropRatio()}
            className='max-h-[60vh]'
          >
            <img
              loading='lazy'
              ref={imgRef}
              src={image.url}
              alt='Crop preview'
              crossOrigin='anonymous'
              className='max-w-full max-h-[60vh] object-contain'
            />
          </ReactCrop>
        </div>
        <div className='flex justify-end gap-4 mt-4'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-white hover:bg-gray-700 rounded transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onCropComplete}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropper;
