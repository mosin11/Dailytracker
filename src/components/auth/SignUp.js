import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Auth.css';
import {submitSignUp,emailVerifications,OTPVerifications} from './Auth'
import { useAlert } from '../../contexts/AlertContext';




const Signup = ({setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const { showMessage } = useAlert();
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState('');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [otpError, setOtpError] = useState('');
  //  const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        number: false,
        special: false,
        uppercase: false,
        lowercase: false,
    });
    const [passpordMatch, setPasspordMatch] = useState(false);
    const [match, setMatch] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false); // New state for password focus
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            const strength = checkPasswordStrength(value);
            setPasswordStrength(strength);
            const requirements = checkRequirements(value);
            setPasswordRequirements(requirements);
        }
        if (name === 'confirmPassword') {
            // Check if passwords match
            if (value !== formData.password) {
                setPasspordMatch(true);
                setMatch('Confirm Password must be same as Passwords');

            } else {
                setPasspordMatch(false);
                setMatch('Password Match');

            }
        }
    };

    const handleFocus = () => {
        setPasswordFocused(true);
    };

    const handleBlur = () => {
        setPasswordFocused(false);
    };

    const checkPasswordStrength = (password) => {
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (regex.test(password)) {
            return 'Strong';
        } else if (password.length >= 8) {
            return 'Weak';
        } else {
            return 'Very Weak';
        }
    };

    const checkRequirements = (password) => {
        return {
            length: password.length >= 8,
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
        };
    };

    const handleOtpSubmit = async () => {
        try {
            const email =formData.email;
            const isValided = await emailVerifications({email,setShowOtpForm,showMessage,setIsAuthenticated});     
           return isValided.status;
        } catch (error) {
            showMessage(error.response.data.error);
            setOtpError(error.response.data.error);
            setOtp('');
            return error.response.data.error
        }
    };

    const verifyOTP= async()=>{
        
        const statusCode = await handleOtpSubmit();
        if(statusCode ===200){
           // setOtpSent(true);
            setShowOtpForm(true) ;
        }
    }
    const handleOTPVerification = async ()=>{
        let email =formData.email;
        const verifyResponce =await OTPVerifications({email,otp,setShowOtpForm,setIsAuthenticated,showMessage });
        if(verifyResponce.status ===200){
            console.log("otp verify Responce",verifyResponce)
            await submitSignUp({formData ,showMessage,navigate,setIsAuthenticated});   
            setShowOtpForm(false);
        }
              
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
        }
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!Object.values(passwordRequirements).every(req => req)) {
            newErrors.password = 'Password must be at least 8 characters long and include at least one number, one special character, one uppercase letter, and one lowercase letter.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password must be same as Passwords';
        }

        if (Object.keys(newErrors).length === 0) {
            const otpStatusCode = await verifyOTP()
            console.log("otp status is ",otpStatusCode)
        } else {
            setErrors(newErrors);
            showMessage(newErrors,'error');
            setOtpError('');
            setShowOtpForm(false);
           // setOtpSent(false);
            setOtp('');
        }
    };

    const handleClear = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            
        });
        setErrors({});
        setPasswordStrength('');
        setOtpError('');
        setShowOtpForm(false);
       // setOtpSent(false);
        setOtp('');
    };


    return (
        <div className="container d-flex justify-content-center my-3 align-items-center signup-container mt-5">
            <div className="card p-4 shadow-lg" style={{ background: 'linear-gradient(to right, #ff7e5f, #feb47b)', marginTop:"5%", maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">{showOtpForm ? 'Verify OTP' : 'Signup'}</h2>
                {!showOtpForm ? (
                <form>
                    <div className="my-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            id="name"
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="my-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input
                            id="phoneNumber"
                            type="text"
                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                            name="phoneNumber"
                            placeholder="Enter your phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            maxLength="10"
                        />
                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>
                    <div className="my-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="my-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={handleFocus}   // Show requirements list on focus
                            onBlur={handleBlur}     // Hide requirements list on blur
                        />
                        <div className={`mt-2 ${passwordFocused ? 'd-block' : 'd-none'}`}>
                            <ul className="list-unstyled my-3 mb-0 mt-2">
                                <li className={passwordRequirements.length ? 'text-success' : 'text-danger'}>
                                    <i className={`mx-3 bi ${passwordRequirements.length ? 'bi-check-circle' : 'bi-x-circle'}`} />
                                    Must be at least 8 characters long
                                </li>
                                <li className={passwordRequirements.number ? 'text-success' : 'text-danger'}>
                                    <i className={`mx-3 bi ${passwordRequirements.number ? 'bi-check-circle' : 'bi-x-circle'}`} />
                                    Must include at least one number
                                </li>
                                <li className={passwordRequirements.special ? 'text-success' : 'text-danger'}>
                                    <i className={`mx-3 bi ${passwordRequirements.special ? 'bi-check-circle' : 'bi-x-circle'}`} />
                                    Must include at least one special character
                                </li>
                                <li className={passwordRequirements.uppercase ? 'text-success' : 'text-danger'}>
                                    <i className={`mx-3 bi ${passwordRequirements.uppercase ? 'bi-check-circle' : 'bi-x-circle'}`} />
                                    Must include at least one uppercase letter
                                </li>
                                <li className={passwordRequirements.lowercase ? 'text-success' : 'text-danger'}>
                                    <i className={`mx-3 bi ${passwordRequirements.lowercase ? 'bi-check-circle' : 'bi-x-circle'}`} />
                                    Must include at least one lowercase letter
                                </li>
                            </ul>
                        </div>
                        <small className={`text-${passwordStrength === 'Strong' ? 'success' : 'danger'}`}>
                            Password Strength: {passwordStrength}
                        </small>
                    </div>
                    <div className="my-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        {match &&
                            <small>
                                <i className={`mx-3 bi ${!passpordMatch ? 'bi-check-circle' : 'bi-x-circle'}`} />
                                {match}
                            </small>
                        }
                    </div>
                    <button type="button" onClick={handleSubmit} className="btn btn-primary mx-3 my-2">
                        Signup
                    </button>
                    <button type="button" className="btn btn-secondary mx-3 my-2" onClick={handleClear}>
                        Clear
                    </button>
                    <div className="my-3 text-center">
                        <span>Already have an account?</span>
                        <button type="button" className="btn btn-primary mx-3 mb-2" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </div>

                </form>
                ):(
                    <div>
                        <div className="my-3">
                            <label htmlFor="otp" className="form-label">Enter OTP</label>
                            <input
                                id="otp"
                                type="text"
                                className={`form-control ${otpError ? 'is-invalid' : ''}`}
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            {otpError && <div className="invalid-feedback">{otpError}</div>}
                        </div>
                        <div className="text-center">
                            <button type="button" className="btn btn-primary w-100" onClick={handleOTPVerification}>Verify OTP</button>
                        </div>
                        <div className="text-center mt-2">
                            <button type="button" className="btn btn-secondary w-100" onClick={() => setShowOtpForm(false)}>Back</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;
