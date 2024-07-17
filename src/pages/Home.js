import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import { useAuth } from '../AuthContext'; // Make sure this path is correct

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const { currentUser } = useAuth(); // Access current user info

  // Fetch notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      const notesCollection = collection(firestore, "Notes");
      const notesSnapshot = await getDocs(notesCollection);
      const notesList = notesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(), // Converting Timestamp to Date
        updatedAt: doc.data().updatedAt.toDate()  // Converting Timestamp to Date
      }));
      setNotes(notesList);
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim() === '') {
      alert("Note content cannot be empty.");
      return;
    }
    const notesCollection = collection(firestore, "Notes");
    const noteData = {
      content: newNote,
      createdAt: new Date(), // Timestamp for creation
      updatedAt: new Date(), // Timestamp for last update
      author: currentUser ? currentUser.email : "Anonymous", // Use user email if logged in
    };
    await addDoc(notesCollection, noteData);
    setNewNote('');
    // Refresh notes list
    const notesSnapshot = await getDocs(notesCollection);
    const notesList = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }));
    setNotes(notesList);
  };

  // Delete a note from Firestore
  const handleDeleteNote = async (id) => {
    const noteDoc = doc(firestore, "Notes", id);
    await deleteDoc(noteDoc);
    // Refresh notes list
    const notesSnapshot = await getDocs(collection(firestore, "Notes"));
    const notesList = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }));
    setNotes(notesList);
  };

  return (
    <div>
      <h1>Notes</h1>
      <input
        type="text"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a new note"
      />
      <button onClick={handleAddNote}>Add Note</button>
      <div>
        {notes.map(note => (
          <div key={note.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc" }}>
            <p>Content: {note.content}</p>
            <p>Author: {note.author}</p>
            <p>Created At: {note.createdAt.toLocaleString()}</p>
            <p>Last Updated: {note.updatedAt.toLocaleString()}</p>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
