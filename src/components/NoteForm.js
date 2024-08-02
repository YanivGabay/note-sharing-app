// src/components/NoteForm.js
import React from 'react';

const NoteForm = ({ newNote, setNewNote, newCategory, setNewCategory, handleAddNote }) => {
  return (
    <div className="card-body text-center">
      <textarea
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
        placeholder="Add a new note"
        className="form-control my-3"
        style={{ height: '100px' }}
      />
      <input
        type="text"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
        placeholder="Category"
        className="form-control mb-3"
      />
      <button className="btn btn-primary" onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default NoteForm;
