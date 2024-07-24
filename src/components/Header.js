import React from 'react';

import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Header = () => {

    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const isUserLoggedIn = user !== null;

    const handleLogout = async () => {

        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">

                <a class="navbar-brand" href="/">Home</a>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                      
                        <li class="nav-item">
                           {isUserLoggedIn ? <Link class="nav-link" to="login" onClick={handleLogout}>Logout</Link> : <Link class="nav-link" to="login">Login</Link>}
                        </li>


                    </ul>

                </div>
            </div>
        </nav>
    );
};

export default Header;
