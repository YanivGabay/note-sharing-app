import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import StatusPage from './pages/StatusPage';
import Header from './components/Header';
import { NotificationProvider } from './NotificationContext';
import ToastNotification from './components/ToastNotification';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
        <ToastNotification />
          <Header />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
export default App;
