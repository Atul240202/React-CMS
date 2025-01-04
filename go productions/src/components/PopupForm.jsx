import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaTimes } from 'react-icons/fa';

const PopupForm = ({ onClose, onSubmit, locationName, locationAddress }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: new Date(),
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      locationName,
      locationAddress,
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: new Date(),
      message: '',
    });
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center font-raleway items-center z-50 p-4'>
      <div className='bg-black p-6 sm:p-8 w-full max-w-md relative'>
        <button
          onClick={handleCancel}
          className='absolute top-2 right-2 bg-black outline-none focus:outline-none mt-2 text-white border-none text-xl '
        >
          <FaTimes />
        </button>
        <h2 className='text-3xl sm:text-4xl font-raleway mb-4 text-white uppercase'>
          Request Availability
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='w-full text-left'>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='WRITE YOUR NAME HERE,'
              className='w-[23vw] pl-[2%] py-3 mb-4 bg-[#333] text-white border-none  focus:outline-none'
              required
            />
          </div>
          <div className='w-full text-left'>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='WRITE YOUR EMAIL ID HERE,'
              className='w-[23vw] pl-[2%] py-3 mb-4 bg-[#333] text-white border-none focus:outline-none'
              required
            />
          </div>
          <div className='w-full text-left'>
            <input
              type='tel'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='ENTER YOUR MOBILE NO.'
              className='w-[23vw] pl-[2%] py-3 mb-4 bg-[#333] text-white border-none focus:outline-none'
              required
            />
          </div>
          <div className='w-full text-left'>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className='w-[23vw] pl-[2%] py-3 mb-4 placeholder-[#333] bg-[#333] border-2 focus:outline-none border-none '
              placeholderText='SELECT DATE'
              required
            />
          </div>
          <div className='w-full text-left'>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              placeholder='DESCRIBE YOUR REQUIREMENT HERE,'
              className='w-[23vw] pl-[2%] py-3 mb-4 bg-[#333] text-white border-none focus:outline-none'
              rows='4'
              required
            ></textarea>
          </div>
          <div className='flex justify-end'>
            <button
              type='submit'
              className='bg-white font-raleway font-medium text-black border-none px-8 py-2 text-lg uppercase tracking-wide'
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
