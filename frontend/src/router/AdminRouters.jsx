import React, { useContext } from 'react';
import { Routes, Route, Navigate   } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx';
import MyAccount from '../Dashboard/UserProfile/MyAccount.jsx'
import Dashboard from '../Dashboard/AdminPanel/Dashboard.jsx'
import Bookings from '../Dashboard/AdminPanel/Bookings.jsx'
import Admins from '../Dashboard/AdminPanel/Admins.jsx'
import AllTours from '../Dashboard/AdminPanel/AllTours.jsx'
import Users from '../Dashboard/AdminPanel/Users.jsx'
import Login from '../pages/Login.jsx';
import { CreateTour } from '../Dashboard/AdminPanel/component/CreateTour.jsx';
import { UpdateTour } from '../Dashboard/AdminPanel/component/UpdateTour.jsx';

const AdminRouters = () => {
  const { user } = useContext(AuthContext);
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/dashboard"/>}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/all-tours" element={<AllTours />}/>
        <Route path="/all-bookings" element={<Bookings />}/>
        <Route path="/users" element={<Users />}/>
        <Route path="/admins" element={<Admins />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/createtour" element={<CreateTour />}/>
        <Route path="/updatetour/:id" element={<UpdateTour />}/>
        
        { /* User Logged In? */ }
        {user ? (
          <Route path="/my-account/:id" element={<MyAccount />} />
        ) : (
          <Route path="/my-account/:id" element={<Navigate to="/login" />} />
        )}
        <Route path="*" element={<Navigate to='/'/>} />
    </Routes>

  )
}

export default AdminRouters