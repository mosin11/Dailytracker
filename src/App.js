
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import AddNotes from './components/AddNotes';
import YourNotes from './components/YourNotes';
import YourPlan from './components/YourPlans';
import AddPlan from './components/AddPlan';
import { useState } from 'react';
import AlertMessage from './components/AlertMessage'
import Login from './components/auth/Login';
import Signup from './components/auth/SignUp';


function App() {
 
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState([]);
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 5000); // Hide after 3 second
  };
  return (

      <Router>
        <Navbar />
        <AlertMessage message={message} type={messageType} visible={visible} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addNotes' element={<AddNotes   setMessageType={setMessageType} showMessage={showMessage}/>} />
          <Route path='/yourplan' element={<YourPlan   setMessageType={setMessageType} showMessage={showMessage}/>} />
          <Route path='/getNotes' element={<YourNotes  setMessageType={setMessageType} showMessage={showMessage}/>} />
          <Route path='/addPlan'  element={<AddPlan    setMessageType={setMessageType} showMessage={showMessage}/>} />
          <Route path="/login"    element={<Login      setMessageType={setMessageType} showMessage={showMessage}/>} />
          <Route path="/signup"   element={<Signup     setMessageType={setMessageType} showMessage={showMessage}/>} />

        </Routes>
      </Router>
  );
}

export default App;
