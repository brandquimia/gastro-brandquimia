import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/common/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
// import Reputation from '../pages/Reputation';
// import Marketing from '../pages/Marketing';
// import Delivery from '../pages/Delivery';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  return <Layout>{children}</Layout>;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        {/* <Route path="/reputation" element={<PrivateRoute><Reputation /></PrivateRoute>} />
        <Route path="/marketing" element={<PrivateRoute><Marketing /></PrivateRoute>} />
        <Route path="/delivery" element={<PrivateRoute><Delivery /></PrivateRoute>} /> */}
      </Routes>
    </BrowserRouter>
  );
};