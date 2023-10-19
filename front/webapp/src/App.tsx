import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import './App.css';
import { UserContext } from './context/userContext';
import AuthenticatedNavbar from './components/NavBars/AuthenticatedNavbar';
import UnauthenticatedNavbar from './components/NavBars/UnauthenticatedNavbar';
import Login from './components/pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home'
import CreatePage from './components/pages/Private/Create/CreatePage';
import Account from './components/pages/Private/Account'
import { useLocation } from 'react-router-dom';
import Register from './components/Register';
import Applets from './components/pages/Applets';
import 'react-notifications-component/dist/theme.css';
import { ReactNotifications } from 'react-notifications-component';
import ResetPassword from './components/pages/ResetPassword';

function App() {
  const userContext = useContext(UserContext);
  const token = userContext ? userContext.token : null;
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.style.backgroundColor = '#1D1D1D';
    } else {
      document.body.style.backgroundColor = '#fff';
    }
  }, [location.pathname]);


  return (
    <>
      <ReactNotifications/>
      {token ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/applets" element={<Applets />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;