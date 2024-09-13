// src/components/EditPlanModal.js
import React, { useEffect, useState } from 'react';
import './css/AddNotes.css';

const EditPlanModal = ({ show, handleClose, plan, onSave }) => {
    const [title, setTitle] = useState(plan ? plan.title : '');
    const [desc, setDesc] = useState(plan ? plan.description : '');
    const [category, setCategory] = useState(plan ? plan.category : '-1');

    useEffect(() => {
        if (plan) {
            setTitle(plan.title);
            setDesc(plan.description);
            setCategory(plan.category);
        }
    }, [plan]);

    if (!plan) return null;

    const handleSave = () => {
        onSave({
            _id: plan._id,
            title,
            description: desc,
            category
        });
        handleClose();
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" id="editPlanModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Plan</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="planTitle" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        id="planTitle"
                                        placeholder="Enter title"
                                        style={{ backgroundColor: 'rgb(175 202 226)' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="planDescription" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        id="planDescription"
                                        placeholder="Enter description"
                                        rows="4"
                                        style={{ backgroundColor: 'rgb(175 202 226)' }}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="planCategory" className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        id="planCategory"
                                        style={{ backgroundColor: 'rgb(175 202 226)' }}
                                    >
                                        <option value="-1">-select-</option>
                                        <option value="work">Work</option>
                                        <option value="personal">Personal</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>Update Plan</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default EditPlanModal;
