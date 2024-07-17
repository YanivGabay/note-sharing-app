import React from 'react';
import { useAuth } from '../AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;

    const handleLogout = async () => {
        
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header>
            <h1>Welcome to Our App</h1>
            {user && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </header>
    );
};

export default Header;
