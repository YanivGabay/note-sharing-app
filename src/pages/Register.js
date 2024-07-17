import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
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
