import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (!isMobile) {
        setMenuOpen(false); // Close menu when resizing to desktop
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDashboard = location.pathname === '/dashboard';

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Tunisian Circle Logo" className="logo-image" />
          </Link>
        </div>
        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className="hamburger"></span>
        </button>
        <nav className={`nav ${menuOpen || !isMobile ? 'active' : ''}`}>
          <ul>
            {!isDashboard && (
              <li><Link to="/">Home</Link></li>
            )}
            {!isLoggedIn && (
              <>
                <li><Link to="/membership">Membership</Link></li> {/* Keep Membership */}
                <li><Link to="/census">Census</Link></li> {/* Changed to Census */}
                <li><Link to="/team">Team</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
