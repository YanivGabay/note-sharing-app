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
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">

                <a className="navbar-brand" href="/">Home</a>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                      
                        <li className="nav-item">
                           {isUserLoggedIn ? <Link className="nav-link" to="login" onClick={handleLogout}>Logout</Link> : <Link className="nav-link" to="login">Login</Link>}
                        </li>


                    </ul>

                </div>
            </div>
        </nav>
    );
};

export default Header;
