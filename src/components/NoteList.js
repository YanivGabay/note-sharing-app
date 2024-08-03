import React, { useState } from 'react';
import { useNotification } from '../NotificationContext';

const NoteList = ({ notes, categories, startEditing, cancelEditing, updateNote, handleDeleteNote, category, fetchNoteHistory, revertToVersion }) => {
    const [editContent, setEditContent] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editingId, setEditingId] = useState(null); // State to track the ID of the note being edited
    const [sortOrder, setSortOrder] = useState('desc');
    const [showHistory, setShowHistory] = useState(null);
    const [noteHistory, setNoteHistory] = useState([]);
    const { notify } = useNotification(); // Destructure to directly get the notify function

    const toggleHistory = async (noteId) => {
        if (showHistory === noteId) {
            setShowHistory(null);
            setNoteHistory([]);
        } else {
            const history = await fetchNoteHistory(noteId);
            const sortedHistory = history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setNoteHistory(sortedHistory);
            setShowHistory(noteId);
        }
    };

    const handleStartEditing = (note) => {
        if (editingId && editingId !== note.id) {
            // If already editing another note, cancel that edit first
            cancelEditing(editingId);
        }
        if (!note.isEditing) {
            startEditing(note.id);
            setEditContent(note.content);
            setEditCategory(note.category);
            setEditingId(note.id); // Set the currently editing note's ID
        } else {
            alert('This note is currently being edited by another user.');
        }
    };

    const handleSaveEdit = (id) => {
        if (editContent.trim() && editCategory.trim()) {
            updateNote(id, { content: editContent, category: editCategory });
            cancelEditing(id);
            setEditingId(null); // Reset the editing ID
            setShowHistory(null); // Hide history after saving edit
            notify({ message: 'Note updated successfully.', type: 'success' });
        }

    };

    const handleCancelEdit = (id) => {
        cancelEditing(id);
        setEditingId(null); // Reset the editing ID
    };

    const handleStartDelete = (note) => {
        if (editingId && editingId !== note.id) {
            // If already editing another note, cancel that edit first
            cancelEditing(editingId);
        }
        if (!note.isEditing) {
            handleDeleteNote(note.id);
            notify({ message: 'Note deleted successfully.', type: 'success' });

        }
    };

    const handleRevert = async (noteId, historyEntry) => {
        const success = await revertToVersion(noteId, historyEntry);
        if (success) {
            console.log("Revert was successful, updating UI accordingly.");
            const updatedHistory = await fetchNoteHistory(noteId);
            setNoteHistory(updatedHistory);
            setShowHistory(noteId); // Keep showing history after a successful revert
            notify({ message: 'Note reverted successfully.', type: 'success' });
        } else {
            console.error("Revert failed, unable to fetch updated history.");
            notify({ message: 'Failed to revert note.', type: 'error' });
        }
    };
    
    
   
    const toggleSortOrder = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedNotes = notes.sort((a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    return (
        <div>
            <button className="btn btn-outline-secondary mb-3" onClick={toggleSortOrder}>
                Sort Notes by Date Created ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </button>
            {sortedNotes.map(note => (
                (category === 'All' || note.category === category) && <div key={note.id} className="border rounded p-3 my-3">
                    {editingId === note.id ? (
                        <>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="form-control"
                            />
                            <input
                                type="text"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="form-control mt-2"
                            />
                            <button className="btn btn-success mt-3" onClick={() => handleSaveEdit(note.id)}>Save</button>
                            <button className="btn btn-secondary mt-3" onClick={() => handleCancelEdit(note.id)}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <p>Content: {note.content}</p>
                            <p>Category: {note.category}</p>
                            <p>Author: {note.author}</p>
                            <p>Last Edited By: {note.editedBy}</p>
                            <p>Created At: {note.createdAt.toLocaleString()}</p>
                            <p>Last Updated: {note.updatedAt.toLocaleString()}</p>
                            <button className="btn btn-info" onClick={() => handleStartEditing(note)}>Edit</button>
                            <button className="btn btn-warning" onClick={() => handleStartDelete(note)}>Delete</button>
                            <button type="button" className="btn btn-primary" onClick={() => toggleHistory(note.id)}>
                                {showHistory === note.id ? 'Hide History' : 'Show History'}
                            </button>

                                <div className="accordion" id="accordionExample">
                                    {showHistory === note.id && noteHistory.length > 0 ? (
                                        noteHistory.map((history, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id={`heading${index}`}>
                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                                                        History Entry {index + 1} - {new Date(history.updatedAt).toLocaleString()}
                                                    </button>
                                                </h2>
                                                <div id={`collapse${index}`} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <div key={index} className="history-entry">
                                                            <p>Last Updated: {new Date(history.updatedAt).toLocaleString()}</p>
                                                            
                                                            <p>Content: {history.content}</p>
                                                            <p>Edited By: {history.editedBy}</p>
                                                            <p>Category: {history.category}</p>
                                                            <button className="btn btn-warning" onClick={() => handleRevert(note.id, history)}>Revert to this version</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (noteHistory.length === 0 && showHistory === note.id) && (
                                        <div className="alert alert-warning" role="alert">
                                            No history found for this note.
                                        </div>
                                    
                                     
                                    
                                   
                                    )}
                                </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NoteList;
