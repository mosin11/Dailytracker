// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/Dashboard.css'; // Import your CSS file


export default function Dashboard({setIsAuthenticated }) {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('authToken');
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalPlans, setTotalPlans] = useState(0);
  const navigate = useNavigate();
 

  useEffect(() => {
    fetchTotalCounts();
}, []);

const fetchTotalCounts = async () => {
    try {
        // Fetch total notes count
        const notesResponse = await axios.get(`${BASE_URL}/notes/totalNotesCount`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTotalNotes(notesResponse.data.totalNotes);

        // Fetch total plans count
        const plansResponse = await axios.get(`${BASE_URL}/plans/totalPlansCount`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTotalPlans(plansResponse.data.totalPlans);
    } catch (error) {
        console.error('Error fetching counts:', error);
    }
};

  const navigateToPage = (path) => {
    navigate(path);
  };

  return (
    <div className='main-content container my-3'>
      <div className="row" style={{ marginTop: '2%' }}>
        <h1
          style={{
            border: '2px solid #333',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
          className='text-center'
        >
          Dashboard
        </h1>

        <div
          className="col-md-4 my-3"
          style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }}
          onClick={() => navigateToPage('/getNotes')}
        >
          <div className="dashboard-item text-center">
            <h3>Total Notes</h3>
            <p>{totalNotes}</p>
          </div>
        </div>

        <div
          className="col-md-4 my-3"
          style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }}
          onClick={() => navigateToPage('/yourplan')}
        >
          <div className="dashboard-item text-center">
            <h3>Total Plans</h3>
            <p>{totalPlans}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
