import React, { useCallback, useState, useEffect } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import GridImageCropModal from './GridImageCropModal';
import ClientCrop from './ClientCrop';
import Compressor from 'compressorjs';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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
  const [showClientCropModal, setShowClientCropModal] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState('');
  const [currentFile, setCurrentFile] = useState(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const ffmpeg = new FFmpeg();

  useEffect(() => {
    loadFFmpeg().catch((error) => {
      console.error('Error in loadFFmpeg:', error);
      setFfmpegLoaded(false);
    });
  }, []);

  const loadFFmpeg = async () => {
    try {
      await ffmpeg.load();
      console.log('FFmpeg loaded successfully');
      setFfmpegLoaded(true);
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      setFfmpegLoaded(false);
    }
  };

  const resetState = () => {
    setClientName('');
    setFiles([]);
    setUploadProgress(0);
    setClientNameError('');
    setIsUploading(false);
    setShowCropModal(false);
    setShowClientCropModal(false);
    setCurrentFileUrl('');
    setCurrentFile(null);
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (isClientDashboard) {
        const file = acceptedFiles[0];
        setCurrentFile(file);
        const imageUrl = URL.createObjectURL(file);
        setCurrentFileUrl(imageUrl);
        setShowClientCropModal(true);
      } else if (requireCrop) {
        const file = acceptedFiles[0];
        setCurrentFile(file);
        const imageUrl = URL.createObjectURL(file);
        setCurrentFileUrl(imageUrl);
        setShowCropModal(true);
      } else {
        setFiles(acceptedFiles);
      }
    },
    [isClientDashboard, requireCrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptVideo
      ? { 'video/*': ['.mp4', '.webm', '.ogg'] }
      : { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: !isClientDashboard && !requireCrop && multiple,
  });

  const validateClientName = () => {
    if (isClientDashboard && !clientName.trim()) {
      setClientNameError('Please provide a value here');
      return false;
    }
    setClientNameError('');
    return true;
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const options = getCompressionOptions(file.size);

      new Compressor(file, {
        ...options,
        success(result) {
          console.log('Compression result:', result);
          resolve(result);
        },
        error(err) {
          console.error('Compression error:', err);
          resolve(file); // If compression fails, use the original file
        },
      });
    });
  };

  const compressVideo = async (file) => {
    console.log('Attempting to compress video. FFmpeg loaded:', ffmpegLoaded);
    if (!ffmpegLoaded) {
      console.warn('FFmpeg not loaded, skipping video compression');
      return file;
    }

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    ffmpeg.FS('writeFile', inputName, await fetchFile(file));

    await ffmpeg.run(
      '-i',
      inputName,
      '-c:v',
      'libx264',
      '-crf',
      '23',
      '-preset',
      'medium',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      outputName
    );

    const data = ffmpeg.FS('readFile', outputName);
    const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'video/mp4',
    });

    ffmpeg.FS('unlink', inputName);
    ffmpeg.FS('unlink', outputName);

    console.log('video file before compression', compressedFile);

    return compressedFile;
  };

  const getCompressionOptions = (fileSize) => {
    const MB = 1024 * 1024;
    let quality, maxWidth, maxHeight;

    switch (true) {
      case fileSize > 20 * MB:
        quality = 0.6;
        maxWidth = 3000;
        maxHeight = 3000;
        break;
      case fileSize > 10 * MB:
        quality = 0.7;
        maxWidth = 3500;
        maxHeight = 3500;
        break;
      case fileSize > 5 * MB:
        quality = 0.8;
        maxWidth = 4000;
        maxHeight = 4000;
        break;
      default:
        quality = 0.9;
        maxWidth = 4500;
        maxHeight = 4500;
    }

    return {
      quality,
      maxWidth,
      maxHeight,
      convertSize: 3 * MB, // Target size of 3MB
      success(result) {
        if (result.size > 3 * MB) {
          // If the result is still larger than 3MB, compress again with lower quality
          new Compressor(result, {
            quality: quality * 0.8,
            maxWidth,
            maxHeight,
            convertSize: 3 * MB,
            success(finalResult) {
              console.log('Final compression result:', finalResult);
              resolve(finalResult);
            },
            error(err) {
              console.error('Final compression error:', err);
              resolve(result); // If final compression fails, use the previous result
            },
          });
        } else {
          resolve(result);
        }
      },
    };
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
    console.log('Files to upload:', filesToUpload);
    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        let fileToUpload = file;
        if (!isClientDashboard) {
          if (file.type.startsWith('image/')) {
            fileToUpload = await compressImage(file);
          } else if (file.type.startsWith('video/')) {
            fileToUpload = await compressVideo(file);
          }
        }
        const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

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
                resolve({ file: fileToUpload, downloadURL });
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
        onUpload(clientName, urls[0], uploadedFiles[0], uploadedFiles[0].type);
      } else {
        onUpload(urls, uploadedFiles);
      }

      resetState();
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

  const handleClientCropComplete = async (croppedFile, croppedImageUrl) => {
    setFiles([croppedFile]);
    setShowClientCropModal(false);
    await handleUpload([croppedFile]);
  };

  const handleClose = () => {
    resetState();
    onClose();
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
            <button onClick={handleClose}>
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

          {files.length > 0 && !requireCrop && !isClientDashboard && (
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
              {!requireCrop && !isClientDashboard && (
                <button
                  onClick={() => handleUpload(files)}
                  className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700'
                  disabled={files.length === 0 || isUploading}
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

      <ClientCrop
        isOpen={showClientCropModal}
        onClose={() => {
          setShowClientCropModal(false);
          URL.revokeObjectURL(currentFileUrl);
        }}
        imageUrl={currentFileUrl}
        onCropComplete={handleClientCropComplete}
      />
    </>
  );
};

export default UploadModal;
