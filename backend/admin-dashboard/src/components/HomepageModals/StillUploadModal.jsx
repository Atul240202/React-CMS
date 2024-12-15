import React, { useEffect, useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import {
  getClientsInfo,
  getProductTitlesByClient,
  getInternalImagesByProduct,
} from '../../firebase';

Modal.setAppElement('#root');

export default function StillUploadModal({
  isOpen,
  onClose,
  onUpload,
  isPortrait,
}) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [productTitles, setProductTitles] = useState([]);
  const [selectedProductTitle, setSelectedProductTitle] = useState('');
  const [internalImages, setInternalImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClientsInfo();
        setClients(data);
      } catch (error) {
        toast.error('Error fetching clients');
      }
    };

    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedClient) {
      const fetchProductTitles = async () => {
        try {
          const titles = await getProductTitlesByClient(selectedClient);
          setProductTitles(titles);
        } catch (error) {
          toast.error('Error fetching product titles');
        }
      };

      fetchProductTitles();
    } else {
      setProductTitles([]);
      setSelectedProductTitle('');
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedClient && selectedProductTitle) {
      const fetchInternalImages = async () => {
        try {
          const images = await getInternalImagesByProduct(
            selectedClient,
            selectedProductTitle
          );
          setInternalImages(Object.values(images));
        } catch (error) {
          toast.error('Error fetching internal images');
        }
      };

      fetchInternalImages();
    } else {
      setInternalImages([]);
      setSelectedImage('');
    }
  }, [selectedClient, selectedProductTitle]);

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to proceed');
      return;
    }

    try {
      await onUpload(
        selectedImage,
        selectedClient,
        selectedProductTitle,
        isPortrait
      );
      toast.success('Image selected for cropping');
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to select image');
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
            Select Image for {isPortrait ? 'Portrait' : 'Landscape'} Frame
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-400 mb-2'>Select Client</label>
          <select
            className='w-full p-2 rounded bg-zinc-800 text-white'
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value=''>-- Select Client --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-400 mb-2'>
            Select Campaign Title
          </label>
          <select
            className='w-full p-2 rounded bg-zinc-800 text-white'
            value={selectedProductTitle}
            onChange={(e) => setSelectedProductTitle(e.target.value)}
            disabled={!selectedClient}
          >
            <option value=''>-- Select Product --</option>
            {productTitles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-400 mb-2'>Select Image</label>
          <div className='grid grid-cols-5 gap-4 max-h-60 overflow-y-auto'>
            {internalImages.map((image, index) => (
              <button
                key={index}
                className={`p-2 rounded border ${
                  selectedImage === image
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Internal ${index}`}
                  className='w-full h-full object-cover rounded'
                  loading='lazy'
                />
              </button>
            ))}
          </div>
        </div>

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
              disabled={!selectedImage}
            >
              Continue to Crop
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
