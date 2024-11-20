import React from 'react';
import { RxFontStyle } from 'react-icons/rx';

function Contact() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CONTACT US</h1>
      <hr style={styles.styleLine} />

      <h2 style={styles.subtitle}>LETS CREATE MAGIC TOGETHER</h2>
      <form style={styles.form}>
        <input
          type='text'
          placeholder='WRITE YOUR NAME HERE,'
          style={styles.input}
        />
        <input
          type='email'
          placeholder='WRITE YOUR EMAIL ID HERE,'
          style={styles.input}
        />
        <textarea
          placeholder='WRITE YOUR CONTENT HERE,'
          style={styles.textarea}
        ></textarea>
        <button type='submit' style={styles.button}>
          SEND
        </button>
      </form>
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
              <a style={{ color: 'white' }} href='help@gostudio.in'>
                help@gostudio.in
              </a>
            </p>
          </div>
        </div>
      </div>
      <div style={styles.mapContainer}>
        <h1 style={styles.overlayText}>LOCATION</h1>
        <iframe
          title='Go Productions Location'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448843.6236179242!2d77.1305966827735!3d28.491867243392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3c8554d41db%3A0xccc32753b0a293dd!2sGo%20Productions!5e0!3m2!1sen!2sin!4v1728834522687!5m2!1sen!2sin'
          style={styles.mapFrame}
          allowFullScreen=''
          loading='lazy'
          referrerpolicy='no-referrer-when-downgrade'
        ></iframe>
        <h1 style={styles.overlayTextBottom}>GO PRODUCTION</h1>
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
