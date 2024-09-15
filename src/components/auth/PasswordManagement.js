import React, { useState } from 'react';
import axios from 'axios';
import './css/PasswordManagement.css'; // Import your CSS file
import { useAlert } from '../../contexts/AlertContext';

export default function PasswordManagement({setIsAuthenticated }) {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('authToken');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { showMessage } = useAlert();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'oldPassword') setOldPassword(value);
        if (name === 'newPassword') setNewPassword(value);
        if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleUpdatePassword = async () => {
        const newErrors = {};
        if (!oldPassword) newErrors.oldPassword = 'Old password is required';
        if (!newPassword) newErrors.newPassword = 'New password is required';
        if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length === 0) {
            try {
                await axios.put(`${BASE_URL}/user/updatePassword`, { oldPassword, newPassword }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                showMessage('Password updated successfully!',"success");
                
            } catch (error) {
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
                showMessage('Error updating password: ' + error.message,"error");
                
            }
        } else {
            setErrors(newErrors);
            showMessage(newErrors,"error");
            
        }
    };

    return (
        <div className='main-content my-3'>
            <div className="container my-3">
                <div className='d-flex flex-column border-dark rounded border-1 border mt-3'>
                    <h3 className="text-center mb-2">Change Password</h3>
                </div>
                <div className="d-flex flex-column align-items-center">
                    <div className="w-50">
                        <div className="mb-3">
                            <label htmlFor="oldPassword" className="form-label fw-bold">Old Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
                                value={oldPassword}
                                onChange={handleChange}
                                id="oldPassword"
                                name="oldPassword"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                            {errors.oldPassword && <div className="invalid-feedback">{errors.oldPassword}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label fw-bold">New Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                                value={newPassword}
                                onChange={handleChange}
                                id="newPassword"
                                name="newPassword"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                            {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label fw-bold">Confirm Password</label>
                            <input
                                type="password"
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                value={confirmPassword}
                                onChange={handleChange}
                                id="confirmPassword"
                                name="confirmPassword"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                        </div>
                        <div className="d-flex">
                            <button
                                type="button"
                                onClick={handleUpdatePassword}
                                className="btn btn-primary mx-3">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
