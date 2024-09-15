// Login.js
import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { submitLogin, authToken } from './Auth'
import { useAlert } from '../../contexts/AlertContext';


const Login = ({setUserName,setIsAuthenticated }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [error, setError] = useState('');
      const navigate = useNavigate();
      const token = localStorage.getItem('authToken');
      const { showMessage } = useAlert();

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
          showMessage('Both fields are required',"error");
          
          return;
        }

       await submitLogin({ showMessage, setUserName,setIsAuthenticated, email, navigate, password });
  
      };

      const handleClear = () => {
        setEmail('');
        setPassword('');
        setError('');
      };

      const handleSignup = () => {
        // Redirect to Signup page
        navigate('/signup');
      };

      const handleForgotPassword = () => {
        // Redirect to Forgot Password page
        navigate('/forgot-password');
      };

      
  useEffect(() => {
    // Define an async function inside useEffect
    async function fetchData() {
      
      if (token && token !== null) {
        const loginData = {
          token,
           showMessage,
           setUserName,
           setIsAuthenticated
        };
  
        try {
          const data = await authToken(loginData);
  
          // Assuming `authToken` returns a userId or some form of validation result
          if (data.userId && !data.isVerified) {
            navigate('/home');
            setIsAuthenticated(true);
            setUserName(data.userName);

          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("authToken")
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          // Optionally handle the error, e.g., show a message to the user
          setIsAuthenticated(false);
          localStorage.removeItem("authToken")
        }
      }
    }
    // Call the async function
    fetchData();
  }, [token]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              style={{ backgroundColor: 'rgb(175 202 226)' }}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                value={password}
                style={{ backgroundColor: 'rgb(175 202 226)' }}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ backgroundColor: 'rgb(175 202 226)', cursor: 'pointer' }}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mb-2 mx-3">
            Login
          </button>
          <button type="button" className="btn btn-secondary mx-3 mb-2" onClick={handleClear}>
            Clear
          </button>
          <div className='my-3'>
            <button type="button" className="btn btn-primary mx-3 mb-2" onClick={handleSignup}>
              Signup
            </button>
          </div>
          <div className="text-center">
            <button type="button" className="btn btn-link" style={{ textDecoration: 'none' }} onClick={handleForgotPassword}>
              Forgot Password ?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
