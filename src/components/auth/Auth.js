  import React from 'react'
  import axios from 'axios';
  import bcrypt from 'bcryptjs';

  export async function submitSignUp({ formData, showMessage, setMessageType }) {
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

      showMessage('Sign-up successful!');
      setMessageType('success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error occurred';
      console.error('Error details:', error.response?.data);
      showMessage(`Error signing up: ${errorMessage}`);
      setMessageType('error');
    }
  }

  export async function submitLogin({ email,password, showMessage, setMessageType }) {
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
      showMessage('Login successful!');
      setMessageType('success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error occurred';
      console.error('Error details:', error.response?.data);
      showMessage(`Error Login: ${errorMessage}`);
      setMessageType('error');
    }
  }




  export default function Auth() {
    return (
      <div>

      </div>
    )
  }
