import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext, IUserContext } from '../context/userContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { signIn, token } = useContext(UserContext) as IUserContext;


  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SUBMIT")
    e.preventDefault();

    try {
      await signIn(email, password);
    } catch (err) {
      setError('Failed to sign in.');
    }
  };

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <form>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p>{error}</p>}
        <button type="button" onClick={handleSubmit}>Login</button>
      </form>
    </div>
  );
};

export default Login;
