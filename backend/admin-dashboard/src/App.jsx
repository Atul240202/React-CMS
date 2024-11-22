import React from 'react';
import StillDashboard from './pages/StillDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/dashboard' element={<StillDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
