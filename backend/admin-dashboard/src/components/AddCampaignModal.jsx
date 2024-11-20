import React, { useState, useEffect } from 'react';
import { X, Pencil, Plus, Trash2, ChevronDown } from 'lucide-react';
import UploadModal from './UploadModal';
import { getClients, addStill, getClientLogo } from '../firebase';

const AddCampaignModal = ({ isOpen, onClose, onAddStill }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [clients, setClients] = useState([]);
  const [campaignData, setCampaignData] = useState({
    logo: '',
    text: '',
    image: null,
    internalImages: [],
    clientId: '',
    credits: {
      'PRODUCT TITLE': '',
    },
  });
  const [uploadType, setUploadType] = useState('');
  const [mainFile, setMainFile] = useState(null);
  const [gridFiles, setGridFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);

  const creditOptions = ['PHOTOGRAPHER', 'BRAND', 'STYLIST', 'CREW MEMBERS'];

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
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

  const handleUpload = (urls, files) => {
    console.log('Still files & urls', files, urls);
    if (uploadType === 'main') {
      setMainFile(files[0]);
      setCampaignData((prev) => ({
        ...prev,
        image: urls[0],
      }));
      validateField('image', files[0]);
    } else if (uploadType === 'grid') {
      const newGridFiles = [...gridFiles, ...files];
      setGridFiles(newGridFiles);
      const newInternalImages = urls.map((url) => ({ url }));
      setCampaignData((prev) => ({
        ...prev,
        internalImages: [...prev.internalImages, ...newInternalImages],
      }));
    }
    setShowUploadModal(false);
  };

  const handleRemoveGridImage = (index) => {
    setCampaignData((prev) => ({
      ...prev,
      internalImages: prev.internalImages.filter((_, i) => i !== index),
    }));
    setGridFiles(gridFiles.filter((_, i) => i !== index));
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
      await addStill(campaignData.clientId, campaignData, mainFile, gridFiles);
      onAddStill();
      onClose();
    } catch (error) {
      console.error('Error adding new still:', error);
      alert('Failed to add new still. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCampaignData({
      logo: '',
      text: '',
      image: null,
      internalImages: [],
      clientId: '',
      credits: {
        'PRODUCT TITLE': '',
      },
    });
    setMainFile(null);
    setGridFiles([]);
    setErrors({});
    setEditingField(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-[#0C0C0C] z-40 overflow-y-auto'
      style={{
        fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
      }}
    >
      <div className='min-h-screen p-4'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex justify-between items-center p-6 border-b border-gray-800'>
            <h2 className='text-2xl font-bold'>FILL CAMPAIGN DETAILS</h2>
            <button onClick={onClose}>
              <X className='h-6 w-6' />
            </button>
          </div>
          <div className='p-6 space-y-8'>
            <div className='flex justify-between bg-[#1C1C1C] p-6 backdrop-blur-[84px]'>
              {/* Main Image */}
              <div className='aspect-video bg-zinc-800 overflow-hidden w-1/2'>
                {campaignData.image ? (
                  <img
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
                    <span>
                      CLIENT <span className='text-red-500'>*</span>
                    </span>
                    <select
                      name='clientId'
                      value={campaignData.clientId}
                      onChange={handleInputChange}
                      className='bg-transparent focus:outline-none'
                      required
                    >
                      <option className='text-black overflow-hidden' value=''>
                        Select a client
                      </option>
                      {clients.map((client) => (
                        <option
                          className='text-black overflow-hidden'
                          key={client.id}
                          value={client.id}
                        >
                          {client.name}
                        </option>
                      ))}
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
                    <span>
                      LOGO <span className='text-red-500'>*</span>
                    </span>
                    {isFetchingLogo ? (
                      <div className='animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent'></div>
                    ) : campaignData.logo ? (
                      <img
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
                    <div className=' flex items-center justify-between'>
                      <span>
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
                  className='w-full p-3 border border-white  rounded text-left flex items-center justify-between'
                >
                  <span>CHANGE PICTURE</span>
                  <Pencil className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Campaign Grid */}
            <div>
              <h3 className='text-xl font-black mb-4'>CAMPAIGN GRID</h3>
              <div className='grid grid-cols-6 gap-4 bg-[#1C1C1C] backdrop-blur-[84px] p-6'>
                {campaignData.internalImages.map((image, index) => (
                  <div
                    key={index}
                    className='aspect-square bg-gray-800 rounded overflow-hidden relative group'
                  >
                    <img
                      src={image.url}
                      alt={`Grid ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                    <button
                      onClick={() => handleRemoveGridImage(index)}
                      className='absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <Trash2 className='h-4 w-4 text-white' />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setUploadType('grid');
                    setShowUploadModal(true);
                  }}
                  className='aspect-square bg-zinc-800 rounded flex items-center justify-center'
                >
                  <Plus className='h-8 w-8' />
                </button>
              </div>
            </div>

            {/* Campaign Credits */}
            <div>
              <h3 className='text-xl font-black mb-4'>CAMPAIGN CREDITS</h3>
              <div className='space-y-2 bg-[#1C1C1C] backdrop-blur-[84px] p-6'>
                {Object.entries(campaignData.credits).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between border border-white p-3 rounded'
                  >
                    <div className='flex items-center flex-row'>
                      <span>{key.toUpperCase()}:</span>
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
                      {key !== 'PRODUCT TITLE' && (
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
                    className='flex items-center space-x-2 w-1/6 border border-white px-4 py-2 rounded justify-between'
                    onClick={() => setShowCreditDropdown(!showCreditDropdown)}
                  >
                    <span>ADD</span>
                    <Plus className='h-4 w-4' />
                  </button>
                  {showCreditDropdown && (
                    <div className='absolute top-full left-0 w-1/6 bg-white text-black mt-1 rounded shadow-lg'>
                      {creditOptions.map((option) => (
                        <button
                          key={option}
                          className='block w-full text-left px-4 py-2 hover:bg-gray-100'
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
      />

      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-4 rounded-lg flex flex-col items-center'>
            <div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
            <p className='text-gray-800 mt-2'>Saving new still...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCampaignModal;
