import React from 'react';
import '../styles/ContactUs.css';
import locationPointer from '../assets/locationPointer.gif';

const ContactUs = () => {
  return (
    <div className='w-[93vw] ml-[3.5vw] mr-[3.5vw] mb-[10vh]'>
      <div className='home-contact-header '>
        <h2 className='font-chesna'>GET IN TOUCH</h2>
      </div>
      <div className='contact-us-container pt-5'>
        <div className='contact-form'>
          <input type='text' placeholder='NAME' className='contact-input' />
          <input type='email' placeholder='EMAIL' className='contact-input' />
          <input
            type='tel'
            placeholder='MOBILE NUMBER'
            className='contact-input'
            pattern='[0-9]{10}'
            maxLength={10}
          />

          <textarea
            placeholder='CONTENT'
            className='contact-textarea'
          ></textarea>
          <button className='contact-btn font-chesna'>SEND</button>
        </div>
        <div className='map-container'>
          <iframe
            title='Go Productions Location'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448843.6236179242!2d77.1305966827735!3d28.491867243392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c8554d41db%3A0xccc32753b0a293dd!2sGo%20Productions!5e0!3m2!1sen!2sin!4v1728834522687!5m2!1sen!2sin'
            style={{ width: '100%', height: '100%' }}
            allowFullScreen=''
            loading='lazy'
            referrerpolicy='no-referrer-when-downgrade'
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
