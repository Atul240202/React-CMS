import React, { useCallback, useState } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

Modal.setAppElement('#root');

export default function HomeUploadModal({
  isOpen,
  onClose,
  onUpload,
  uploadType,
  maxFiles = 1,
}) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > maxFiles) {
        toast.error(
          `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`
        );
        return;
      }
      setFiles(acceptedFiles);
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles,
    multiple: maxFiles > 1,
  });

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      await onUpload(files);
      setFiles([]);
    } catch (error) {
      console.error('Error in upload:', error);
      toast.error('Failed to process upload');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className='fixed inset-0 flex items-center justify-center p-4'
      overlayClassName='fixed inset-0 bg-black bg-opacity-80'
    >
      <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-white'>
            Upload {uploadType?.charAt(0).toUpperCase() + uploadType?.slice(1)}{' '}
            Image
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div
          {...getRootProps()}
          className='border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors'
        >
          <input {...getInputProps()} />
          <Upload className='h-12 w-12 mx-auto mb-4 text-gray-400' />
          <p className='text-gray-300 mb-2'>
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select'}
          </p>
          <p className='text-gray-500 text-sm'>
            Supports: PNG, JPG, JPEG, WEBP
          </p>
        </div>

        {files.length > 0 && (
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

        <div className='flex justify-between items-center mt-6'>
          <button className='flex items-center text-gray-400 hover:text-gray-300'>
            <HelpCircle className='h-4 w-4 mr-1' />
            Help
          </button>
          <div className='space-x-2'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-white'
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={files.length === 0}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
