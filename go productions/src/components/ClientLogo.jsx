import React from 'react';
import '../styles/ClientLogo.css';

const logos = [
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449806/Client%20logos/ownpfuyjk69jo4x8nqmm.png',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449806/Client%20logos/k9nbercqswumpied5jst.png',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449806/Client%20logos/mpfvca6st0d3eaovfhuc.png',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449805/Client%20logos/bkwpnh01vf2u0jxemfv1.png',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449805/Client%20logos/sl3inzkam4uypuogdddg.png',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449805/Client%20logos/shvgh2edjbrayzcemcxw.png',
  'https://res.cloudinary.com/da3r1iagy/image/upload/v1729449805/Client%20logos/qhfoq41whojppofpltas.png',
];

const ClientLogo = () => {
  return (
    <div className='slider'>
      <div className='slide-track'>
        {logos.concat(logos).map((logo, index) => (
          <div key={index} className='slide'>
            <img src={logo} height='100' width='250' alt={`Logo ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLogo;
