import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  // Rediriger vers la page de vue d'ensemble
  return <Navigate to="/admin/overview" replace />;
};

export default AdminDashboardPage;