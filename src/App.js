
import './App.css';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar';
import AddNotes from './components/AddNotes';
import YourNotes from './components/YourNotes';
import YourPlan from './components/YourPlans';
import AddPlan from './components/AddPlan';
import React, {useState } from 'react';
import Login from './components/auth/Login';
import Signup from './components/auth/SignUp';
import logo from './components/img/logo-512.jpeg'
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import CallComponent from './components/videoCall/CallComponent';
import Dashboard from './components/Dashboard';
import Profile from './components/auth/Profile';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');


  const PrivateRoute = React.memo(({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
});

  return (

    <Router >
     {!isAuthenticated && (
        <div className="bg-primary text-white p-2 rounded border border-white" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
          <h4 style={{ margin: 0 }}>Daily Tracker</h4>
        </div>
      )}
    {/* Conditionally render Navbar only if the user is authenticated */}
    {isAuthenticated && <Navbar userName={userName} setIsAuthenticated={setIsAuthenticated}/>}
   
    <Routes>
      {/* Render only the login and signup routes when not authenticated */}
      <Route path="/login" element={<Login setUserName={setUserName}  setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="Dailytracker/login" element={<Login setUserName={setUserName}   setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signup" element={<Signup   setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/forgot-password" element={<ForgotPassword   setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/reset-password/:token" element={<ResetPassword   setIsAuthenticated={setIsAuthenticated} />} />
      
      <Route path="/Dailytracker" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/dailytracker" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        
      {/* Protect all other routes */}
      <Route path="/" element={<PrivateRoute element={<Dashboard  setIsAuthenticated={setIsAuthenticated} />} />} />
      <Route path="/home" element={<PrivateRoute element={<Dashboard  setIsAuthenticated={setIsAuthenticated} />} />} />
      <Route path="/addNotes" element={<PrivateRoute element={<AddNotes  setIsAuthenticated={setIsAuthenticated}  />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile setUserName={setUserName}  setIsAuthenticated={setIsAuthenticated}  />} />} />
      <Route path="/yourplan" element={<PrivateRoute element={<YourPlan  setIsAuthenticated={setIsAuthenticated}  />} />} />
      <Route path="/getNotes" element={<PrivateRoute element={<YourNotes  setIsAuthenticated={setIsAuthenticated}  />} />} />
      <Route path="/addPlan" element={<PrivateRoute element={<AddPlan  setIsAuthenticated={setIsAuthenticated}  />} />} />
      <Route path="/video-call" element={<PrivateRoute element={<CallComponent   setIsAuthenticated={setIsAuthenticated}  />} />} />
    </Routes>
  </Router>
  );
}

export default App;
