import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/logo.png';
import navProfile from '../../assets/nav-profile.svg';

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} alt="Logo" className='nav-logo' />
      <img src={navProfile} alt="Profile" className='nav-profile' />
    </div>
  );
};

export default Navbar;
