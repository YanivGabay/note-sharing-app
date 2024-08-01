import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import PageHeader from '../components/PageHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth ,email, password);
      navigate('/status', {
        state: { status: 'Success', message: 'You have logged in successfully!' }
      });
    } catch (error) {
      navigate('/status', {
        state: { status: 'Error', message: error.message }
      });
    }
  };

  return (
    <div
      className="container-md"
    >

    <div>
      <PageHeader pageHeader="Login" />
      <form onSubmit={handleLogin}>

        <div className="mb-3">
        <label  className="form-label text-left">Email address</label>
        <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@jmail.com" />
        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
        <label  className="form-label text-left">Password</label>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>

        <div className="mb-3">
        <button type="submit" className="btn btn-primary">Login</button>
        </div>

      </form>
    </div>


    </div>
  );
};

export default Login;
