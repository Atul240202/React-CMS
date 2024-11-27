import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import toast from 'react-hot-toast';
import DraggableHeroBanner from '../Draggable/DraggableHeroBanner';
import HomeUploadModal from '../HomepageModals/HomeUploadModal';
import ImageCropModal from '../HomepageModals/ImageCropModal';
import {
  getHeroBanners,
  deleteHeroBanner,
  updateHeroBannerSequences,
  updateHeroBanner,
} from '../../firebase';

export default function HeroBannerSection() {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editBannerId, setEditBannerId] = useState(null);

  const fetchBanners = async () => {
    try {
      const fetchedBanners = await getHeroBanners();
      setBanners(fetchedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUploadComplete = async (files) => {
    setSelectedImage(URL.createObjectURL(files[0]));
    setIsUploadModalOpen(false);
    setIsCropModalOpen(true);
  };

  const handleCropComplete = async () => {
    await fetchBanners();
    setIsCropModalOpen(false);
    setSelectedImage(null);
    setEditBannerId(null);
  };

  const handleEdit = (id) => {
    setEditBannerId(id);
    setIsUploadModalOpen(true);
  };

  const handleRemove = async (id) => {
    const loadingToast = toast.loading('Removing banner...');
    try {
      await deleteHeroBanner(id);

      const remainingBanners = banners
        .filter((banner) => banner.id !== id)
        .map((banner, index) => ({
          id: banner.id,
          sequence: index,
        }));

      await updateHeroBannerSequences(remainingBanners);
      await fetchBanners();
      toast.success('Banner removed successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error removing banner:', error);
      toast.error('Failed to remove banner', { id: loadingToast });
    }
  };

  const moveHeroBanner = async (dragIndex, hoverIndex) => {
    const newBanners = [...banners];
    const draggedBanner = newBanners[dragIndex];

    newBanners.splice(dragIndex, 1);
    newBanners.splice(hoverIndex, 0, draggedBanner);

    setBanners(newBanners);

    try {
      const updates = newBanners.map((banner, index) => ({
        id: banner.id,
        sequence: index,
      }));
      await updateHeroBannerSequences(updates);
    } catch (error) {
      console.error('Error updating banner sequences:', error);
      toast.error('Failed to update banner order');
      await fetchBanners();
    }
  };

  if (isLoading) {
    return (
      <section className='mb-12'>
        <h2 className='text-2xl font-bold mb-4'>HERO BANNER</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 min-h-60'>
          {[...Array(4)].map((_, index) => (
            <div key={index} className='w-full h-60 bg-zinc-800 ' />
          ))}
        </div>
      </section>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <section className='mb-12'>
        <h2 className='text-2xl font-extrabold mb-4'>HERO BANNER</h2>
        <div className='p-8 bg-[#1C1C1C] backdrop-blur-[84px] mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 min-h-60'>
            {banners.map((banner, index) => (
              <DraggableHeroBanner
                key={banner.id}
                id={banner.id}
                src={banner.imageUrl}
                index={index}
                moveHeroBanner={moveHeroBanner}
                onRemove={handleRemove}
                onEdit={handleEdit}
              />
            ))}
            {banners.length < 4 && (
              <button
                className='w-full h-60 bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors duration-200 border-2 border-zinc-600 hover:border-zinc-500'
                onClick={() => setIsUploadModalOpen(true)}
                aria-label='Add hero banner'
              >
                <Plus className='h-8 w-8' />
              </button>
            )}
          </div>
        </div>

        <HomeUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setEditBannerId(null);
          }}
          onUpload={handleUploadComplete}
          uploadType='hero'
          maxFiles={1}
        />

        {selectedImage && (
          <ImageCropModal
            isOpen={isCropModalOpen}
            onClose={() => {
              setIsCropModalOpen(false);
              setSelectedImage(null);
              setEditBannerId(null);
            }}
            imageUrl={selectedImage}
            onCropComplete={handleCropComplete}
            aspectRatio={16 / 9}
            editBannerId={editBannerId}
            sequence={banners.length}
            component='hero'
          />
        )}
      </section>
    </DndProvider>
  );
}
