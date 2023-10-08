import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../context/userContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../../Button';
import './Account.css';

const AccountPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    if (!formData.username && !formData.email && userContext?.getUserInfo) {
      userContext.getUserInfo().then(data => {
        if (data) {
          console.log(data);
          setFormData({
            username: data.username,
            email: data.email,
            oldPassword: '',
            newPassword: '',
          });
        }
      });
    }
  }, [userContext, formData]);


  if (!userContext) {
    throw new Error("AccountPage must be used within a UserContextProvider");
  }

  const { token, signOut, updateInfo } = userContext;

  if (!token) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SUBMIT")
    e.preventDefault();

    const response = await updateInfo(formData.email, formData.username, formData.oldPassword, formData.newPassword);
    console.log(response.message)
    setMessage(response.message);
    setStatusCode(response.status);
  };


  return (
    <div className="account-container">
      <form>
      <div className="account-main-text">Account settings</div>
      <Button color="red" type="button" buttonStyle='btn--outline' buttonSize="btn--medium" onClick={signOut}>
        Logout
      </Button>

        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">Username</label>
          <input
            type="text"
            name="username"
            className='account-input'
            value={formData.username}
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">Email</label>
          <input
            type="email"
            name="email"
            className='account-input'
            value={formData.email}
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            className='account-input'
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="account-input-titles">
          <label htmlFor="username" className="input-title">New Password</label>
          <input
            type="password"
            name="newPassword"
            className='account-input'
            required
            onChange={handleInputChange}
          />
        </div>
        <div className={`api-response-message ${statusCode === 200 ? 'success-message' : 'error-message'}`}>
          {message}
        </div>

        <Button buttonSize='btn--large' buttonStyle='btn--primary-inverted' type='button' onClick={handleSubmit} >Update Infos</Button><span></span>
      </form>
    </div>
  );
};

export default AccountPage;
