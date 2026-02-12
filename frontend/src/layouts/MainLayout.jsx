import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const MainLayout = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  const getTitle = (path) => {
    switch(path) {
      case '/': return 'Dashboard';
      case '/doctors': return 'Doctor';
      case '/patients': return 'Patient';
      case '/appointments': return 'Appointment';
      case '/departments': return 'Departments';
      default: return 'Clinova';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header title={getTitle(location.pathname)} />
        <main className="pt-24 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
