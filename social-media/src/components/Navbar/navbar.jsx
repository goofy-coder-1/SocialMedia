import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosHome } from 'react-icons/io';
import { FaUserFriends } from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { LuMessageSquareMore } from 'react-icons/lu';
import { UserContext } from '../../contextapi/usercontext';
import './navbar.css';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setQuery('');
    }
  };

  return (
    <div className="navbar-container">
      {/* Top Bar */}
      <div className="navbar-top">
        <div className="nav-left">
          <Link to="/profile">
            <img
              src={user?.profilePic || '/images/default.jpg'}
              alt="Profile"
              className="profile-pic"
            />
          </Link>
        </div>

        <div className="nav-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className="nav-right" style={{ gap: '20px' }}>
          <Link to="/signin">
            <button className="btn login-btn">SIGN IN</button>
          </Link>
          <button className="btn login-btn">Request Help</button>
        </div>
      </div>

      {/* Bottom Navigation Icons */}
      <div className="navbar-bottom">
        <Link
          to="/"
          className={`nav-icon ${currentPath === '/' ? 'active-icon' : ''}`}
        >
          <IoIosHome className="nav-bottom-icon" />
          <h5>Home Feed</h5>
        </Link>
        <Link
          to="/requests"
          className={`nav-icon ${currentPath === '/requests' ? 'active-icon' : ''}`}
        >
          <FaUserFriends className="nav-bottom-icon" />
          <h5>Friend Requests</h5>
        </Link>
        <Link
          to="/notifications"
          className={`nav-icon ${currentPath === '/notifications' ? 'active-icon' : ''}`}
        >
          <IoMdNotificationsOutline className="nav-bottom-icon" />
          <h5>Notifications</h5>
        </Link>
        <Link
          to="/messages"
          className={`nav-icon ${currentPath === '/messages' ? 'active-icon' : ''}`}
        >
          <LuMessageSquareMore className="nav-bottom-icon" />
          <h5>Inbox</h5>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

