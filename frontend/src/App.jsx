import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import DoctorList from './pages/DoctorList';
import DoctorProfile from './pages/DoctorProfile';
import AddDoctor from './pages/AddDoctor';
import PatientList from './pages/PatientList';
import PatientProfile from './pages/PatientProfile';
import AddPatient from './pages/AddPatient';
import Appointments from './pages/Appointments';
import AddAppointment from './pages/AddAppointment';
import AppointmentDetails from './pages/AppointmentDetails';
import Departments from './pages/Departments';
import AddDepartment from './pages/AddDepartment';
import DepartmentDetails from './pages/DepartmentDetails';
import Contacts from './pages/Contacts';
import AddContact from './pages/AddContact';
import ComingSoon from './pages/ComingSoon';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='doctors'>
            <Route index element={<DoctorList />} />
            <Route path='profile/:id' element={<DoctorProfile />} />
            <Route path='add' element={<AddDoctor />} />
          </Route>
          <Route path='patients'>
            <Route index element={<PatientList />} />
            <Route path='profile/:id' element={<PatientProfile />} />
            <Route path='add' element={<AddPatient />} />
            <Route path='edit/:id' element={<AddPatient />} />
          </Route>
          <Route path='appointments'>
            <Route index element={<Appointments />} />
            <Route path='add' element={<AddAppointment />} />
            <Route path='details/:id' element={<AppointmentDetails />} />
          </Route>
          <Route path='departments'>
            <Route index element={<Departments />} />
            <Route path='add' element={<AddDepartment />} />
            <Route path='edit/:id' element={<AddDepartment />} />
            <Route path='details/:id' element={<DepartmentDetails />} />
          </Route>
          <Route path='contacts'>
            <Route index element={<Contacts />} />
            <Route path='add' element={<AddContact />} />
            <Route path='edit/:id' element={<AddContact />} />
          </Route>
          <Route path='coming-soon' element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
