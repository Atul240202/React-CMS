import React, { useState, useEffect } from 'react';
import { X, Upload, HelpCircle, Crop } from 'lucide-react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import {
  getHomeClients,
  getHomeClientImage,
  uploadHomeClient,
  updateHomeClient,
} from '../../firebase';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ClientCrop from './ClientCrop';

Modal.setAppElement('#root');

export default function ClientUploadModal({
  isOpen,
  onClose,
  onUpload,
  onUpdate,
  editingClient,
}) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [clientImage, setClientImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [imageFile, setImageFile] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingClient) {
      setSelectedClient(editingClient.clientKey);
      setClientImage(editingClient.image);
      setCroppedImage(editingClient.image);
    } else {
      resetForm();
    }
  }, [editingClient]);

  const fetchClients = async () => {
    try {
      const clientsData = await getHomeClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  };

  const handleClientChange = async (e) => {
    const clientKey = e.target.value;
    setSelectedClient(clientKey);
    if (clientKey) {
      try {
        const imageUrl = await getHomeClientImage(clientKey);
        setClientImage(imageUrl);
        setShowCropModal(true);
      } catch (error) {
        console.error('Error fetching client image:', error);
        toast.error('Failed to fetch client image');
      }
    } else {
      setClientImage(null);
      setCroppedImage(null);
    }
  };

  const handleCropComplete = (file, croppedImageUrl) => {
    setCroppedImage(croppedImageUrl);
    setImageFile(file);
    setShowCropModal(false);
  };

  const handleSubmit = async () => {
    if (!selectedClient || !croppedImage) {
      toast.error('Please select a client and crop the image');
      return;
    }

    setIsUploading(true);

    try {
      const selectedClientData = clients.find(
        (client) => client.clientKey === selectedClient
      );
      if (editingClient) {
        const updatedClient = {
          ...editingClient,
          clientKey: selectedClient,
          name: selectedClientData.name,
        };
        await updateHomeClient(updatedClient, imageFile);
        onUpdate(updatedClient);
      } else {
        const newClient = {
          clientKey: selectedClient,
          name: selectedClientData.name,
        };
        const uploadedClient = await uploadHomeClient(newClient, imageFile);
        onUpload(uploadedClient);
      }
      toast.success(
        editingClient
          ? 'Client updated successfully'
          : 'Client uploaded successfully'
      );
      onClose();
    } catch (error) {
      console.error('Error uploading/updating client:', error);
      toast.error(
        editingClient ? 'Failed to update client' : 'Failed to upload client'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedClient('');
    setClientImage(null);
    setCroppedImage(null);
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
            {editingClient ? 'Update Client' : 'Upload Client'}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Select Client
            </label>
            <select
              value={selectedClient}
              onChange={handleClientChange}
              className='w-full bg-zinc-800 text-white rounded p-2'
            >
              <option value=''>Select a client</option>
              {clients.map((client) => (
                <option key={client.clientKey} value={client.clientKey}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {croppedImage && (
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-1'>
                Client Image
              </label>
              <div className='relative'>
                <LazyLoadImage
                  src={croppedImage}
                  alt='Selected client'
                  effect='blur'
                  className='w-full rounded'
                />
                <button
                  onClick={() => setShowCropModal(true)}
                  className='absolute top-2 right-2 p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors'
                >
                  <Crop className='h-4 w-4 text-white' />
                </button>
              </div>
            </div>
          )}
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
              onClick={handleSubmit}
              className='px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors text-white disabled:opacity-50'
              disabled={isUploading || !selectedClient || !croppedImage}
            >
              {isUploading ? (
                <>
                  <Upload className='animate-spin h-4 w-4 mr-2 inline' />
                  {editingClient ? 'Updating...' : 'Uploading...'}
                </>
              ) : editingClient ? (
                'Update'
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>

      <ClientCrop
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageUrl={clientImage}
        onCropComplete={handleCropComplete}
      />
    </Modal>
  );
}
