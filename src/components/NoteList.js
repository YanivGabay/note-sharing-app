import React, { useState } from 'react';

const NoteList = ({ notes, categories, startEditing, cancelEditing, updateNote, handleDeleteNote, category }) => {
    const [editContent, setEditContent] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editingId, setEditingId] = useState(null); // State to track the ID of the note being edited
    const [sortOrder, setSortOrder] = useState('desc');

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
        }
    };

    const handleCancelEdit = (id) => {
        cancelEditing(id);
        setEditingId(null); // Reset the editing ID
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
                Sort by Date Created ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
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
                            <button className="btn btn-warning" onClick={() => handleDeleteNote(note.id)}>Delete</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default NoteList;
