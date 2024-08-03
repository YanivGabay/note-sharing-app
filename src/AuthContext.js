import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase-config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Initialized to true

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);  // Set loading to false once we get the user state
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
