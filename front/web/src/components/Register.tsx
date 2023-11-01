import Title from './Title'
import './Register.css'
import { Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
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

  const {createUser} = useContext(UserContext) as IUserContext;

  if (login) {
    return <Navigate to={"/login"} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    try {
        e.preventDefault();
        const res = await createUser(username, email, password, setError);
        if (res.status && res.status === 200) {
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
            <a href='http://localhost:8080/auth/google' ><img alt="Google" src={`${process.env.PUBLIC_URL}/logo_google.png`} style={{height: 50, width: 'auto'}} /></a>
        </div>
    )
}
