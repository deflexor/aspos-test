import React, { useState } from "react";

import {LoggedInUser, UserFormData} from '../types'

import './Signup.css'

type SignupProps = {
    user: LoggedInUser;
    onSignup: (data: UserFormData) => void;
    onSignin: (data: UserFormData) => void;
    onLogout: () => void;
  };

export default function Signup(props: SignupProps) {
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [isSignup, setSignup] = useState(false);

    const handleSubmit = async (e:  React.FormEvent) => {
        e.preventDefault();
        let err = ''
        if(userPassword === '') {
            err = 'Password is required'
        }
        if(userEmail === '') {
            err = 'E-mail is required'
        }
        if(err !== '') {
            setError(err)
        } else {
            setError('')
            const userData : UserFormData = { userEmail, userPassword };
            const loginCB = isSignup ? props.onSignup : props.onSignin
            loginCB(userData)
        }
    }

    let html : React.ReactNode
    if(props.user.email) {
        html = (
        <div>
            <div className="mb-3">{props.user.email}</div>
            <a href="" onClick={e => { e.preventDefault(); props.onLogout() }}>Exit</a>
        </div>
        )
    } else {
        html = (
        <form onSubmit={handleSubmit}>
            <div className="small error">
                {props.user.error ? <div id="emailHelp" className="text-danger">{props.user.error.message}</div>
                : error ? <div id="emailHelp" className="text-danger">{error}</div> : ''
                }
            </div>
            <div className="mb-3">
                <input type="email" placeholder="E-mail" className="form-control form-control-sm" onChange={e => setUserEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <input type="password" placeholder="Password" className="form-control form-control-sm" onChange={e => setUserPassword(e.target.value)} />
            </div>
            <div className="login-btns">
                <button type="submit" className="btn btn-primary btn-sm">{isSignup ? 'Login' : 'Signup'}</button>
                {isSignup ? <a href="" onClick={e => { e.preventDefault(); setSignup(false)}}>Signup</a>
                      : <a href="" onClick={e => { e.preventDefault(); setSignup(true)}}>Signin</a>}
            </div>
        </form>)
    }

    return (
        <div className="p-3 bg-warning rounded">
            {html}
        </div>
    );
}
