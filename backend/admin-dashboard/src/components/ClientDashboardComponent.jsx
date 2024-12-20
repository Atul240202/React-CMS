import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus } from 'lucide-react';
import UploadModal from './HomepageModals/UploadModal';
import DraggableClientLogo from './Draggable/DraggableClientLogo';
import {
  uploadClient,
  getClients,
  deleteClient,
  updateClientSequence,
} from '../firebase';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-black border border-gray-800 rounded-lg p-8 max-w-md w-full mx-4'>
        <h2 className='text-white text-xl font-bold text-center mb-6'>
          ARE YOU SURE YOU WANT TO REMOVE THIS LOGO?
        </h2>
        <div className='flex justify-center gap-4'>
          <button
            onClick={onConfirm}
            className='px-8 py-2 bg-transparent border border-green-500 text-green-500 rounded hover:bg-green-500/10'
          >
            YES
          </button>
          <button
            onClick={onClose}
            className='px-8 py-2 bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-500/10'
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ClientDashboardComponent() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClients();
      setClients(
        fetchedClients.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      );
    };
    fetchClients();
  }, []);

  const handleRemove = (client) => {
    setSelectedClient(client);
    setShowConfirmModal(true);
  };

  const confirmRemove = async () => {
    try {
      await deleteClient(selectedClient.id, selectedClient.image);
      setClients(clients.filter((c) => c.id !== selectedClient.id));
    } catch (error) {
      console.error('Error removing client:', error);
    } finally {
      setShowConfirmModal(false);
      setSelectedClient(null);
    }
  };

  const handleUpload = useCallback(
    async (clientName, downloadURL, file, fileType) => {
      try {
        const clientKey = clientName.toLowerCase().replace(/\s+/g, '');
        const newClient = await uploadClient(
          clientName,
          clientKey,
          file,
          fileType
        );
        setClients((prevClients) => [...prevClients, newClient]);
        setShowUploadModal(false);
      } catch (error) {
        console.error('Error uploading client:', error);
      }
    },
    []
  );

  const moveClientLogo = useCallback((dragIndex, hoverIndex) => {
    setClients((prevClients) => {
      const newClients = [...prevClients];
      const draggedClient = newClients[dragIndex];
      newClients.splice(dragIndex, 1);
      newClients.splice(hoverIndex, 0, draggedClient);
      return newClients;
    });
  }, []);

  const handleDragEnd = useCallback(async () => {
    const updates = clients.map((client, index) => ({
      id: client.id,
      sequence: index,
    }));

    try {
      await updateClientSequence(updates);
    } catch (error) {
      console.error('Error updating client sequences:', error);
      // Optionally, revert the local state if the update fails
      const fetchedClients = await getClients();
      setClients(
        fetchedClients.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
      );
    }
  }, [clients]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='min-h-screen m-8 p-8'>
        <h1 className='text-white text-2xl font-extrabold mb-4'>CLIENT</h1>

        <div className='p-8 bg-[#1C1C1C] backdrop-blur-[84px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {clients.map((client, index) => (
            <DraggableClientLogo
              key={client.id}
              id={client.id}
              index={index}
              client={client}
              moveClientLogo={moveClientLogo}
              handleRemove={handleRemove}
              handleDragEnd={handleDragEnd}
            />
          ))}

          <button
            onClick={() => setShowUploadModal(true)}
            className='aspect-video bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
          >
            <Plus size={32} className='text-white' />
          </button>
        </div>

        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmRemove}
        />

        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          acceptVideo={false}
          isClientDashboard={true}
        />
      </div>
    </DndProvider>
  );
}
