import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });

  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (response.ok) {
        setStatusMessage('Message sent successfully!');
        setFormData({ name: '', email: '', content: '' });
      } else {
        const errorText = await response.text();
        console.error(`Failed with status ${response.status}: ${errorText}`);
        setStatusMessage(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatusMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CONTACT US</h1>
      <hr style={styles.styleLine} />

      <h2 style={styles.subtitle}>LETS CREATE MAGIC TOGETHER</h2>
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
            <h3 style={{ margin: '0', fontSize: '1.5rem' }}>PHONE NUMBER</h3>
            <p style={{ margin: '0' }}>
              <a style={{ color: 'white' }} href='tel:+918130405967'>
                +91 81304 05967
              </a>
            </p>
          </div>
          <hr style={styles.styleLine2} />
          <div style={styles.contactBox}>
            <h3 style={{ margin: '0', fontSize: '1.5rem' }}>SEND MAIL</h3>
            <p style={{ margin: '0' }}>
              <a style={{ color: 'white' }} href='mailto:help@gostudio.in'>
                help@gostudio.in
              </a>
            </p>
          </div>
        </div>
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
    fontSize: '1.5rem',
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
