
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


function App() {
 
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState([]);
  const [messageType, setMessageType] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000); // Hide after 3 second
  };

  useEffect(() => {
    // You can replace this with your actual authentication check
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);


  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (

    <Router>
     {!isAuthenticated && (
        <div className="bg-primary text-white p-2 rounded border border-white" style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
          <h4 style={{ margin: 0 }}>Daily Tracker</h4>
        </div>
      )}
    {/* Conditionally render Navbar only if the user is authenticated */}
    {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated}/>}
    <AlertMessage message={message} type={messageType} visible={visible} />
    <Routes>
      {/* Render only the login and signup routes when not authenticated */}
      <Route path="/login" element={<Login setMessageType={setMessageType} showMessage={showMessage} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signup" element={<Signup setMessageType={setMessageType} showMessage={showMessage} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/forgot-password" element={<ForgotPassword setMessageType={setMessageType} showMessage={showMessage} setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/reset-password/:token" element={<ResetPassword setMessageType={setMessageType} showMessage={showMessage} setIsAuthenticated={setIsAuthenticated} />} />

      {/* Default route should redirect to login if not authenticated */}
      <Route path="/Dailytracker" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        
      {/* Protect all other routes */}
      <Route path="/" element={<PrivateRoute element={<Home />} />} />
      <Route path="/addNotes" element={<PrivateRoute element={<AddNotes setMessageType={setMessageType} showMessage={showMessage} />} />} />
      <Route path="/yourplan" element={<PrivateRoute element={<YourPlan setMessageType={setMessageType} showMessage={showMessage} />} />} />
      <Route path="/getNotes" element={<PrivateRoute element={<YourNotes setMessageType={setMessageType} showMessage={showMessage} />} />} />
      <Route path="/addPlan" element={<PrivateRoute element={<AddPlan setMessageType={setMessageType} showMessage={showMessage} />} />} />
    </Routes>
  </Router>
  );
}

export default App;
