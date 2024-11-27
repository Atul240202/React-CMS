import React, { useState, useEffect } from 'react';

function LocationSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [statusMessage, setStatusMessage] = useState('');
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div
      className={`relative w-[90%]  m-auto  bg-black ${
        isMobile ? 'h-[40vh] mt-[5vh] mb-[5vh]' : 'h-[70vh] mt-[15vh]'
      }`}
    >
      {/* Map Container */}
      <div className='absolute justify-center inset-0 h-[40vh] opacity-50'>
        <iframe
          title='Go Productions Location'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448843.6236179242!2d77.1305966827735!3d28.491867243392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c8554d41db%3A0xccc32753b0a293dd!2sGo%20Productions!5e0!3m2!1sen!2sin!4v1728834522687!5m2!1sen!2sin'
          className='w-full h-full border-0'
          allowFullScreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>

      {/* Text Overlay */}
      <div
        className={`relative  ${
          isMobile
            ? 'hidden h-[40vh]'
            : 'h-[60vh] z-1  flex flex-col justify-between items-center'
        }`}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '7rem', // Equivalent to 'text-7xl'
            fontWeight: 'bold',
            letterSpacing: '0.05em', // Approximation for tracking-wider
            marginTop: '-13vh', // Equivalent to 'mt-[-6vh]'
            fontFamily: '"Londrina Outline", sans-serif', // Inline font-family
            fontStyle: 'normal',
          }}
        >
          LOCATION
        </h1>
        <h2
          style={{
            color: 'white',
            fontSize: '7rem', // Equivalent to 'text-7xl'
            fontWeight: 'bold',
            letterSpacing: '0.05em', // Approximation for tracking-wider
            marginTop: '20vh', // Equivalent to 'mt-[20vh]'
            fontFamily: '"Londrina Outline", sans-serif', // Inline font-family
            fontStyle: 'normal',
          }}
        >
          GO PRODUCTION
        </h2>
      </div>
    </div>
  );
}
function Contact() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    number: '',
  });

  const [statusMessage, setStatusMessage] = useState('');
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/send-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Include this if your server is configured to accept credentials
      });

      const result = await response.json();
      if (result.success) {
        setStatusMessage('Message sent to WhatsApp!');
        setFormData({ name: '', email: '', content: '', number: '' }); // Clear form after successful submission
      } else {
        setStatusMessage('Failed to send the message.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('An error occurred while sending the message.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CONTACT US</h1>
      <hr style={styles.styleLine} />

      <h2
        style={styles.subtitle}
        className={`${isMobile ? 'text-md' : 'text-[1.5rem]'}`}
      >
        LETS CREATE MAGIC TOGETHER
      </h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          placeholder='WRITE YOUR NAME HERE,'
          style={styles.input}
          required
        />
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          placeholder='WRITE YOUR EMAIL ID HERE,'
          style={styles.input}
          required
        />
        <input
          type='tel'
          name='number'
          value={formData.number}
          onChange={handleInputChange}
          placeholder='ENTER YOUR MOBILE NO.'
          style={styles.input}
          required
        />
        <textarea
          name='content'
          value={formData.content}
          onChange={handleInputChange}
          placeholder='WRITE YOUR CONTENT HERE,'
          style={styles.textarea}
          required
        ></textarea>
        <button type='submit' style={styles.button}>
          SEND
        </button>
      </form>
      {statusMessage && <p style={styles.status}>{statusMessage}</p>}

      {/* New section for Address and Map */}
      <div style={styles.infoSection}>
        <div style={styles.contactDetails}>
          <h3 style={{ fontSize: '1.5rem' }}>ADDRESS</h3>
          <hr style={styles.styleLine1} />
          <p>
            KH NO. 621 SILVER OAK FARMS, ZERO NUMBER RD, GHITORNI, NEW DELHI,
            DELHI - 110030
          </p>
          <hr style={styles.styleLine2} />
          <div style={styles.contactBox}>
            <h3
              style={{ margin: '0' }}
              className={`${isMobile ? 'text-md' : 'text-[1.5rem]'}`}
            >
              PHONE NUMBER
            </h3>
            <p style={{ margin: '0' }}>
              <a style={{ color: 'white' }} href='tel:+918130405967'>
                +91 81304 05967
              </a>
            </p>
          </div>
          <hr style={styles.styleLine2} />
          <div style={styles.contactBox}>
            <h3
              style={{ margin: '0' }}
              className={`${isMobile ? 'text-md' : 'text-[1.5rem]'}`}
            >
              SEND MAIL
            </h3>
            <p style={{ margin: '0' }}>
              <a style={{ color: 'white' }} href='mailto:help@gostudio.in'>
                help@gostudio.in
              </a>
            </p>
          </div>
        </div>
        <LocationSection />
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    paddingTop: '2rem',
    fontWeight: '800',
    marginBottom: '1rem',
  },
  styleLine: {
    margin: '30px 0',
    height: '1px',
    border: 'none',
    background:
      'linear-gradient(to right, transparent, white 50%, transparent)',
  },
  styleLine1: {
    margin: '20px 0',
    height: '1px',
    border: 'none',
    background: 'white',
  },
  styleLine2: {
    margin: '20px 0',
    height: '1px',
    border: 'none',
    background: 'white',
    width: '50%',
  },
  subtitle: {
    marginBottom: '2rem',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '2rem',
    width: '90%',
    margin: 'auto',
  },
  input: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#333',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
  },
  textarea: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#333',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    minHeight: '150px',
  },
  button: {
    width: '15%',
    padding: '1rem',
    backgroundColor: '#111',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
  infoSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '90%',
    margin: 'auto',
    color: '#fff',
  },
  contactDetails: {
    flex: '1',
    textAlign: 'left',
  },

  contactBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItem: 'center',
  },
  mapContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    width: '80%',
    margin: 'auto',
    height: '100vh',
  },
  mapFrame: {
    width: '100%',
    height: '300px',
    border: 'none',
    margin: 'auto',
  },
  overlayText: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '10rem',
    fontWeight: 'bold',
    opacity: '0.3',
    color: '#fff',
    fontFamily: 'Londrina Outline',
  },
  overlayTextBottom: {
    fontFamily: 'Londrina Outline',
    position: 'absolute',
    bottom: '0',
    left: '37%',
    transform: 'translate(-15%, -15%)',
    fontSize: '5rem',
    fontWeight: '900',
    RxFontStyle: 'normal',
    opacity: '0.3',
    color: '#fff',
  },
};

export default Contact;
