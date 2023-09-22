import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();

    const handleResize = () => {
      showButton();
      if (window.innerWidth > 960) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo">
            <img src={`${process.env.PUBLIC_URL}/logo_white.png`} alt="Logo" className="logo" />
          </Link>
        </div>
  
        <div className="menu-icon" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes color="white" /> : <FaBars color="white" />}
        </div>
  
        {mobileMenuOpen && (
          <ul className="nav-menu active">
            <li className='nav-item'>
              <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
                Log in
              </Link>
            </li>
            <li>
              <Button linkTo="/register" type="button" buttonStyle="btn--primary" buttonSize="btn--medium" onClick={closeMobileMenu}>
                Get started
              </Button>
            </li>
          </ul>
        )}

        <div className="navbar-container">
          <li className='nav-item'>
            <Link to='/login' className='nav-links'>
              Log in
            </Link>
          </li>
          <Button linkTo="/register" type="button" buttonStyle="btn--primary" buttonSize="btn--large">
            Get started
          </Button>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
