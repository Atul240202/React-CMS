import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import MotionUploadModal from '../HomepageModals/MotionUploadModal';
import {
  getHomeMotions,
  updateHomeMotionOrder,
  deleteHomeMotion,
  updateHomeMotion,
} from '../../firebase';
import toast from 'react-hot-toast';

export default function MotionSection() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [localMotions, setLocalMotions] = useState([]);
  const [editingMotion, setEditingMotion] = useState(null);

  useEffect(() => {
    fetchMotions();
  }, []);

  const fetchMotions = async () => {
    try {
      const motions = await getHomeMotions();
      setLocalMotions(motions);
    } catch (error) {
      console.error('Error fetching home motions:', error);
      toast.error('Failed to load motions');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(localMotions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalMotions(items);

    try {
      await updateHomeMotionOrder(
        items.map((item, index) => ({ id: item.id, order: index }))
      );
      toast.success('Motion order updated');
    } catch (error) {
      console.error('Error updating motion order:', error);
      toast.error('Failed to update motion order');
      setLocalMotions(localMotions);
    }
  };

  const handleUpload = (newMotion) => {
    setLocalMotions([...localMotions, newMotion]);
    toast.success('New motion added');
  };

  const handleDelete = async (id) => {
    try {
      await deleteHomeMotion(id);
      setLocalMotions(localMotions.filter((motion) => motion.id !== id));
      toast.success('Motion deleted');
    } catch (error) {
      console.error('Error deleting motion:', error);
      toast.error('Failed to delete motion');
    }
  };

  const handleEdit = (motion) => {
    setEditingMotion(motion);
    setShowUploadModal(true);
  };

  const handleUpdate = async (updatedMotion) => {
    try {
      await updateHomeMotion(updatedMotion);
      setLocalMotions(
        localMotions.map((motion) =>
          motion.id === updatedMotion.id ? updatedMotion : motion
        )
      );
      setEditingMotion(null);
      toast.success('Motion updated');
    } catch (error) {
      console.error('Error updating motion:', error);
      toast.error('Failed to update motion');
    }
  };

  return (
    <section className='mb-12'>
      <h2 className='text-2xl font-bold mb-4'>MOTION</h2>
      <div className='p-8 bg-[#1C1C1C] backdrop-blur-[84px] mb-8'>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='motions' direction='horizontal'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='grid grid-cols-4 gap-4'
              >
                {localMotions.map((motion, index) => (
                  <Draggable
                    key={motion.id}
                    draggableId={motion.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative aspect-video bg-zinc-900 overflow-hidden group ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <Link
                          to={`/motion/${
                            motion.clientId
                          }?product=${encodeURIComponent(motion.productTitle)}`}
                        >
                          <video
                            src={motion.thumbnail}
                            alt={motion.productTitle}
                            effect='blur'
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                          />
                        </Link>
                        <div className='absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                          <button
                            onClick={() => handleEdit(motion)}
                            className='p-1 bg-black border border-white rounded-full hover:bg-zinc-800 transition-colors'
                          >
                            <Pencil className='h-4 w-4 text-white' />
                          </button>
                          <button
                            onClick={() => handleDelete(motion.id)}
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
                {localMotions.length < 4 && (
                  <button
                    className='aspect-video bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
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

      <MotionUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setEditingMotion(null);
        }}
        onUpload={handleUpload}
        onUpdate={handleUpdate}
        editingMotion={editingMotion}
      />
    </section>
  );
}
