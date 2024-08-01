import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const StatusPage = () => {
  const location = useLocation();
  const { status, message } = location.state || {};
  const navigate = useNavigate();
    const handleReturnHome = () => {
        navigate('/');
    };
  return (
    <div>
      <h1>Status</h1>
      {status ? (
        <div>
          <h2>{status}</h2>
          <p>{message}</p>
          <button className="btn btn-primary" onClick={handleReturnHome}>Return Home</button>
        </div>
      ) : (
        <p>No status available.</p>
      )}
    </div>
  );
};

export default StatusPage;
