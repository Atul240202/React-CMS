import React, { useCallback, useState, useEffect } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import {
  storage,
  addHeroBanner,
  addStillGridItem,
  getClientsforStills,
  getProductsByClient,
} from '../firebase';

const HomeUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  uploadType,
  stillGridSize,
}) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [clientId, setClientId] = useState('');
  const [productTitle, setProductTitle] = useState('');
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients = await getClientsforStills();
        setClients(fetchedClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (clientId) {
        try {
          const fetchedProducts = await getProductsByClient(clientId);
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchProducts();
  }, [clientId]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (validateFiles(acceptedFiles)) {
        setFiles(acceptedFiles);
      }
    },
    [uploadType, stillGridSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      uploadType === 'motion'
        ? { 'video/*': ['.mp4', '.webm', '.ogg'] }
        : { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: uploadType === 'still',
  });

  const validateFiles = (acceptedFiles) => {
    switch (uploadType) {
      case 'hero':
        if (acceptedFiles.length !== 1) {
          alert('Please upload exactly one image for the hero banner');
          return false;
        }
        break;
      case 'still':
        if (acceptedFiles.length !== stillGridSize) {
          alert(
            `Please upload exactly ${stillGridSize} images for the still grid`
          );
          return false;
        }
        break;
      // ... (other cases remain the same)
    }
    return true;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select file(s) to upload.');
      return;
    }

    if (uploadType === 'still' && (!clientId || !productTitle)) {
      alert('Please select a client and product title for still images');
      return;
    }
    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const storageRef = ref(
          storage,
          `homepage/${uploadType}/${Date.now()}_${file.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prevProgress) => {
                const totalProgress = prevProgress + progress / files.length;
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
                resolve({ file, downloadURL, index });
              } catch (error) {
                console.error('Error getting download URL:', error);
                reject(error);
              }
            }
          );
        });
      });

      const results = await Promise.all(uploadPromises);

      switch (uploadType) {
        case 'hero':
          const heroBannerId = await addHeroBanner(results[0].downloadURL, 0);
          onUpload([results[0].downloadURL], files, { id: heroBannerId });
          break;
        case 'still':
          const stillGridItems = results.map((result, index) => ({
            image: result.downloadURL,
            clientId,
            productTitle,
            isPortrait: index % 2 === 0,
            order: index,
          }));
          const stillGridItemId = await addStillGridItem(stillGridItems);
          onUpload(
            results.map((r) => r.downloadURL),
            files,
            {
              id: stillGridItemId,
              clientId,
              productTitle,
              noOfStills: stillGridSize,
            }
          );
          break;
        // ... (other cases remain the same)
      }

      setUploadProgress(0);
      setFiles([]);
      setIsUploading(false);
      setClientId('');
      setProductTitle('');
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('An error occurred while uploading. Please try again.');
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center'>
      <div className='bg-zinc-900 rounded-lg p-6 w-full max-w-xl'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>
            Upload {uploadType?.toUpperCase()}
          </h2>
          <button onClick={onClose}>
            <X className='h-6 w-6' />
          </button>
        </div>

        {uploadType === 'still' && (
          <div className='mb-4 space-y-2'>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className='w-full bg-zinc-800 rounded p-2 text-white'
            >
              <option value=''>Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {clientId && (
              <select
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className='w-full bg-zinc-800 rounded p-2 text-white'
              >
                <option value=''>Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.title}>
                    {product.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        <div
          {...getRootProps()}
          className='border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors'
        >
          <input {...getInputProps()} />
          <Upload className='h-12 w-12 mx-auto mb-4 text-gray-400' />
          <p className='text-gray-300 mb-2'>
            {isDragActive
              ? `Drop your ${
                  uploadType === 'motion' ? 'video' : 'image(s)'
                } here`
              : `Drop your ${
                  uploadType === 'motion' ? 'video' : 'image(s)'
                } here, or browse`}
          </p>
          <p className='text-gray-500 text-sm'>
            {uploadType === 'motion'
              ? 'Supports: MP4, WEBM, OGG'
              : 'Supports: PNG, JPG, JPEG, WEBP'}
          </p>
          {uploadType === 'still' && (
            <p className='text-gray-500 text-sm mt-2'>
              Please upload {stillGridSize} images (alternating portrait and
              landscape)
            </p>
          )}
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

        {isUploading && (
          <div className='mt-4'>
            <div className='bg-zinc-700 rounded-full h-2.5'>
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
              className='px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700'
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700'
              disabled={
                files.length === 0 ||
                isUploading ||
                (uploadType === 'still' && (!clientId || !productTitle))
              }
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUploadModal;
