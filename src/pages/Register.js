import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth,email, password);
      navigate('/status', {
        state: { status: 'Success', message: 'You have registered successfully!' }
      });
    } catch (error) {
      navigate('/status', {
        state: { status: 'Error', message: error.message }
      });
    }
  };

  return (
    <div class="container-md" >


      <PageHeader pageHeader="Register" />


      <form onSubmit={handleRegister}>

       <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label text-left">Email address</label>
        <input type="email" class="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label text-left">Password</label>
        <input type="password" class="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
        </div>


        <button type="submit">Register</button>


      </form>


      <div>
        <p>Already have an account? <a href="/login">Login</a></p>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
};

export default Register;
