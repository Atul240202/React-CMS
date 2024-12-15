import React, { useState, useEffect, useCallback } from 'react';
import { X, Pencil, Plus, ChevronDown, Trash2 } from 'lucide-react';
import {
  getClients,
  addStill,
  getClientLogo,
  storage,
  uploadClient,
} from '../firebase';
import UploadModal from './HomepageModals/UploadModal';
import CampaignGrid from './CampaignGrid';
import ImageCropper from './ImageCropper';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

function AddCampaignModal({ isOpen, onClose, onAddStill }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [campaignData, setCampaignData] = useState({
    logo: '',
    text: '',
    image: null,
    internalImages: [],
    clientId: '',
    credits: {
      'CAMPAIGN TITLE': '',
    },
  });
  const [uploadType, setUploadType] = useState('');
  const [mainFile, setMainFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);
  const [croppingImage, setCroppingImage] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const creditOptions = ['PHOTOGRAPHER', 'BRAND', 'STYLIST', 'CREW MEMBERS'];
  const filterOptions = ['FASHION AND LIFESTYLE', 'ADVERTISING', 'EDITORIAL'];

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      const fetchedClients = await getClients();
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'clientId' && value === 'add_new') {
      setShowClientModal(true);
    } else {
      setCampaignData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === 'clientId') {
        setIsFetchingLogo(true);
        try {
          const logo = await getClientLogo(value);
          setCampaignData((prev) => ({
            ...prev,
            logo: logo,
          }));
        } catch (error) {
          console.error('Error fetching client logo:', error);
        } finally {
          setIsFetchingLogo(false);
        }
      }

      validateField(name, value);
    }
  };

  const handleCreditChange = (key, value) => {
    setCampaignData((prev) => ({
      ...prev,
      credits: {
        ...prev.credits,
        [key]: value,
      },
    }));
  };

  const handleUpload = async (urls, files) => {
    if (uploadType === 'main') {
      setMainFile(files[0]);
      setCampaignData((prev) => ({
        ...prev,
        image: urls[0],
      }));
      validateField('image', files[0]);
    } else if (uploadType === 'grid') {
      const newImages = await Promise.all(
        files.map(async (file, index) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await new Promise((resolve) => {
            img.onload = resolve;
          });
          return {
            id: `${Date.now()}-${index}`,
            url: urls[index],
            ratio: img.width / img.height,
            order: campaignData.internalImages.length + index,
          };
        })
      );

      setCampaignData((prev) => ({
        ...prev,
        internalImages: [...prev.internalImages, ...newImages],
      }));
    }
    setShowUploadModal(false);
  };

  const handleGridReorder = (reorderedImages) => {
    setCampaignData((prev) => ({
      ...prev,
      internalImages: reorderedImages,
    }));
  };

  const handleGridCrop = async (id, croppedImage) => {
    setIsLoading(true);
    try {
      // const formData = new FormData();
      // formData.append('file', croppedImage);
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const { url } = await response.json();
      const storageRef = ref(storage, `stills/${id}/grid_${Date.now()}`);
      await uploadBytes(storageRef, croppedImage);
      const url = await getDownloadURL(storageRef);
      setCampaignData((prev) => ({
        ...prev,
        internalImages: prev.internalImages.map((img) =>
          img.id === id ? { ...img, url } : img
        ),
      }));
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGridDelete = (id) => {
    setCampaignData((prev) => ({
      ...prev,
      internalImages: prev.internalImages.filter((img) => img.id !== id),
    }));
  };

  const handleAddCredit = (creditType) => {
    if (creditType === 'CREW MEMBERS') {
      const newKey = `CREW MEMBER ${
        Object.keys(campaignData.credits).filter((k) =>
          k.startsWith('CREW MEMBER')
        ).length + 1
      }`;
      setCampaignData((prev) => ({
        ...prev,
        credits: { ...prev.credits, [newKey]: '' },
      }));
    } else {
      setCampaignData((prev) => ({
        ...prev,
        credits: { ...prev.credits, [creditType]: '' },
      }));
    }
    setShowCreditDropdown(false);
  };

  const handleRemoveCredit = (creditKey) => {
    setCampaignData((prev) => {
      const newCredits = { ...prev.credits };
      delete newCredits[creditKey];
      return { ...prev, credits: newCredits };
    });
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'clientId':
        if (!value) {
          newErrors.clientId = 'Client is required';
        } else {
          delete newErrors.clientId;
        }
        break;
      case 'text':
        if (!value) {
          newErrors.text = 'Title is required';
        } else {
          delete newErrors.text;
        }
        break;
      case 'image':
        if (!value) {
          newErrors.image = 'Still Image is required';
        } else {
          delete newErrors.image;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!campaignData.clientId) newErrors.clientId = 'Client is required';
    if (!campaignData.logo) newErrors.logo = 'Logo is required';
    if (!campaignData.text) newErrors.text = 'Title is required';
    if (!mainFile) newErrors.image = 'Still Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const stillData = {
        ...campaignData,
        filter: selectedFilters,
      };
      await addStill(campaignData.clientId, stillData, mainFile);

      onAddStill();
      onClose();
    } catch (error) {
      console.error('Error adding new still:', error);
      alert('Failed to add new still. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientUpload = useCallback(
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
        setCampaignData((prev) => ({
          ...prev,
          clientId: newClient.id,
          logo: downloadURL,
        }));
        setShowClientModal(false);
      } catch (error) {
        console.error('Error uploading client:', error);
      }
    },
    []
  );

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-[#0C0C0C] z-40 overflow-y-auto'>
      <div className='min-h-screen p-4'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex justify-between items-center p-6 border-b border-gray-800'>
            <h2 className='text-2xl font-extrabold'>FILL CAMPAIGN DETAILS</h2>
            <button
              onClick={() => {
                setCampaignData({
                  logo: '',
                  text: '',
                  image: null,
                  internalImages: [],
                  clientId: '',
                  credits: {
                    'CAMPAIGN TITLE': '',
                  },
                });
                onClose();
              }}
            >
              <X className='h-6 w-6' />
            </button>
          </div>
          <div className='p-6 space-y-8'>
            <div className='flex justify-between bg-[#1C1C1C] p-6 backdrop-blur-[84px]'>
              {/* Main Image */}
              <div className='aspect-video bg-zinc-800 overflow-hidden w-1/2'>
                {campaignData.image ? (
                  <img
                    loading='lazy'
                    src={campaignData.image}
                    alt='Campaign'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <button
                    onClick={() => {
                      setUploadType('main');
                      setShowUploadModal(true);
                    }}
                    className='w-full h-full flex items-center justify-center'
                  >
                    <Plus className='h-8 w-8' />
                  </button>
                )}
              </div>

              {/* Logo and Title */}
              <div className='space-y-4 w-1/2 pl-4'>
                <div className='flex flex-col'>
                  <div className='flex items-center justify-between border border-white p-3 rounded'>
                    <span className='text-xl font-extrabold'>
                      CLIENT <span className='text-red-500'>*</span>
                    </span>
                    <select
                      name='clientId'
                      value={campaignData.clientId}
                      onChange={handleInputChange}
                      className='bg-transparent focus:outline-none text-center'
                      required
                    >
                      <option
                        className='text-black text-lg font-bold overflow-hidden'
                        value=''
                      >
                        Select a client
                      </option>
                      {clients.map((client) => (
                        <option
                          className='text-black font-bold text-lg overflow-hidden'
                          key={client.id}
                          value={client.id}
                        >
                          {client.name}
                        </option>
                      ))}
                      <option
                        className='text-black font-bold text-lg overflow-hidden'
                        value='add_new'
                      >
                        + Add New Client
                      </option>
                    </select>
                  </div>
                  {errors.clientId && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.clientId}
                    </p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='flex items-center justify-between border border-white p-3 rounded'>
                    <span className='text-xl font-extrabold'>
                      LOGO <span className='text-red-500'>*</span>
                    </span>
                    {isFetchingLogo ? (
                      <div className='animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent'></div>
                    ) : campaignData.logo ? (
                      <img
                        loading='lazy'
                        src={campaignData.logo}
                        alt='Client Logo'
                        className='h-8'
                      />
                    ) : (
                      <span className='text-gray-500'>No logo available</span>
                    )}
                  </div>
                  {errors.logo && (
                    <p className='text-red-500 text-sm mt-1'>{errors.logo}</p>
                  )}
                </div>

                <div className='flex flex-col'>
                  <div className='border border-white p-3 rounded'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xl font-extrabold'>
                        TITLE <span className='text-red-500'>*</span>
                      </span>
                      <Pencil
                        className='h-4 w-4'
                        onClick={() => setEditingField('text')}
                      />
                    </div>
                    {editingField === 'text' ? (
                      <input
                        type='text'
                        name='text'
                        value={campaignData.text}
                        onChange={handleInputChange}
                        onBlur={() => setEditingField(null)}
                        className='w-full bg-transparent mt-2 border-white focus:outline-none'
                        autoFocus
                      />
                    ) : (
                      <p className='mt-2 text-gray-400'>
                        {campaignData.text || 'Click pencil to edit...'}
                      </p>
                    )}
                  </div>
                  {errors.text && (
                    <p className='text-red-500 text-sm mt-1'>{errors.text}</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setUploadType('main');
                    setShowUploadModal(true);
                  }}
                  className='w-full p-3 border border-white rounded text-left flex items-center justify-between'
                >
                  <span className='text-xl font-extrabold'>CHANGE PICTURE</span>
                  <Pencil className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Campaign Grid */}
            <div>
              <h3 className='text-2xl font-black mb-4'>CAMPAIGN GRID</h3>
              <div className='bg-[#1C1C1C] backdrop-blur-[84px] p-6'>
                <CampaignGrid
                  images={campaignData.internalImages}
                  onReorder={handleGridReorder}
                  onCrop={handleGridCrop}
                  onDelete={handleGridDelete}
                />
                <button
                  onClick={() => {
                    setUploadType('grid');
                    setShowUploadModal(true);
                  }}
                  className='mt-4 w-full aspect-[3/1] bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition-colors'
                >
                  <Plus className='h-8 w-8' />
                </button>
              </div>
            </div>

            {/*Campaign Filter*/}
            <div>
              <h3 className='text-2xl font-black mb-4'>CAMPAIGN FILTER</h3>
              <div className='space-y-2 bg-[#1C1C1C] backdrop-blur-[84px] p-6'>
                {filterOptions.map((filter) => (
                  <label key={filter} className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={selectedFilters.includes(filter)}
                      onChange={() => handleFilterChange(filter)}
                      className='form-checkbox'
                    />
                    <span className='text-white'>{filter}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Campaign Credits */}
            <div>
              <h3 className='text-2xl font-black mb-4'>CAMPAIGN CREDITS</h3>
              <div className='space-y-2 bg-[#1C1C1C] backdrop-blur-[84px] p-6'>
                {Object.entries(campaignData.credits).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between border border-white p-3 rounded'
                  >
                    <div className='flex items-center flex-row'>
                      <span className='font-extrabold text-xl'>
                        {key.toUpperCase()} :
                      </span>
                      <div className='flex items-center ml-3 space-x-2'>
                        {editingField === key ? (
                          <input
                            type='text'
                            value={value}
                            onChange={(e) =>
                              handleCreditChange(key, e.target.value)
                            }
                            onBlur={() => setEditingField(null)}
                            className='bg-transparent text-left border-white focus:outline-none'
                            autoFocus
                          />
                        ) : (
                          <span className='text-gray-400'>
                            {value || 'Click pencil to edit...'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center flex-row gap-2'>
                      <Pencil
                        className='h-4 w-4 cursor-pointer'
                        onClick={() => setEditingField(key)}
                      />
                      {key !== 'CAMPAIGN TITLE' && (
                        <Trash2
                          className='h-4 w-4 cursor-pointer'
                          onClick={() => handleRemoveCredit(key)}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className='relative'>
                  <button
                    className='flex items-center space-x-2 text-xl font-bold w-1/5 border border-white px-4 py-2 rounded justify-between'
                    onClick={() => setShowCreditDropdown(!showCreditDropdown)}
                  >
                    <span>ADD</span>
                    <Plus className='h-4 w-4' />
                  </button>
                  {showCreditDropdown && (
                    <div className='absolute top-full left-0 w-1/5 bg-white text-black mt-1 rounded shadow-lg '>
                      {creditOptions.map((option) => (
                        <button
                          key={option}
                          className='block w-full text-left px-4 py-2 hover:text-white hover:bg-black'
                          onClick={() => handleAddCredit(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex justify-center'>
              <button
                className='px-8 py-2 bg-black text-white border border-white rounded hover:bg-gray-800 disabled:bg-gray-600'
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'SAVING...' : 'DONE'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        multiple={uploadType === 'grid'}
        requireCrop={uploadType === 'main'}
      />

      <UploadModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onUpload={handleClientUpload}
        acceptVideo={false}
        isClientDashboard={true}
      />

      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-4 rounded-lg flex flex-col items-center'>
            <div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
            <p className='text-gray-800 mt-2'>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCampaignModal;
