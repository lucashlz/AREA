import axios from 'axios';
import Title from '../Title'
import './Register.css'
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {

    const [loginPage, setLoginPage] = useState(false);
    const [SignInPage, setSignInPage] = useState(false);

    if (loginPage) {
        return <Navigate to='/login'/>
    }
    const fetchOAuth = () => {
        try {
            const res = axios.get("http://localhost:8080/auth/google")
            console.log("request ok\n");
            return res;
        } catch(e) {
            console.error("Error connecting to google :", e);
        }
    }

    return (
        <div className="get-started">
            <Title title='Get started' />
            <button style={{backgroundColor: '#3b5998', color: "white"}} className='button' >
                <img className='icon' src={`${process.env.PUBLIC_URL}/logo_facebook.png`} />
                <div style={{marginLeft: '5%'}}>Continue with Facebook</div>
            </button>
            <button style={{border: "1px black solid", backgroundColor: 'white'}} className='button' onClick={fetchOAuth} >
                <img src={`${process.env.PUBLIC_URL}/logo_google.png`} className='icon' />
                Continue with Google
            </button>
            <div style={{fontSize: 25, fontWeight: 500}}>Or use your email to <span className='underline-text' onClick={() => setSignInPage(true)}>sign up</span> or <span className='underline-text' onClick={() => setLoginPage(true)}>log in</span></div>
        </div>
    )
}
