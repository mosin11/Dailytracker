import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Profile.css'; // Your CSS file for styling
import { useAlert } from '../../contexts/AlertContext';

export default function Profile({  setIsAuthenticated, setUserName }) {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('authToken');
    const { showMessage } = useAlert();
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
    });
    
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(true); // Track OTP sent status
    
    useEffect(() => {
        // Fetch profile data on component mount
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/users/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                setProfileData(response.data);
            } catch (error) {
                setIsAuthenticated(false);
  
                showMessage('Error fetching profile data: ' + error.message,"error");
                
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSendOtp = async () => {
        const url = `${BASE_URL}/users/auth/email-verification`;
        try {
            const response = await axios.post(url, { email: profileData.email });
            if (response.status === 200) {
                
                setOtpSent(false);
                showMessage('OTP has been sent to your email',"success");
                console.log("otpSent",otpSent)
            } else {
                showMessage(response.data.message || 'Failed to send OTP',"error");
              
            }
        } catch (error) {
            console.error('Error during OTP request:', error);
            showMessage('An error occurred while sending the OTP',"error");
           
        }
    };

    const handleVerifyOtp = async () => {
        const url = `${BASE_URL}/users/auth/verifyOtp`;
        try {
            const response = await axios.post(url, { email: profileData.email, otp });
            if (response.status === 200) {
                // OTP verified, proceed with profile update
                await handleUpdateProfile();
                showMessage('Profile updated successfully!',"success");
               
            } else {
                showMessage('Invalid OTP',"error");
               
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            showMessage('An error occurred while verifying the OTP',"error");
           
        }
    };

    const handleUpdateProfile = async () => {
        const url = `${BASE_URL}/users/auth/updateProfile`;
        try {
            const response = await axios.post(url, profileData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.status === 200) {
                setUserName(response.data.name);
                sessionStorage.clear();
                sessionStorage.setItem("user", JSON.stringify(response.data));
                showMessage('Profile updated successfully!',"success");
               
            }
        } catch (error) {
            setIsAuthenticated(false);
          
            showMessage('Error updating profile: ' + error.message,"error");
           
        }
    };

    return (
        <div className='main-content my-3'>
            <div className="container my-3">
                <div className='d-flex flex-column border-dark rounded border-1 border mt-3'>
                    <h3 className="text-center mb-2">Edit Profile</h3>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <div className="w-50">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-bold">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={profileData.name}
                                onChange={handleChange}
                                id="name"
                                name="name"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={profileData.email}
                                onChange={handleChange}
                                id="email"
                                name="email"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label fw-bold">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={profileData.phoneNumber}
                                onChange={handleChange}
                                id="phoneNumber"
                                name="phoneNumber"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                        </div>
                        {otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                className="btn btn-primary mx-3">
                                Send OTP
                            </button>
                        ) : (
                            <div className="mb-3">
                                <label htmlFor="otp" className="form-label fw-bold">Enter OTP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    id="otp"
                                    name="otp"
                                    style={{ backgroundColor: 'rgb(175 202 226)' }}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    className="btn btn-primary mx-3 mt-2">
                                    Verify OTP and Update Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
