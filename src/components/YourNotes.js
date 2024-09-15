import React, { useEffect, useState } from 'react'
import NoteItem from './NoteItem'
import axios from 'axios';
import './css/AddNotes.css'; // Import your CSS file
import EditNoteModal from './EditNoteModal';
import { useAlert } from '../contexts/AlertContext';

export default function YourNotes({setIsAuthenticated }) {

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('authToken');
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // State to hold the note being edited
  const { showMessage } = useAlert();


  const handleUpdateNote = async (updatedNote) => {
    try {
      const timestamp = Date.now();
      await axios.put(`${BASE_URL}/notes/updateNote/${updatedNote._id}`, {
        title: updatedNote.title,
        description: updatedNote.description,
        category: updatedNote.category,
        date: timestamp
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
      );
      setEditingNote(null);

      fetchNotes();
      showMessage('Note updated successfully!',"success");
    } catch (error) {
      showMessage('Error updating note: ' + error.message,'error');
    }
  };
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notes/getAllNotes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (Array.isArray(response.data)) {
        setNotes(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
      }

    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("authToken")
      console.error('Error fetching notes:', error);
    }
  };
  useEffect(() => {
    console.log('useEffect called fetchNotes()');
    fetchNotes();
  }, []);

  const deleteNotes = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/notes/deleteNote/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      fetchNotes();
      showMessage('Note deleted successfully!','delete');
    } catch (error) {
      showMessage('Error deleting note: ' + error.message,'error');
    }
  };
  const editNotes = async (id) => {
    // Show a form or modal to edit the note
    const noteToEdit = notes.find(note => note._id === id);
    setEditingNote(noteToEdit);

    setShowModal(true);
  };


  return (
    <div className='main-content container my-3'>
      <div className="row" style={{ marginTop: '2%' }}>
        <h1 style={{ border: '2px solid #333', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', }} className='text-center'>Your Notes</h1>
        {notes.map((note, index) => (
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

        ))}

      </div>
      <EditNoteModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        note={editingNote}
        onSave={handleUpdateNote}
      />
    </div>
  )
}
