import React, { useCallback, useState } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from 'firebase/storage';
import { storage } from '../../firebase';
import GridImageCropModal from './GridImageCropModal';
import ClientCrop from './ClientCrop';

const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  acceptVideo = false,
  isClientDashboard = false,
  multiple = false,
  requireCrop = false,
}) => {
  const [clientName, setClientName] = useState('');
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [clientNameError, setClientNameError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');
  const [currentFile, setCurrentFile] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (requireCrop) {
        try {
          const file = acceptedFiles[0];
          setCurrentFile(file);
          const imageUrl = URL.createObjectURL(file);
          setCurrentFileUrl(imageUrl);
          setShowCropModal(true);
        } catch (error) {
          console.error('Error during file preparation:', error);
        }
      } else {
        setFiles(acceptedFiles);
      }
    },
    [requireCrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptVideo
      ? { 'video/*': ['.mp4', '.webm', '.ogg'] }
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: !requireCrop && multiple,
  });

  const validateClientName = () => {
    if (isClientDashboard && !clientName.trim()) {
      setClientNameError('Please provide a value here');
      return false;
    }
    setClientNameError('');
    return true;
  };

  const handleUpload = async (filesToUpload) => {
    if (isClientDashboard && !validateClientName()) {
      return;
    }

    if (filesToUpload.length === 0) {
      alert('Please select at least one file.');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prevProgress) => {
                const totalProgress =
                  prevProgress + progress / filesToUpload.length;
                return Math.min(totalProgress, 100);
              });
            },
            (error) => {
              console.error('Error uploading file:', error);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                resolve({ file, downloadURL });
              } catch (error) {
                console.error('Error getting download URL:', error);
                reject(error);
              }
            }
          );
        });
      });

      const results = await Promise.all(uploadPromises);
      const urls = results.map((r) => r.downloadURL);
      const uploadedFiles = results.map((r) => r.file);

      if (isClientDashboard) {
        onUpload(
          clientName,
          results.map((r) => r.downloadURL),
          filesToUpload,
          filesToUpload[0].type
        );
      } else {
        onUpload(urls, uploadedFiles);
      }

      setUploadProgress(0);
      setClientName('');
      setFiles([]);
      setIsUploading(false);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('An error occurred while uploading the files. Please try again.');
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (croppedFile) => {
    setFiles([croppedFile]);
    setShowCropModal(false);
    await handleUpload([croppedFile]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center'>
        <div className='bg-gray-900 rounded-lg p-6 w-full max-w-xl'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-bold'>
              Upload {acceptVideo ? 'Video' : 'Photos'}
            </h2>
            <button onClick={onClose}>
              <X className='h-6 w-6' />
            </button>
          </div>

          {isClientDashboard && (
            <div className='mb-4'>
              <label
                htmlFor='clientName'
                className='block text-sm font-medium text-gray-300 mb-1'
              >
                Client Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                id='clientName'
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (e.target.value.trim()) {
                    setClientNameError('');
                  }
                }}
                className='w-full bg-gray-800 rounded p-2 text-white'
                placeholder='Enter client name'
                required
              />
              {clientNameError && (
                <p className='text-red-500 text-sm mt-1'>{clientNameError}</p>
              )}
            </div>
          )}

          <div
            {...getRootProps()}
            className='border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors'
          >
            <input {...getInputProps()} />
            <Upload className='h-12 w-12 mx-auto mb-4 text-gray-400' />
            <p className='text-gray-300 mb-2'>
              {isDragActive
                ? `Drop your ${acceptVideo ? 'video' : 'image(s)'} here`
                : `Drop your ${
                    acceptVideo ? 'video' : 'image(s)'
                  } here, or browse`}
            </p>
            <p className='text-gray-500 text-sm'>
              {acceptVideo
                ? 'Supports: MP4, WEBM, OGG'
                : 'Supports: PNG, JPG, JPEG, WEBP'}
            </p>
          </div>

          {files.length > 0 && !requireCrop && (
            <div className='mt-4'>
              <p className='text-gray-300'>Selected files:</p>
              <ul className='list-disc list-inside'>
                {files.map((file, index) => (
                  <li key={index} className='text-gray-300'>
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isUploading && (
            <div className='mt-4'>
              <div className='bg-gray-700 rounded-full h-2.5'>
                <div
                  className='bg-blue-600 h-2.5 rounded-full'
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className='text-gray-300 mt-2'>
                Upload progress: {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          <div className='flex justify-between items-center mt-6'>
            <button className='flex items-center text-gray-400 hover:text-gray-300'>
              <HelpCircle className='h-4 w-4 mr-1' />
              Help Centre
            </button>
            <div className='space-x-2'>
              <button
                onClick={onClose}
                className='px-4 py-2 rounded bg-gray-800 hover:bg-gray-700'
                disabled={isUploading}
              >
                Cancel
              </button>
              {!requireCrop && (
                <button
                  onClick={() => handleUpload(files)}
                  className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700'
                  disabled={
                    isClientDashboard
                      ? !clientName.trim() || files.length === 0 || isUploading
                      : files.length === 0 || isUploading
                  }
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <GridImageCropModal
        isOpen={showCropModal}
        onClose={() => {
          setShowCropModal(false);
          URL.revokeObjectURL(currentFileUrl);
        }}
        imageUrl={currentFileUrl}
        onCropComplete={handleCropComplete}
      />
    </>
  );
};

export default UploadModal;
