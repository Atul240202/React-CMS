'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ClientUploadModal from '../HomepageModals/ClientUploadModal';
import {
  getHomeClientsData,
  deleteHomeClient,
  updateHomeClientSequence,
} from '../../firebase';
import toast from 'react-hot-toast';

export default function ClientSection() {
  const [clients, setClients] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const clientsData = await getHomeClientsData();
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching home clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(clients);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setClients(items);

    try {
      await updateHomeClientSequence(items);
      toast.success('Client order updated');
    } catch (error) {
      console.error('Error updating client order:', error);
      toast.error('Failed to update client order');
      fetchClients(); // Revert to original order on error
    }
  };

  const handleUpload = (newClient) => {
    setClients([...clients, newClient]);
  };

  const handleUpdate = (updatedClient) => {
    setClients(
      clients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setEditingClient(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHomeClient(id);
      setClients(clients.filter((client) => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowUploadModal(true);
  };

  return (
    <section className='mb-12'>
      <h2 className='text-2xl font-bold mb-4'>CLIENT</h2>
      <div className='p-8 bg-[#1C1C1C] backdrop-blur-[84px] mb-8'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='clients' direction='horizontal'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='grid grid-cols-5 gap-4'
              >
                {clients.map((client, index) => (
                  <Draggable
                    key={client.id}
                    draggableId={client.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative aspect-[3/2] bg-zinc-900 p-6 flex items-center justify-center group hover:bg-zinc-800 transition-colors ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <LazyLoadImage
                          src={client.image}
                          alt={client.name}
                          effect='blur'
                          className='w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-80'
                        />
                        <div className='absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button
                            onClick={() => handleEdit(client)}
                            className='p-1 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
                          >
                            <Pencil className='h-4 w-4 text-white' />
                          </button>
                          <button
                            onClick={() => handleDelete(client.id)}
                            className='p-1 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
                          >
                            <X className='h-4 w-4 text-white' />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {clients.length < 10 && (
                  <button
                    className='aspect-[3/2] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
                    onClick={() => setShowUploadModal(true)}
                  >
                    <Plus className='h-8 w-8' />
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <ClientUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setEditingClient(null);
        }}
        onUpload={handleUpload}
        onUpdate={handleUpdate}
        editingClient={editingClient}
      />
    </section>
  );
}
