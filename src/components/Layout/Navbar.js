import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../utils/supabase';
import './Navbar.css';

const Navbar = ({ session }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">VoteSystem</Link>
          
          {/* Hamburger menu for mobile */}
          <div className="navbar-toggle" onClick={toggleMenu}>
            <span className="navbar-toggle-icon"></span>
          </div>
          
          {/* Navigation links */}
          <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
            {session ? (
              <>
                <li>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                </li>
                <li>
                  <button 
                    onClick={handleSignOut}
                    className="btn btn-secondary"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="navbar-link">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-secondary">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;