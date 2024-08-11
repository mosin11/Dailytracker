import React, { useState, useEffect } from 'react';
import './css/AddNotes.css'; // Import your CSS file
import axios from 'axios';
import NoteItem from './NoteItem';
import EditNoteModal from './EditNoteModal';

export default function AddNotes({ setMessageType,showMessage }) {
    // State for adding a new note
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [addTitle, setAddTitle] = useState('');
    const [addDesc, setAddDesc] = useState('');
    const [addCategory, setAddCategory] = useState('-1');
    
    // State for editing an existing note
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editCategory, setEditCategory] = useState('-1');
    
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null); // State to hold the note being edited
    const [showModal, setShowModal] = useState(false);

    // Function to handle adding a new note
    const handleAddNote = async () => {
        try {
            await axios.post(`${BASE_URL}/notes/addNotes`, {
                title: addTitle,
                description: addDesc,
                category: addCategory
            });
            // Clear the add note form after submission
            setAddTitle('');
            setAddDesc('');
            setAddCategory('-1');
            fetchNotes();           
            showMessage('Notes added successfully!');
            setMessageType('success');
        } catch (error) {
            showMessage('Error adding notes: ' + error.message);            
            setMessageType('Error');
        }
    };

    // Function to handle clearing the add note form
    const handleClear = () => {
        setAddTitle('');
        setAddDesc('');
        setAddCategory('-1');
        showMessage('Form cleared!');        
        setMessageType('success');
    };

    // Function to fetch all notes
    const fetchNotes = async () => {
        try {
           
            const response = await axios.get(`${BASE_URL}/notes/getAllNotes`);
            if (Array.isArray(response.data)) {           
                setNotes(response.data);
            } else {
                console.error('Unexpected response data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Function to handle opening the edit modal
    const editNotes = async (id) => {
        const noteToEdit = notes.find(note => note._id === id);
        setEditingNote(noteToEdit);
        setEditTitle(noteToEdit.title);
        setEditDesc(noteToEdit.description);
        setEditCategory(noteToEdit.category);
        setShowModal(true);
    };

    // Function to handle updating an existing note
    const handleUpdateNote = async (updatedNote) => {
        try {
            const {  title, description, category } = updatedNote;
            
            const timestamp = Date.now();
            const url=`${BASE_URL}/notes/updateNote/${editingNote._id}`;
         
            await axios.put(url, {
                title: title,
                description: description,
                category: category,
                date: timestamp
            });
            setEditingNote(null);
            setEditTitle('');
            setEditDesc('');
            setEditCategory('-1');
            setShowModal(false);
            fetchNotes();
            showMessage('Note updated successfully!');          
            setMessageType('update');
        } catch (error) {
            showMessage('Error updating note: ' + error.message);                    
            setMessageType('error');
        }
    };

    // Function to handle deleting a note
    const deleteNotes = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/notes/deleteNote/${id}`);
            fetchNotes();
            showMessage('Note deleted successfully!');           
            setMessageType('delete');
        } catch (error) {
            showMessage('Error deleting note: ' + error.message);                     
            setMessageType('error');
        }
    };

    return (
        <div className='main-content my-3'>
            <div className="container my-3">
                <div className='d-flex flex-column border-dark rounded border-1 border mt-3'>
                    <h3 className="text-center mb-2">
                        {editingNote ? 'Edit Your Note' : 'Add Your Notes'}
                    </h3>
                </div>

                <div className="d-flex flex-column align-items-center">
                    <div className="w-50">
                        <div className="mb-3">
                            <label htmlFor="noteTitle" className="form-label fw-bold">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={addTitle}
                                onChange={(e) => setAddTitle(e.target.value)}
                                id="noteTitle"
                                placeholder="Enter your title"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                                disabled={editingNote} // Disable input when editing
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label fw-bold">Description</label>
                            <textarea
                                className="form-control"
                                value={addDesc}
                                onChange={(e) => setAddDesc(e.target.value)}
                                id="description"
                                placeholder="Enter description"
                                rows="4"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                                disabled={editingNote} // Disable input when editing
                            ></textarea>
                        </div>
                        <div className="mb-3 w-50">
                            <label htmlFor="category" className="form-label fw-bold">Category</label>
                            <select
                                className="form-select"
                                value={addCategory}
                                onChange={(e) => setAddCategory(e.target.value)}
                                id="category"
                                style={{ backgroundColor: 'rgb(175 202 226)' }}
                                disabled={editingNote} // Disable input when editing
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
                                        onClick={handleAddNote}
                                        className="btn btn-primary mx-3">
                                        Add Notes
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
                        Your Notes
                    </h1>

                    {notes.length > 0 ? (
                        notes.map((note, index) => (
                            <div className="col-md-4 my-3" style={{ background: 'linear-gradient(to bottom, #19f5ea, #feb47b)' }} key={index}>
                                <NoteItem
                                    title={note.title || "Unknown"}
                                    description={note.description || ''}
                                    date={note.date}
                                    tag={note.category}
                                    deleteNotes={() => deleteNotes(note._id)}
                                    editNotes={() => editNotes(note._id)}
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-center">You don't have any notes</p>
                    )}
                </div>
            </div>

            <EditNoteModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                note={{ title: editTitle, description: editDesc, category: editCategory }}
                onSave={handleUpdateNote}
            />
        </div>
    );
}
