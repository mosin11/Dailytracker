  import React from 'react'
  import axios from 'axios';
  import bcrypt from 'bcryptjs';


  export async function submitSignUp({ formData,setIsAuthenticated, showMessage, navigate, setMessageType }) {
    try {
  
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    
      const { name, email, password, phoneNumber } = formData;


      // Hash the password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const encreptPswd = await bcrypt.hash(password, salt);

      const url = `${BASE_URL}/users/auth/signup`;
      
      const response = await axios.post(url, {
        name,
        email,
        password :encreptPswd,
        phoneNumber
      });
      console.log("response",response)
      navigate('/login');
      showMessage('Sign-up successful!');
      setMessageType('success');
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error occurred';
      console.error('Error details:', error.response?.data);
      showMessage(`Error signing up: ${errorMessage}`);
      setMessageType('error');
      setIsAuthenticated(false);
    }
  }

  export async function submitLogin({ email,password,setIsAuthenticated, navigate,showMessage, setMessageType }) {
    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const url = `${BASE_URL}/users/auth/login`;
      
      // Hash the password using bcrypt
      // const salt = await bcrypt.genSalt(10);
      // const encreptPswd = await bcrypt.hash(password, salt);
      console.log("password,email",password,email)
      const response = await axios.post(url,{
        email,
        password
      });
      console.log("response",response)
      navigate('/home');
      showMessage('Login successful!');
      setMessageType('success');
      setIsAuthenticated(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error occurred';
      console.error('Error details:', error.response?.data);
      showMessage(`Error Login: ${errorMessage}`);
      setMessageType('error');
      setIsAuthenticated(false);
    }
  }




  export default function Auth() {
    return (
      <div>

      </div>
    )
  }
