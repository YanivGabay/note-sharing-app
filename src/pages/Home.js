import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase-config';


const Home = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');

    // Fetch notes from Firestore
    useEffect(() => {
        const fetchNotes = async () => {
            const notesCollection = collection(firestore, "Notes");
            const notesSnapshot = await getDocs(notesCollection);
            const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesList);
        };
        fetchNotes();
    }, []);

    // Add a new note to Firestore
    const handleAddNote = async () => {
        const notesCollection = collection(firestore, "Notes");
        await addDoc(notesCollection, { content: newNote, createdAt: new Date() });
        setNewNote('');
        // Refresh notes list
        const notesSnapshot = await getDocs(notesCollection);
        const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(notesList);
    };

    // Delete a note from Firestore
    const handleDeleteNote = async (id) => {
        const noteDoc = doc(firestore, "Notes", id);
        await deleteDoc(noteDoc);
        // Refresh notes list
        const notesSnapshot = await getDocs(collection(firestore, "Notes"));
        const notesList = notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                    <div key={note.id}>
                        <p>{note.content}</p>
                        <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
