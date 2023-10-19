import React, { useState, useContext } from 'react';
import { Navigate} from 'react-router-dom';
import { UserContext, IUserContext } from '../../context/userContext';
import './Login.css';
import Title from '../Title';
import Input from '../Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oauth, setOauth] = useState(false);
  const [url, setUrl] = useState('');
  const [passwordPage, setPasswordPage] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { signIn, token } = useContext(UserContext) as IUserContext;


  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SUBMIT");
    e.preventDefault();
    try {
      const response = await signIn(email, password);
      if (response.message) {
        setMessage(response.message);
      }
    } catch (err) {
      setError('Failed to login.');
    }
  };

  if (passwordPage) {
    return (<Navigate to="/reset-password"/>)
  }

  if (token) {
    return <Navigate to="/applets" replace />;
  }

  if (oauth && url.length > 0) {
    return <Navigate to={`http://localhost:8080/auth/${url}`} />;
  }

  const getOAuth = async (url: String) => {
    try {
      console.log("Clicked!!!!!\n")
      return <Navigate to={`http://localhost:8080/auth/${url}`} />;
    } catch (error) {
      console.error(`Error signing up with ${url}:`, error);
    }
  }

  return (
    <div className="login-container">
      <form>
        <div className='login'>Log in</div>
        <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' value={email}/>
        <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' value={password}/>
        {message && <div className="login-response-message">{message}</div>}
        {error && <p>{error}</p>}
        <div className='underline-text' style={{fontSize: 20}} onClick={() => setPasswordPage(true)} >Forgot your password ?</div>
        <button type="button" className="btn btn--primary-inverted btn--large" onClick={handleSubmit}>Log in</button>
        <div style={{fontWeight: 500, fontSize: 25, marginTop: '10%'}} >Continue with <a href="http://localhost:8080/auth/google" className='underline-text'>Google</a> or <a href="http://localhost:8080/auth/facebook" className='underline-text'>Facebook</a></div>
      </form>
    </div>
  );
};

export default Login;
