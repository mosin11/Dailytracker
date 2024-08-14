import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './css/Navbar.css';
import logo from './img/logo-512.jpeg';


export default function Navbar({ setIsAuthenticated, userName }) {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('authToken');
    // Redirect to login page
    setIsAuthenticated(false);
    navigate('/login');

  };
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
          <div className="ms-3 text-light">
            Welcome, {userName}
          </div>
          <button
            className="btn btn-outline-light ms-2"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
