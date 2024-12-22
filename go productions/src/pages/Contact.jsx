import React, { useState, useEffect } from 'react';
import TransitionEffect from '../components/TransitionEffect';

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
      className={`relative  m-auto bg-black ${
        isMobile
          ? 'h-[40vh] mt-[5vh] mb-[5vh] w-[100%]'
          : 'h-[90vh] mt-[5vh] w-[90%]'
      }`}
    >
      {/* Map Container */}
      <div
        className={`absolute inset-0 z-10 justify-center items-center ${
          isMobile ? 'mt-[9vh]' : 'mt-[15vh]'
        }`} // Ensure this has higher z-index
      >
        <iframe
          title='Go Productions Location'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448843.6236179242!2d77.1305966827735!3d28.491867243392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c8554d41db%3A0xccc32753b0a293dd!2sGo%20Productions!5e0!3m2!1sen!2sin!4v1728834522687!5m2!1sen!2sin'
          className={`w-full  border-0 ${isMobile ? 'h-[22vh]' : 'h-[50vh]'}`}
          allowFullScreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>

      {/* Text Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between items-center ${
          isMobile ? 'h-[40vh]' : 'h-[85vh]'
        }`}
      >
        <h1
          style={{
            color: 'transparent', // Set the fill color to transparent
            WebkitTextStroke: '2px white', // Outline with white color
            fontSize: isMobile ? '4rem' : '7rem', // Responsive font size
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            fontStyle: 'normal',
          }}
          className='font-chesna my-0'
        >
          LOCATION
        </h1>
        <h2
          style={{
            color: 'transparent', // Set the fill color to transparent
            WebkitTextStroke: '2px white', // Outline with white color
            fontSize: isMobile ? '3.5rem' : '6.5rem', // Responsive font size
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            fontStyle: 'normal',
          }}
          className='font-chesna my-0'
        >
          GO PRODUCTION
        </h2>
      </div>
    </div>
  );
}

function Contact() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
    number: '',
  });

  // Simulate loading progress for the transition
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLoading(false); // Transition completes when progress reaches 100%
            return 100;
          }
          return prev + 10;
        });
      }, 200); // Progress increment interval
    }
    return () => clearInterval(interval);
  }, [loading]);

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
        setFormData({ name: '', email: '', content: '', number: '' });
      } else {
        setStatusMessage('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('An error occurred while sending the message.');
    }
  };

  const handleTransitionComplete = () => {
    // console.log('Transition complete! Content is now visible.');
  };

  return (
    <>
      <TransitionEffect
        isLoading={loading}
        progress={progress}
        pageName='Contact'
        onTransitionComplete={handleTransitionComplete}
      />
      {!loading && (
        <div style={styles.container} className='font-chesna'>
          <h1 style={styles.title} className='font-chesna'>
            CONTACT US
          </h1>
          <hr style={styles.styleLine} />

          <h2
            style={styles.subtitle}
            className={`${
              isMobile ? 'text-md' : 'text-[1.5rem] font-extrabold font-chesna'
            }`}
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
            <button
              type='submit'
              style={styles.button}
              className={`rounded-[0] ${
                isMobile ? 'text-[20px]' : 'text-[1.5rem]'
              }`}
            >
              SEND
            </button>
          </form>
          {statusMessage && <p style={styles.status}>{statusMessage}</p>}

          {/* New section for Address and Map */}
          <div style={styles.infoSection}>
            <div style={styles.contactDetails}>
              <h3 style={{ fontSize: '1.5rem' }}>ADDRESS</h3>
              <hr style={styles.styleLine1} />
              <p className='font-sans font-extrabold'>
                KH NO. 621 SILVER OAK FARMS, ZERO NUMBER RD, GHITORNI, NEW
                DELHI, DELHI - 110030
              </p>
              <hr style={styles.styleLine2} />
              <div style={styles.contactBox}>
                <h3
                  style={{ margin: '0' }}
                  className={`${isMobile ? 'text-md' : 'text-[1.5rem]'}`}
                >
                  PHONE NUMBER
                </h3>
                <p
                  style={{ margin: '0' }}
                  className={`font-sans font-extrabold ${
                    isMobile ? 'text-md' : 'text-[1.5rem]'
                  }`}
                >
                  <a style={{ color: 'white' }} href='tel:+918130405967'>
                    +91 8130405967
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
                <p style={{ margin: '0' }} className='font-sans font-extrabold'>
                  <a style={{ color: 'white' }} href='mailto:help@gostudio.in'>
                    help@gostudio.in
                  </a>
                </p>
              </div>
            </div>
            <LocationSection />
          </div>
        </div>
      )}
    </>
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
    width: '25%',
    padding: '0.5rem',
    backgroundColor: '#111',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
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
