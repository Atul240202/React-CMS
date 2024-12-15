import React, { useState, useEffect } from 'react';
import { X, Upload, HelpCircle } from 'lucide-react';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import {
  getClientsForMotion,
  getProductTitlesByClientForMotion,
  getVideoByProductTitle,
  uploadHomeMotion,
  updateHomeMotion,
} from '../../firebase';

Modal.setAppElement('#root');

export default function MotionUploadModal({
  isOpen,
  onClose,
  onUpload,
  onUpdate,
  editingMotion,
}) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [productTitles, setProductTitles] = useState([]);
  const [selectedProductTitle, setSelectedProductTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingMotion) {
      setSelectedClient(editingMotion.clientId);
      setSelectedProductTitle(editingMotion.productTitle);
      setVideo({
        url: editingMotion.video,
        productTitle: editingMotion.productTitle,
        clientName: editingMotion.clientName,
        logo: editingMotion.logo,
      });
    } else {
      resetForm();
    }
  }, [editingMotion]);

  useEffect(() => {
    if (selectedClient) {
      fetchProductTitles();
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const clientsData = await getClientsForMotion();
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  };

  const fetchProductTitles = async () => {
    try {
      const titles = await getProductTitlesByClientForMotion(selectedClient);
      setProductTitles(titles);
    } catch (error) {
      console.error('Error fetching product titles:', error);
      toast.error('Failed to fetch product titles');
    }
  };

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
    setSelectedProductTitle('');
    setVideo(null);
  };

  const handleProductTitleChange = async (e) => {
    const title = e.target.value;
    setSelectedProductTitle(title);
    if (title) {
      try {
        const videoData = await getVideoByProductTitle(selectedClient, title);
        setVideo(videoData);
      } catch (error) {
        console.error('Error fetching video:', error);
        toast.error('Failed to fetch video');
      }
    } else {
      setVideo(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClient || !selectedProductTitle || !video) {
      toast.error('Please select all required fields');
      return;
    }

    setIsUploading(true);

    try {
      if (editingMotion) {
        const updatedMotion = {
          ...editingMotion,
          clientId: selectedClient,
          productTitle: selectedProductTitle,
          thumbnail: video.url,
          video: video.url,
          clientName: video.clientName,
          logo: video.logo,
        };
        await onUpdate(updatedMotion);
      } else {
        const newMotion = await uploadHomeMotion(
          selectedClient,
          selectedProductTitle,
          video
        );
        onUpload(newMotion);
      }
      toast.success(
        editingMotion
          ? 'Motion updated successfully'
          : 'Motion uploaded successfully'
      );
      onClose();
    } catch (error) {
      console.error('Error uploading/updating motion:', error);
      toast.error(
        editingMotion ? 'Failed to update motion' : 'Failed to upload motion'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedProductTitle('');
    setVideo(null);
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
            {editingMotion ? 'Update Motion' : 'Upload Motion'}
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
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-400 mb-1'>
              Select Campaign Title
            </label>
            <select
              value={selectedProductTitle}
              onChange={handleProductTitleChange}
              className='w-full bg-zinc-800 text-white rounded p-2'
              disabled={!selectedClient}
            >
              <option value=''>Select a proCampaignduct title</option>
              {productTitles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>

          {video && (
            <div>
              <label className='block text-sm font-medium text-gray-400 mb-1'>
                Selected Video
              </label>
              <video src={video.url} controls className='w-full rounded' />
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
              disabled={
                isUploading ||
                !selectedClient ||
                !selectedProductTitle ||
                !video
              }
            >
              {isUploading ? (
                <>
                  <Upload className='animate-spin h-4 w-4 mr-2 inline' />
                  {editingMotion ? 'Updating...' : 'Uploading...'}
                </>
              ) : editingMotion ? (
                'Update'
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
