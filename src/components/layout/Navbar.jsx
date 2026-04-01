import React from 'react';
import './Navbar.css';

/**
 * Navbar - Floating Island
 * HOW TO ADD NEW LINKS: Simply add new <li> items inside the .nav-links ul list.
 */
const Navbar = () => {
  return (
    <nav className="navbar-island glass transition-smooth">
      <div className="navbar-logo display">NX.</div>
      <ul className="nav-links label">
        <li><a href="#work">Work</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
