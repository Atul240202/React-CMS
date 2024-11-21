import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import { ClipLoader } from 'react-spinners';
import 'react-image-crop/dist/ReactCrop.css';
import toast from 'react-hot-toast';
import {
  addHeroBanner,
  updateHeroBanner,
  updateStillGridItem,
} from '../../firebase';

Modal.setAppElement('#root');

export default function ImageCropModal({
  isOpen,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio = 16 / 9,
  editBannerId = null,
  sequence = 0,
  component,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: aspectRatio,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  const onImageLoad = useCallback(
    (img) => {
      setImageRef(img);

      // Calculate initial crop based on aspect ratio
      const width = img.width;
      const height = img.height;
      const imageAspect = width / height;

      let newCrop;
      if (imageAspect > aspectRatio) {
        // Image is wider than desired ratio
        const cropHeight = height;
        const cropWidth = height * aspectRatio;
        newCrop = {
          unit: 'px',
          width: cropWidth,
          height: cropHeight,
          x: (width - cropWidth) / 2,
          y: 0,
          aspect: aspectRatio,
        };
      } else {
        // Image is taller than desired ratio
        const cropWidth = width;
        const cropHeight = width / aspectRatio;
        newCrop = {
          unit: 'px',
          width: cropWidth,
          height: cropHeight,
          x: 0,
          y: (height - cropHeight) / 2,
          aspect: aspectRatio,
        };
      }
      setCrop(newCrop);
    },
    [aspectRatio]
  );

  const createCroppedImage = useCallback(async () => {
    if (!imageRef || !completedCrop?.width || !completedCrop?.height) {
      toast.error('Please create a crop selection');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading(
      editBannerId ? 'Updating banner...' : 'Uploading banner...'
    );

    try {
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.naturalWidth / imageRef.width;
      const scaleY = imageRef.naturalHeight / imageRef.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not create image context');
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
      console.log('Canvas for still ', canvas, ctx);
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          1
        );
      });

      console.log('Still & hero blob:', blob);

      // Create a File object from the blob
      const file = new File([blob], `hero-banner-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      console.log('Still file data', file);
      console.log('Still component data', component);
      if (editBannerId) {
        await updateHeroBanner(editBannerId, { imageFile: file });
      } else {
        if (component === 'hero') {
          await addHeroBanner(file, sequence);
        }
      }

      toast.success(
        editBannerId ? 'Updated successfully' : 'Uploaded successfully',
        { id: loadingToast }
      );

      onCropComplete(editBannerId, file);
      onClose();
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(
        editBannerId ? 'Failed to update banner' : 'Failed to upload banner',
        { id: loadingToast }
      );
    } finally {
      setIsUploading(false);
    }
  }, [
    imageRef,
    completedCrop,
    editBannerId,
    sequence,
    onCropComplete,
    onClose,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='fixed inset-0 flex items-center justify-center p-4'
      overlayClassName='fixed inset-0 bg-black bg-opacity-80'
    >
      <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-4xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-white'>Crop Image</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
            disabled={isUploading}
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='relative max-h-[70vh] overflow-auto'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className='max-w-full'
            disabled={isUploading}
          >
            <img
              src={imageUrl}
              onLoad={(e) => onImageLoad(e.currentTarget)}
              alt='Crop preview'
              className='max-w-full max-h-[70vh] object-contain'
              crossOrigin='anonymous'
            />
          </ReactCrop>
        </div>

        <div className='flex justify-end mt-6 space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-white disabled:opacity-50'
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={createCroppedImage}
            className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-white disabled:opacity-50 min-w-[120px] flex items-center justify-center'
            disabled={isUploading}
          >
            {isUploading ? (
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
    </Modal>
  );
}
