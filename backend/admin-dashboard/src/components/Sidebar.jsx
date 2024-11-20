import React from 'react';
import { Home, Square, Play, MapPin, BarChart2 } from 'lucide-react';

const Sidebar = ({ isOpen, onNavigate, activeComponent }) => {
  const styles = {
    sidebar: {
      color: '#0C0C0C',
      fontFamily: 'FONTSPRING DEMO - Chesna Grotesk Black, sans-serif',
    },
  };
  return (
    <div
      style={styles.sidebar}
      className={`w-64 p-4 fixed h-full transition-all duration-300 ${
        isOpen ? 'left-0' : '-left-64'
      }`}
    >
      <nav>
        <ul className='space-y-8'>
          <li
            className={` p-2 ${
              activeComponent === 'home'
                ? 'bg-zinc-700 font-bold rounded border border-white'
                : 'bg-zinc-800 font-bold rounded'
            }`}
          >
            <button
              className='flex items-center w-full p-2 text-white text-lg'
              onClick={() => onNavigate('home')}
            >
              <Home className='mr-5' /> Home
            </button>
          </li>
          <li
            className={` p-2 ${
              activeComponent === 'still'
                ? 'bg-zinc-700 rounded font-bold border border-white'
                : 'bg-zinc-800 rounded font-bold'
            }`}
          >
            <button
              className='flex items-center w-full p-2 text-white text-lg'
              onClick={() => onNavigate('still')}
            >
              <Square className='mr-5' /> Still
            </button>
          </li>
          <li
            className={`p-2 ${
              activeComponent === 'motion'
                ? 'bg-zinc-700 rounded font-bold border border-white'
                : 'bg-zinc-800 rounded font-bold'
            }`}
          >
            <button
              className='flex items-center w-full p-2 text-white text-lg'
              onClick={() => onNavigate('motion')}
            >
              <Play className='mr-5' /> Motion
            </button>
          </li>
          <li
            className={` p-2 ${
              activeComponent === 'map'
                ? 'bg-zinc-700 rounded border font-bold border-white'
                : 'bg-zinc-800 rounded font-bold'
            }`}
          >
            <button
              className='flex items-center w-full p-2 text-white text-lg'
              onClick={() => onNavigate('map')}
            >
              <MapPin className='mr-5' /> Location
            </button>
          </li>
          <li
            className={` p-2 ${
              activeComponent === 'client'
                ? 'bg-zinc-700 rounded border font-bold border-white'
                : 'bg-zinc-800 rounded font-bold'
            }`}
          >
            <button
              className='flex items-center w-full p-2 text-white text-lg'
              onClick={() => onNavigate('client')}
            >
              <BarChart2 className='mr-5' /> Client
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
