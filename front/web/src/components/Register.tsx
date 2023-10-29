import axios, { AxiosError } from 'axios';
import Title from './Title'
import './Register.css'
import { Navigate, redirect } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Input from './Input';
import { Button } from './Button';
import { IUserContext, UserContext } from '../context/userContext';
import { Store } from 'react-notifications-component';

export default function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, setLogin] = useState(false);
    const [res, setRes] = useState()

  const {createUser, token} = useContext(UserContext) as IUserContext;

  if (login) {
    return <Navigate to={"/login"} />
  }

  const handleGoogleSignIn = () => {
    const googleOAuthURL = 'http://localhost:8080/auth/google';
    // Add the message event listener before opening the popup
    window.addEventListener('message', message => {
      console.log('Message received:', message.data);
    });
    // Open the popup window
    const newWindow = window.open(googleOAuthURL, 'mywindow', 'location=1, status=1, scrollbars=1, width=800, height=800');
  };

  const receiveMessage = (event: MessageEvent<any>) => {
    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    console.log("event origin : ", event.origin);
    if (event.origin !== "http://localhost:8080/auth/google") {
      return;
    }
    const { data } = event;
    // if we trust the sender and the source is our popup
    if (data.source === 'lma-login-redirect') {
      // get the URL params and redirect to our server to use Passport to auth/login
      const { payload } = data;
      const redirectUrl = `/auth/google/login${payload}`;
      window.location.pathname = redirectUrl;
    }
   };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
        e.preventDefault();
        const res = await createUser(username, email, password, setError);
        if (res.status && res.status == 200) {
            setLogin(true);
            Store.addNotification({
            title: "Account created succesfully",
            message: "Please verify your email to log in",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            },
          })};
    } catch(e: any) {
        console.error("Error creating user : ", e);
    }
  }
    return (
        <div className="get-started">
            <Title title='Sign up' />
            {error && <div style={{color: 'red', fontSize: 25}} >{error}</div>}
            <Input onChange={(e) => setUsername(e.target.value)} placeholder='Username' type='username' value={username}/>
            <Input onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' value={email}/>
            <Input onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' value={password}/>
            <Button buttonSize='btn--large' type='button' buttonStyle='btn--primary-inverted' onClick={handleSubmit} >Get started</Button>
            <a href='http://localhost:8080/auth/google' ><img src={`${process.env.PUBLIC_URL}/logo_google.png`} style={{height: 50, width: 'auto'}} /></a>
        </div>
    )
}
