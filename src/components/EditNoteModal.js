// src/components/EditNoteModal.js
import React, { useEffect, useState } from 'react';
import './css/AddNotes.css';

const EditNoteModal = ({ show, handleClose, note, onSave }) => {
    const [title, setTitle] = useState(note ? note.title : '');
    const [desc, setDesc] = useState(note ? note.description : '');
    const [category, setCategory] = useState(note ? note.category : '-1');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setDesc(note.description);
            setCategory(note.category);
        }
    }, [note]);

    if (!note) return null;

    const handleSave = () => {
        //console.log("edit",note)
        onSave({
            _id: note._id,
            title,
            description: desc,
            category
        });
        handleClose();
    };

    return (
        <>
            <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" id="editNoteModal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Note</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="noteTitle" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        id="noteTitle"
                                        placeholder="Enter title"
                                        style={{ backgroundColor: 'rgb(175 202 226)' }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="noteDescription" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        id="noteDescription"
                                        placeholder="Enter description"
                                        rows="4"
                                        style={{ backgroundColor: 'rgb(175 202 226)' }}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="noteCategory" className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        id="noteCategory"
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
                            <button type="button" className="btn btn-primary" onClick={handleSave}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default EditNoteModal;
