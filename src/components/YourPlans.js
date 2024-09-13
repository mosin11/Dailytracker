import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/AddNotes.css'; // Import your CSS file
import PlanItem from './PlanItem '; 
import EditPlanModal from './EditPlanModal'; // Assuming you have an EditPlanModal component

export default function YourPlans({ showMessage, setIsAuthenticated }) {

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('authToken');
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // State to hold the plan being edited

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/plans/getAllPlans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (Array.isArray(response.data)) {
        setPlans(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      console.error('Error fetching plans:', error);
    }
  };

  useEffect(() => {
    console.log('useEffect called fetchPlans()');
    fetchPlans();
  }, []);

  const deletePlan = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/plans/deletePlan/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      fetchPlans();
      showMessage('Plan deleted successfully!');
    } catch (error) {
      showMessage('Error deleting plan: ' + error.message);
    }
  };

  const editPlan = async (id) => {
    // Show a form or modal to edit the plan
    const planToEdit = plans.find(plan => plan._id === id);
    setEditingPlan(planToEdit);
    setShowModal(true);
  };

  const handleUpdatePlan = async (updatedPlan) => {
    try {
      const timestamp = Date.now();
      await axios.put(`${BASE_URL}/plans/updatePlan/${updatedPlan._id}`, {
        title: updatedPlan.title,
        description: updatedPlan.description,
        category: updatedPlan.category,
        date: timestamp
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setEditingPlan(null);
      fetchPlans();
      showMessage('Plan updated successfully!');
    } catch (error) {
      showMessage('Error updating plan: ' + error.message);
    }
  };

  return (
    <div className='main-content container my-3'>
      <div className="row" style={{ marginTop: '2%' }}>
        <h1 style={{ border: '2px solid #333', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} className='text-center'>
          Your Plans
        </h1>
        {plans.length > 0 ? (
          plans.map((plan, index) => (
            <div className="col-md-4 my-3" style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }} key={index}>
              <PlanItem
                title={plan.title || "Unknown"}
                description={plan.description || ''}
                date={plan.date}
                tag={plan.category}
                deletePlan={() => deletePlan(plan._id)}
                editPlan={() => editPlan(plan._id)}
              />
            </div>
          ))
        ) : (
          <p className="text-center">You don't have any plans</p>
        )}
      </div>
      <EditPlanModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        plan={editingPlan}
        onSave={handleUpdatePlan}
      />
    </div>
  );
}
