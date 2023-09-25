import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../context/userContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../../Button';
import './Account.css';

const AccountPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (!formData.username && !formData.email && !formData.password && userContext?.getUserInfo) {
      userContext.getUserInfo().then(data => {
        if (data) {
          console.log(data);
          setFormData({
            username: data.username,
            email: data.email,
            password: data.password
          });
        }
      });
    }
  }, [userContext, formData]);


  if (!userContext) {
    throw new Error("AccountPage must be used within a UserContextProvider");
  }

  const { token, signOut } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Here, you'd send the data to your backend to be updated
  };

  return (
    <div className="account-container">
      <form>
      <div className="account-main-text">Account settings</div>
        <Button onClick={signOut} type="button" buttonStyle="btn--primary-inverted" buttonSize="btn--medium">
          Logout
        </Button>
        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">Username</label>
          <input
            type="text"
            name="username"  // <-- Add this
            className='input'
            value={formData.username}
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">Email</label>
          <input
            type="email"
            name="email"  // <-- Add this
            className='input'
            value={formData.email}
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">Password</label>
          <input
            type="password"
            name="password"
            className='input'
            value={formData.password}
            required
            onChange={handleInputChange}
          />
        </div>
        <Button onClick={signOut} type="button" buttonStyle="btn--primary-inverted" buttonSize="btn--large">
          Update infos
        </Button>
      </form>

    </div>
  );
};

export default AccountPage;
