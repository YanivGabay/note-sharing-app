import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase-config';
import { useAuth } from '../AuthContext';
import { onSnapshot } from 'firebase/firestore';
import { set } from 'firebase/database';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');


  const [category, setCategory] = useState('All');


  const [newCategory, setNewCategory] = useState('General'); // Default category
  const [categories, setCategories] = useState([]);

  const { currentUser } = useAuth();
  const [sortOrder, setSortOrder] = useState('desc');


  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  // Define fetchNotes inside useEffect and as a standalone function to be reused
  const fetchNotes = async () => {
    const notesCollection = collection(firestore, "Notes");
    const notesSnapshot = await getDocs(notesCollection);
    setCategories([...new Set(notesSnapshot.docs.map(doc => doc.data().category || 'General'))]);
    const notesList = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()

    }));
    setNotes(notesList);
  };

  useEffect(() => {
    const notesCollection = collection(firestore, "Notes");
    return onSnapshot(notesCollection, (snapshot) => {
      const fetchedNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()

      }));
      setNotes(fetchedNotes);
      setCategories([...new Set(snapshot.docs.map(doc => doc.data().category || 'General'))]);
    });
  }, []);

  const handleAddNote = async () => {
  if (!newNote.trim()) {
      setToastMessage("Note content cannot be empty.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    const noteData = {
      content: newNote,
      category: newCategory || 'General',
      createdAt: new Date(),
      updatedAt: new Date(),
      author: currentUser ? currentUser.email : "Anonymous",
      editedBy: currentUser ? currentUser.email : "Anonymous",
      isEditing: false
    };
    const docRef = await addDoc(collection(firestore, "Notes"), noteData);
    if (docRef.id) {
      setToastMessage("Note added successfully.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
    }

    setNewNote('');
    setNewCategory('General'); // Reset category to default after adding
    fetchNotes(); // Refresh list after adding
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
    setCategories([...new Set(notesSnapshot.docs.map(doc => doc.data().category))]);
    setNotes(notesList);
  };
  const handleEditNote = (id) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, isEditing: true } : note
    ));
  };

  const handleCancelEdit = (id) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, isEditing: false } : note
    ));
  };

  const handleChangeNote = (id, content) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, content } : note
    ));
  };
  const handleChangeCategory = (id, category) => {
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ? { ...note, category } : note
    ));
  };
  const handleSaveNote = async (id) => {
    const note = notes.find(note => note.id === id);
    await updateDoc(doc(firestore, "Notes", id), {
      content: note.content,
      updatedAt: new Date(),
      editedBy: currentUser ? currentUser.email : "Anonymous",
      category: note.category || 'General'
    });

    handleCancelEdit(id);
    fetchNotes(); // Refresh list after saving
  };


  const handleSortNotes = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedNotes = [...notes].sort((a, b) =>
    sortOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
  );

  return (
    <div className="container my-4">
      <div className="card">
        <div className="card-body text-center">
          <h1 className="display-1">Notes</h1>
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
          <button className="btn btn-secondary" onClick={handleSortNotes}>
            Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
        </div>
      </div>
      {showToast && (
        <div className="toast show position-fixed bottom-0 end-0 p-3 " style={{ zIndex: 5 }}>
          <div className="toast-header bg-success">
            <strong className="me-auto">Notification</strong>
            <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
          </div>
          <div className="toast-body">
            {toastMessage}
          </div>
        </div>
      )}
      <div className="my-3">
        <h2>Categories</h2>
        {categories.map(category => (
          <button key={category} className="btn btn-outline-primary mx-2" onClick={() => setCategory(category)}>
            {category}
          </button>
        ))}
        <button key="all-categories" className="btn btn-outline-primary mx-2" onClick={() => setCategory('All')}>
          All
        </button>
      </div>
      <div>
        {sortedNotes.map(note => (
          (category === 'All' || note.category === category) &&
          <div key={note.id} className="border rounded p-3 my-3">
            {note.isEditing ? (
              <>
                <h3>Editing Note</h3>
                <textarea
                  value={note.content}
                  onChange={e => handleChangeNote(note.id, e.target.value)}
                  className="form-control"
                  style={{ height: '100px' }}
                />
                <>
                  <h4>Editing Category</h4>
                  <input type="text" value={note.category} onChange={(e) => handleChangeCategory(note.id, e.target.value)} placeholder="Category" className="form-control mb-3" />
                </>
                <button className="btn btn-success mt-3" onClick={() => handleSaveNote(note.id)}>Save</button>
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
                <button className="btn btn-info" onClick={() => handleEditNote(note.id)}>Edit</button>
                <button className="btn btn-warning" onClick={() => handleDeleteNote(note.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Home;
