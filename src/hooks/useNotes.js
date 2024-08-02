// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../firebase-config';

const useNotes = (currentUser)=> {
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const addNote = async (noteData) => {
    await addDoc(collection(firestore, "Notes"), {
      ...noteData,
      isEditing: false,
      editedBy: currentUser?.email || "Anonymous", // Ensure user is logged in
      updatedAt: new Date()  // Setting updatedAt during creation
    });
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(firestore, "Notes", id));
  };

  const updateNote = async (id, data) => {
    const updatedData = {
      ...data,
      editedBy: currentUser?.email || "Anonymous",
      updatedAt: new Date(),
      isEditing: false  // Ensure to set isEditing to false when update is done
    };
    await updateDoc(doc(firestore, "Notes", id), updatedData);
  };

  const startEditing = async (id) => {
    await updateDoc(doc(firestore, "Notes", id), { isEditing: true });
  };

  const cancelEditing = async (id) => {
    await updateDoc(doc(firestore, "Notes", id), { isEditing: false });
  };

  return { notes, categories, addNote, deleteNote, updateNote, startEditing, cancelEditing };
};

export default useNotes;
