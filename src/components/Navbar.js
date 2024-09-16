import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './css/Navbar.css';
import logo from './img/logo-512.jpeg';


const Navbar = React.memo(({ setIsAuthenticated, userName, lastLogin }) => {
  const navigate = useNavigate();

 // console.log("name",userName);

  const handleLogout = () => {

    localStorage.removeItem('authToken');
    // Redirect to login page
    setIsAuthenticated(false);
    navigate('/login');

  };

   // This useEffect hook adds the event listener to handle link clicks in mobile view
   useEffect(() => {
    console.log("in navbar userName",userName)
    const handleNavLinkClick = () => {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      }
    };
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    return () => {
      navLinks.forEach(link => link.removeEventListener('click', handleNavLinkClick));
    };
  }, [userName]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/home">
          <img
            src={logo}
            alt="Daily Tracker Logo"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          Daily Tracker
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                aria-current="page"
                to="/home" > Home
              </NavLink>
            </li>
         
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                to="/addNotes">
                Add Notes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                to="/getNotes">
                Your Notes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                to="/addPlan"
              >
                Add Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                to="/yourplan"
              >
                Your Plan
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                to="/video-call"
              >
                <i className="bi bi-telephone"></i>
                <span className="mx-2">/</span>
                <i className="bi bi-camera-video"></i>
              </NavLink>
            </li>
          </ul>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          <div className="ms-3 dropdown text-light">
            <button
              className="btn btn-outline-light dropdown-toggle"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Welcome, {userName}
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li><span className="dropdown-item-text"><strong>Last Login:</strong> {lastLogin}</span></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <NavLink className="dropdown-item" to="/profile">
                  <i className="bi bi-person"></i> Profile
                </NavLink>
              </li>
              <li>
                <NavLink className="dropdown-item" to="/password-management">
                  <i className="bi bi-lock"></i> Password Management
                </NavLink>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
});
export default Navbar;
