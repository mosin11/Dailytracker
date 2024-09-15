import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AddNotes.css'; // Import the same CSS file
import EditPlanModal from './EditPlanModal';
import PlanItem from './PlanItem ';
import { useAlert } from '../contexts/AlertContext';

export default function AddPlan({setIsAuthenticated }) {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('authToken');
    const { showMessage } = useAlert();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('-1');
    const [plans, setPlans] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleAddPlan = async () => {
        try {
            await axios.post(`${BASE_URL}/plans/addPlans`, {
                title,
                description: desc,
                category
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                }
            });
            setTitle('');
            setDesc('');
            setCategory('-1');
            fetchPlans();
            showMessage('Plan added successfully!','success');
            
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
            showMessage('Error adding plan: ' + error.message,'error');
           
        }
    };

    const handleClear = () => {
        setTitle('');
        setDesc('');
        setCategory('-1');
        showMessage('Form cleared!','success');
        
    };

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
            localStorage.removeItem('authToken');
            console.error('Error fetching plans:', error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleEditPlan = async (id) => {
        const planToEdit = plans.find(plan => plan._id === id);
        setEditingPlan(planToEdit);
        setTitle(planToEdit.title);
        setDesc(planToEdit.description);
        setCategory(planToEdit.category);
        setShowModal(true);
    };

    const handleUpdatePlan = async (updatedPlan) => {
        try {
            const { title, description, category } = updatedPlan;
            await axios.put(`${BASE_URL}/plans/updatePlan/${editingPlan._id}`, {
                title,
                description,
                category
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                }
            });
            setEditingPlan(null);
            setTitle('');
            setDesc('');
            setCategory('-1');
            setShowModal(false);
            fetchPlans();
            showMessage('Plan updated successfully!',"update");
           
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
            showMessage('Error updating plan: ' + error.message,'error');
            
        }
    };

    const handleDeletePlan = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/plans/deletePlan/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            fetchPlans();
            showMessage('Plan deleted successfully!','delete');
            
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
            showMessage('Error deleting plan: ' + error.message,'error');
           
        }
    };

    return (
        <div className='main-content my-3'>
            <div className="container my-3">
                <div className='d-flex flex-column border-dark rounded border-1 border mt-3'>
                    <h3 className="text-center mb-2">Add Your Plan</h3>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <div className="w-50">
                        <div className="mb-3">
                            <label htmlFor="planTitle" className="form-label fw-bold">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                id="planTitle"
                                placeholder="Enter your title"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label fw-bold">Description</label>
                            <textarea
                                className="form-control"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                id="description"
                                placeholder="Enter description"
                                rows="4"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            ></textarea>
                        </div>
                        <div className="mb-3 w-50">
                            <label htmlFor="category" className="form-label fw-bold">Category</label>
                            <select
                                className="form-select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                id="category"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                            >
                                <option value="-1">-select-</option>
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="urgent">Urgent</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className="d-flex">
                            <button
                                type="button"
                                onClick={handleAddPlan}
                                className="btn btn-primary mx-3">
                                Add Plan
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="btn btn-danger mx-3">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
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
                    category={plan.category}
                    date={plan.date}
                    deletePlan={() => handleDeletePlan(plan._id)}
                    editPlan={() => handleEditPlan(plan._id)}
                />
            </div>
        ))
    ) : (
        <p className="text-center">You don't have any plans</p>
    )}
</div>

            </div>

            <EditPlanModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    plan={{ title, description: desc, category }}
                    onSave={handleUpdatePlan}/>

        </div>
    );
}
