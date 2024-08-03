// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import { collection, getDoc, addDoc, deleteDoc, doc, updateDoc, onSnapshot ,getDocs} from 'firebase/firestore';
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

  const fetchNoteHistory = async (noteId) => {
    const noteRef = doc(firestore, "Notes", noteId);
    const historyRef = collection(noteRef, "history");
    const historySnapshot = await getDocs(historyRef);
    return historySnapshot.docs.map(doc => ({
       ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }));
  };

  const revertToVersion = async (noteId, historyEntry) => {
    console.log("Reverting to version:", historyEntry);
    console.log("Note ID:", noteId);
    const noteRef = doc(firestore, "Notes", noteId);

    try {
        const currentNoteSnapshot = await getDoc(noteRef);

        if (currentNoteSnapshot.exists()) {
            const historyRef = collection(noteRef, "history");
            await addDoc(historyRef, {
                ...currentNoteSnapshot.data(),
                updatedAt: currentNoteSnapshot.data().updatedAt,
                savedAt: new Date(),
            });

            const revertedData = {
                ...historyEntry,
                editedBy: currentUser?.email || "Anonymous",
                updatedAt: new Date(),
                isEditing: false
            };

            await updateDoc(noteRef, revertedData);

            console.log("Note reverted successfully to:", revertedData);
            return true; // Indicates successful revert
        } else {
            console.error("Document does not exist!");
            return false; // Indicates failure to find the document
        }
    } catch (error) {
        console.error("Failed to revert version:", error);
        throw error;
    }
};




  

  const deleteNote = async (id) => {
    await deleteDoc(doc(firestore, "Notes", id));
  };

  const updateNote = async (id, data) => {
    const noteRef = doc(firestore, "Notes", id);
    const noteSnapshot = await getDoc(noteRef);

    if (noteSnapshot.exists()) {
        // Save the current state to the history sub-collection before updating
        const historyRef = collection(noteRef, "history");
        await addDoc(historyRef, {
            ...noteSnapshot.data(),
            updatedAt: noteSnapshot.data().updatedAt,
            savedAt: new Date(), // timestamp of when this history entry is saved
        });

        // Update the note with new data
        const updatedData = {
            ...data,
            editedBy: currentUser?.email || "Anonymous",
            updatedAt: new Date(),
            isEditing: false  // Ensure to set isEditing to false when update is done
        };
        await updateDoc(noteRef, updatedData);
    } else {
        console.error("Document does not exist!");
    }
};


  const startEditing = async (id) => {
    await updateDoc(doc(firestore, "Notes", id), { isEditing: true });
  };

  const cancelEditing = async (id) => {
    await updateDoc(doc(firestore, "Notes", id), { isEditing: false });
  };

  return { notes, categories, addNote, deleteNote, updateNote, startEditing, cancelEditing, fetchNoteHistory, revertToVersion };
};

export default useNotes;
