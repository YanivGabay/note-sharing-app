// src/pages/Home.js
import React, { useState } from 'react';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import CategoryFilter from '../components/CategoryFilter';

import useNotes from '../hooks/useNotes';
import { useAuth } from '../AuthContext';
import { useNotification } from '../NotificationContext';

const Home = () => {
  const { currentUser } = useAuth();
  const { notes, categories, addNote, deleteNote, updateNote, startEditing, cancelEditing,fetchNoteHistory,revertToVersion  } = useNotes(currentUser);

  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [category, setCategory] = useState('All');
  const { notify } = useNotification(); // Destructure to directly get the notify function

  const handleAction = () => {
    notify({ message: 'Action successful!', type: 'success' }); // Use notify to trigger a notification
  };


  const handleAddNote = async () => {
    if (!newNote.trim()) {
      notify({ message: 'Note content cannot be empty.', type: 'error' });
      return;
    }
    await addNote({
      content: newNote,
      category: newCategory || 'General',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: currentUser ? currentUser.email : "Anonymous",
      editedBy: currentUser ? currentUser.email : "Anonymous",
      isEditing: false
    });
    handleAction();
    setNewNote('');
    setNewCategory('General');
  };

  return (
    <div className="container my-4">
      <h1 className="text-center my-4">Collaborative Notes</h1>

      <h2 className="text-center my-4">Welcome, {currentUser ? currentUser.email : 'Anonymous'}</h2>
      <hr className="mt-2 mb-3"/>

      <h2 className="text-center my-4">Add a new note</h2>
      <NoteForm {...{ newNote, setNewNote, newCategory, setNewCategory, handleAddNote }} />
      <hr className="mt-2 mb-3"/>
      <CategoryFilter categories={categories} setCategory={setCategory} />
      <hr className="mt-2 mb-3"/>

     
      <h2 className="text-center my-4">Notes</h2>
      <NoteList notes={notes} categories={categories} 
      updateNote={updateNote} handleDeleteNote={deleteNote} 
      category={category} startEditing={startEditing} cancelEditing={cancelEditing}
      fetchNoteHistory={fetchNoteHistory} revertToVersion={revertToVersion} />
   
    </div>
  );
};

export default Home;
