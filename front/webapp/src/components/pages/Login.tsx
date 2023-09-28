import React, { useState, useContext } from 'react';
import { Navigate, redirect } from 'react-router-dom';
import { UserContext, IUserContext } from '../../context/userContext';
import './Login.css';
import { Button } from '../Button';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oauth, setOauth] = useState(false);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, token } = useContext(UserContext) as IUserContext;


  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SUBMIT")
    e.preventDefault();

    try {
      const response = await signIn(email, password);
      if (response.data.message) {
        setMessage(response.data.message);
      }
    } catch (err) {
      setError('Failed to update infos.');
    }
  };

  if (token) {
    return <Navigate to="/applets" replace />;
  }

  if (oauth && url.length > 0) {
    return <Navigate to={`http://localhost:8080/OAuth2/${url}`} />;
  }

  const getOAuth = async (url: String) => {
    try {
      console.log("Clicked!!!!!\n")
      return <Navigate to={`http://localhost:8080/OAuth2/${url}`} />;
    } catch (error) {
      console.error(`Error signing up with ${url}:`, error);
    }
  }

  return (
    <div className="login-container">
      <form>
        <div className='login'>Log in</div>
        <div>
          <input
            type="email"
            className='input'
            placeholder='Email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            className='input'
            placeholder='Password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {message && <div className="login-response-message">{message}</div>}
        {error && <p>{error}</p>}
        <button type="button" className="btn btn--primary-inverted btn--large" onClick={handleSubmit}>Log in</button>
        <div style={{}} >Continue with <a href='http://localhost:8080/OAuth2/google'><span className='oauth'>Google</span></a> or <span className='oauth'>Facebook</span></div>
      </form>
    </div>
  );
};

export default Login;
