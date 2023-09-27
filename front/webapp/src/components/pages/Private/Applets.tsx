import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../context/userContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../../Button';
import './Account.css';

const AppletsPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  if (!userContext) {
    throw new Error("Applets Page must be used within a UserContextProvider");
  }

  const { token, signOut } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="account-container">
    </div>
  );
};

export default AppletsPage;
