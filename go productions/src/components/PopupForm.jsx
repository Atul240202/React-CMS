import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center font-chesna items-center z-50 p-4'>
      <div className='bg-white p-4 sm:p-8 w-full max-w-md relative'>
        <button
          onClick={handleCancel}
          className='absolute top-2 right-2 text-black bg-white bg-opacity-10 text-2xl'
        >
          &times;
        </button>
        <h2 className='text-3xl sm:text-4xl font-bold mb-4 text-black uppercase'>
          Request Availability
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='NAME'
            className='w-full py-3 pl-1 mb-4 bg-white border-2 text-black border-black'
            required
          />
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='EMAIL'
            className='w-full py-3 pl-1 mb-4 bg-white border-2 text-black border-black'
            required
          />
          <input
            type='tel'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='PHONE'
            className='w-full py-3 pl-1 mb-4 bg-white border-2 text-black border-black'
            required
          />
          <div className='w-full text-left'>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className='w-full py-3 pl-1 mb-4 bg-white border-2 border-black text-black'
              placeholderText='SELECT DATE'
              required
            />
          </div>
          <textarea
            name='message'
            value={formData.message}
            onChange={handleChange}
            placeholder='MESSAGE'
            className='w-full py-3 pl-1 mb-4 bg-white border-2 text-black border-black'
            rows='4'
            required
          ></textarea>
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={handleCancel}
              className='bg-white border-2 border-black text-black px-4 py-2 mr-2 uppercase'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-white text-black border-2 border-black px-4 py-2 uppercase'
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
