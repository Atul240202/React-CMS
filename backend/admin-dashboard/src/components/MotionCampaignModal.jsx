import React, { useState, useEffect, useCallback } from 'react';
import { X, Pencil, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import UploadModal from './HomepageModals/UploadModal';
import {
  uploadMotion,
  getClientLogo,
  uploadClient,
  getMotions,
} from '../firebase';

const MotionCampaignModal = ({ isOpen, onClose, onAddMotion, clients }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [campaignData, setCampaignData] = useState({
    logo: '',
    text: '',
    video: null,
    clientId: '',
    productTitle: '',
    credits: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [visibleFields, setVisibleFields] = useState({});
  const [showClientModal, setShowClientModal] = useState(false);
  const [updatedClients, setUpdateClients] = useState(clients);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const creditOptions = ['VIDEOGRAPHER', 'BRAND', 'STYLIST', 'CREW MEMBERS'];
  const filterOptions = ['FASHION AND LIFESTYLE', 'ADVERTISING', 'DIGITAL'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaignData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreditChange = (e, key) => {
    const { value } = e.target;
    setCampaignData((prev) => ({
      ...prev,
      credits: { ...prev.credits, [key]: value },
    }));
  };

  const handleUpload = (urls, files) => {
    if (files && files.length > 0) {
      setCampaignData((prev) => ({ ...prev, video: files[0] }));
      setVideoPreviewUrl(urls[0]);
    }
    setShowUploadModal(false);
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

  const handleClientChange = async (e) => {
    const clientId = e.target.value;
    if (clientId === 'add_new') {
      setShowClientModal(true);
    } else {
      setCampaignData((prev) => ({ ...prev, clientId }));
      if (clientId) {
        setIsLoading(true);
        try {
          const logoUrl = await getClientLogo(clientId);
          setCampaignData((prev) => ({ ...prev, logo: logoUrl }));
        } catch (error) {
          console.error('Error fetching client logo:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!campaignData.clientId) {
        alert('Please select a client');
        return;
      }
      if (!campaignData.logo) {
        alert('Client logo is missing');
        return;
      }
      if (!campaignData.video) {
        alert('Please upload a video');
        return;
      }
      const motionDataWithFilters = {
        ...campaignData,
        filter: selectedFilters,
      };

      // Get the current highest sequence number
      const motions = await getMotions();
      const maxSequence = motions.reduce(
        (max, motion) => Math.max(max, motion.sequence || 0),
        -1
      );
      motionDataWithFilters.sequence = maxSequence + 1;

      await uploadMotion(
        motionDataWithFilters.clientId,
        motionDataWithFilters,
        motionDataWithFilters.video
      );
      onAddMotion();
      onClose();
    } catch (error) {
      console.error('Error adding motion:', error);
      alert('Error adding motion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFieldVisibility = (field) => {
    setVisibleFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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
        setUpdateClients((prevClients) => [...prevClients, newClient]);
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

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black z-50 overflow-y-auto'>
      <div className='min-h-screen p-4'>
        <div className='max-w-5xl mx-auto rounded-lg p-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-extrabold'>FILL CAMPAIGN DETAILS</h2>
            <button
              onClick={() => {
                setCampaignData({
                  logo: '',
                  text: '',
                  video: null,
                  clientId: '',
                  productTitle: '',
                  credits: {},
                });
                setVideoPreviewUrl('');
                setSelectedFilters([]);
                setVisibleFields({});
                onClose();
              }}
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='space-y-8'>
            <div className='bg-[#1C1C1C] p-6 flex justify-between'>
              {/* Main Video */}
              <div className='aspect-video bg-zinc-800 overflow-hidden w-6/12 flex items-center justify-center'>
                {videoPreviewUrl ? (
                  <video
                    className='max-w-full max-h-full object-contain'
                    controls
                  >
                    <source src={videoPreviewUrl} type='video/mp4' />
                  </video>
                ) : (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className='w-full h-full flex items-center justify-center'
                  >
                    <Plus className='h-8 w-8' />
                  </button>
                )}
              </div>
              {/* Title */}
              <div className='space-y-4 pl-4 w-1/2'>
                <div className='flex items-center justify-between border border-white p-3 rounded'>
                  <span className='font-extrabold text-xl'>CLIENT</span>
                  <select
                    name='clientId'
                    value={campaignData.clientId}
                    onChange={handleClientChange}
                    className='bg-transparent text-left focus:outline-none'
                    required
                  >
                    <option className='text-black focus:outline-none' value=''>
                      Select a client
                    </option>
                    {clients.map((client) => (
                      <option
                        className='text-black focus:outline-none'
                        key={client.id}
                        value={client.id}
                      >
                        {client.name}
                      </option>
                    ))}
                    <option
                      className='text-black focus:outline-none'
                      value='add_new'
                    >
                      + Add New Client
                    </option>
                  </select>
                </div>

                <div className='flex items-center justify-between border border-white p-3 rounded'>
                  <span className='font-extrabold text-xl'>LOGO</span>
                  {isLoading ? (
                    <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                  ) : campaignData.logo ? (
                    <img
                      src={campaignData.logo}
                      alt='Logo'
                      className='h-8'
                      loading='lazy'
                    />
                  ) : (
                    <span className='text-gray-500'>No logo available</span>
                  )}
                </div>
                <div className='border border-white p-3 rounded'>
                  <div className='flex items-center justify-between'>
                    <span className='font-extrabold text-xl'>TITLE</span>
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
                      className='w-full bg-transparent mt-2 focus:outline-none'
                      placeholder='Write Here..'
                      autoFocus
                    />
                  ) : (
                    <p className='mt-2'>{campaignData.text}</p>
                  )}
                </div>

                <button
                  onClick={() => setShowUploadModal(true)}
                  className='w-full border border-white p-3 rounded text-left flex items-center justify-between font-extrabold text-xl'
                >
                  <span>
                    {videoPreviewUrl ? 'CHANGE VIDEO' : 'UPLOAD VIDEO'}
                  </span>
                  <Pencil className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Campaign Filter */}

            <div>
              <h3 className='text-2xl font-extrabold mb-4'>CAMPAIGN FILTER</h3>
              <div className='space-y-2 bg-[#1C1C1C] p-6'>
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
              <h3 className='text-2xl font-extrabold mb-4'>CAMPAIGN CREDITS</h3>
              <div className='space-y-2 bg-[#1C1C1C] p-6'>
                <div className='flex items-center justify-between border border-white p-3 rounded'>
                  <div className='flex flex-row'>
                    <span className='font-extrabold text-xl'>
                      CAMPAIGN TITLE:
                    </span>
                    {editingField === 'productTitle' ? (
                      <input
                        type='text'
                        name='productTitle'
                        value={campaignData.productTitle}
                        onChange={handleInputChange}
                        onBlur={() => setEditingField(null)}
                        className='bg-transparent text-left focus:outline-none pl-4'
                        placeholder='Write Here..'
                        autoFocus
                      />
                    ) : (
                      <div className='flex items-center pl-4'>
                        <span>
                          {campaignData.productTitle ||
                            'Click pencil to edit...'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Pencil
                      className='h-4 w-4 ml-2 cursor-pointer'
                      onClick={() => setEditingField('productTitle')}
                    />
                  </div>
                </div>
                {Object.entries(campaignData.credits).map(([key, value]) => (
                  <div
                    key={key}
                    className='flex items-center justify-between border border-white p-3 rounded'
                  >
                    <div className='flex flex-row'>
                      <span className='font-extrabold text-xl'>
                        {key.toUpperCase()}:{' '}
                      </span>
                      <div className='flex items-center ml-3 space-x-2'>
                        {editingField === `credits.${key}` ? (
                          <input
                            type='text'
                            value={value}
                            onChange={(e) => handleCreditChange(e, key)}
                            onBlur={() => setEditingField(null)}
                            className='bg-transparent text-left focus:outline-none pl-4'
                            placeholder='Write Here..'
                            autoFocus
                          />
                        ) : (
                          <>
                            <span
                              className={
                                visibleFields[`credits.${key}`] === false
                                  ? 'opacity-50 pl-4 text-white'
                                  : ' text-white'
                              }
                            >
                              {value || 'Click pencil to edit...'}
                            </span>
                            {/* <button
                            onClick={() =>
                              toggleFieldVisibility(`credits.${key}`)
                            }
                          >
                            {visibleFields[`credits.${key}`] === false ? (
                              <EyeOff className='h-4 w-4' />
                            ) : (
                              <Eye className='h-4 w-4' />
                            )}
                          </button> */}
                          </>
                        )}
                      </div>
                    </div>

                    <div className='flex flex-row gap-4'>
                      <Pencil
                        className='h-4 w-4 cursor-pointer'
                        onClick={() => setEditingField(`credits.${key}`)}
                      />
                      <Trash2
                        className='h-4 w-4 cursor-pointer'
                        onClick={() => handleRemoveCredit(key)}
                      />
                    </div>
                  </div>
                ))}
                <div className='relative'>
                  <button
                    className='flex items-center space-x-2 w-1/5 border border-white px-4 py-2 rounded justify-between text-xl font-extrabold'
                    onClick={() => setShowCreditDropdown(!showCreditDropdown)}
                  >
                    <span>ADD</span>
                    <Plus className='h-4 w-4' />
                  </button>
                  {showCreditDropdown && (
                    <div className='absolute top-full left-0 w-1/5 bg-white text-black mt-1 rounded shadow-lg'>
                      {creditOptions.map((option) => (
                        <button
                          key={option}
                          className='block w-full text-left px-4 py-2 hover:bg-black hover:text-white'
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
                className='px-8 py-2 border border-white rounded hover:bg-zinc-800'
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !campaignData.clientId ||
                  !campaignData.logo ||
                  !campaignData.video
                }
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
        acceptVideo={true}
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
            <p className='text-gray-800 mt-2'>Saving new motion...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MotionCampaignModal;
