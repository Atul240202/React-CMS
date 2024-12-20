import React, { useState, useEffect } from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    content: '',
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Sending message...');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/send-whatsapp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();
      if (result.success) {
        setStatusMessage('Message sent successfully!');
        setFormData({ name: '', email: '', number: '', content: '' });
      } else {
        setStatusMessage('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('An error occurred while sending the message.');
    }
  };

  return (
    <div className='w-[93vw] ml-[3.5vw] mr-[3.5vw] mb-[10vh]'>
      <div className='home-contact-header '>
        <h2 className='font-chesna'>GET IN TOUCH</h2>
      </div>
      <div className='contact-us-container pt-5'>
        <form className='contact-form' onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleInputChange}
            placeholder='NAME'
            className='contact-input'
            required
          />
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='EMAIL'
            className='contact-input'
            required
          />
          <input
            type='tel'
            name='number'
            value={formData.number}
            onChange={handleInputChange}
            placeholder='MOBILE NUMBER'
            className='contact-input'
            pattern='[0-9]{10}'
            maxLength={10}
            required
          />
          <textarea
            name='content'
            value={formData.content}
            onChange={handleInputChange}
            placeholder='CONTENT'
            className='contact-textarea'
            required
          ></textarea>
          <button type='submit' className='contact-btn font-chesna'>
            SEND
          </button>
          {statusMessage && <p className='status-message'>{statusMessage}</p>}
        </form>
        <div className='map-container'>
          <iframe
            title='Go Productions Location'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448843.6236179242!2d77.1305966827735!3d28.491867243392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c8554d41db%3A0xccc32753b0a293dd!2sGo%20Productions!5e0!3m2!1sen!2sin!4v1728834522687!5m2!1sen!2sin'
            style={{ width: '100%', height: '100%' }}
            allowFullScreen=''
            loading='lazy'
            referrerPolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
