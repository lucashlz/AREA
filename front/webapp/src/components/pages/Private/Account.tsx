// components/pages/AccountPage.tsx

import React, { useContext } from 'react';
import { UserContext } from '../../../context/userContext';
import { Navigate } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("AccountPage must be used within a UserContextProvider");
  }

  const { token, signOut } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="account-page">
      <h2>Your Account</h2>
      {/* Other account details can go here */}
      <button onClick={signOut}>Logout</button>
    </div>
  );
};

export default AccountPage;
