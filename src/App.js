
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddNotes from './components/AddNotes';
import YourNotes from './components/YourNotes';
import YourPlan from './components/YourPlans';
import AddPlan from './components/AddPlan';
import { useEffect, useState } from 'react';
import AlertMessage from './components/AlertMessage'
import Login from './components/auth/Login';
import Signup from './components/auth/SignUp';
import logo from './components/img/logo-512.jpeg'
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import CallComponent from './components/videoCall/CallComponent';


function App() {
 
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState([]);
  const [messageType, setMessageType] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');


  const showMessage = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000); // Hide after 3 second
  };

  const PrivateRoute = ({ element }) => {    
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (

    <Router basename="/Dailytracker">
     {!isAuthenticated && (
        <div className="bg-primary text-white p-2 rounded border border-white" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
          <h4 style={{ margin: 0 }}>Daily Tracker</h4>
        </div>
      )}
    {/* Conditionally render Navbar only if the user is authenticated */}
    {isAuthenticated && <Navbar userName={userName} setIsAuthenticated={setIsAuthenticated}/>}
    <AlertMessage message={message} type={messageType} visible={visible} />
    <Routes>
  {/* Only render login and signup routes when not authenticated */}
  <Route path="/login" element={!isAuthenticated ? <Login setUserName={setUserName} setMessageType={setMessageType} showMessage={showMessage} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
  <Route path="/signup" element={!isAuthenticated ? <Signup setMessageType={setMessageType} showMessage={showMessage} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/home" />} />
  <Route path="/forgot-password" element={<ForgotPassword setMessageType={setMessageType} showMessage={showMessage} />} />
  <Route path="/reset-password/:token" element={<ResetPassword setMessageType={setMessageType} showMessage={showMessage} />} />

  {/* Protect other routes */}
  <Route path="/" element={<PrivateRoute element={<Home setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />
  <Route path="/home" element={<PrivateRoute element={<Home setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />
  <Route path="/addNotes" element={<PrivateRoute element={<AddNotes setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />
  <Route path="/yourplan" element={<PrivateRoute element={<YourPlan setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />
  <Route path="/getNotes" element={<PrivateRoute element={<YourNotes setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />
  <Route path="/addPlan" element={<PrivateRoute element={<AddPlan setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />
  <Route path="/video-call" element={<PrivateRoute element={<CallComponent setMessageType={setMessageType} setIsAuthenticated={setIsAuthenticated} showMessage={showMessage} />} />} />

  {/* Fallback route */}
  <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
</Routes>

  </Router>
  );
}

export default App;
