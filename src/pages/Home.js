// src/pages/Home.js
import React, { useState } from 'react';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import CategoryFilter from '../components/CategoryFilter';
import ToastNotification from '../components/ToastNotification';
import useNotes from '../hooks/useNotes';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const { notes, categories, addNote, deleteNote, updateNote, startEditing, cancelEditing } = useNotes(currentUser);

  const [newNote, setNewNote] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [category, setCategory] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      setToastMessage("Note content cannot be empty.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
    setToastMessage("Note added successfully.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setNewNote('');
    setNewCategory('General');
  };

  return (
    <div className="container my-4">
      <NoteForm {...{ newNote, setNewNote, newCategory, setNewCategory, handleAddNote }} />
      <CategoryFilter categories={categories} setCategory={setCategory} />
     

      <NoteList notes={notes} categories={categories} updateNote={updateNote} handleDeleteNote={deleteNote} category={category} startEditing={startEditing} cancelEditing={cancelEditing} />
      <ToastNotification showToast={showToast} setShowToast={setShowToast} toastMessage={toastMessage} />
    </div>
  );
};

export default Home;
