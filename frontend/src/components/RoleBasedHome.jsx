import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Catalog from '../pages/Catalog.jsx';

const RoleBasedHome = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  return user.role === 'Admin' ? <Dashboard /> : <Catalog />;
};

export default RoleBasedHome;
