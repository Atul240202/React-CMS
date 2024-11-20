import { Outlet } from 'react-router-dom';
import React from 'react';
import Header from './Header';
import FooterComponent from './FooterComponent';
import '../App.css';

const Layout = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
      }}
    >
      <Header />
      <div
        style={{
          flexGrow: 1,
        }}
      >
        <Outlet />
      </div>
      <div
        style={{
          marginTop: 'auto',
        }}
      >
        <FooterComponent />
      </div>
    </div>
  );
};

export default Layout;
