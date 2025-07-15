import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">LIMS</div>
      <div className="navbar-links">
        <a href="#">New</a>
        <span>3</span>
        <div className="navbar-user">
          <span>ERU</span>
          <span>Reception</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;