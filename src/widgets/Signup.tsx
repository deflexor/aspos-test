import React, { useState } from "react";

import {LoggedInUser, UserFormData} from '../util'

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
        if(userEmail === '') {
            setError('E-mail is required')
        }
        if(userPassword === '') {
            setError('Password is required')
        }
        if(error === '') {
            const userData : UserFormData = { userEmail, userPassword };
            isSignup ? props.onSignup(userData) : props.onSignin(userData)
        }
    }

    let html : React.ReactNode
    if(props.user.email) {
        html = (
        <div>
            <div className="mb-3">{props.user.email}</div>
            <a href="javascript:void(0)" onClick={e => props.onLogout()}>Exit</a>
        </div>
        )
    } else {
        html = (
        <form onSubmit={handleSubmit}>
            {error && <div id="emailHelp" className="form-text">{error}</div>}
            {props.user.error && <div id="emailHelp" className="form-text">{props.user.error.message}</div>}
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                <input type="email" className="form-control" onChange={e => setUserEmail(e.target.value)} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" onChange={e => setUserPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">{isSignup ? 'Signup' : 'Login'}</button>
            {isSignup ? <a href="javascript:void(0)" onClick={e => setSignup(true)}>Signup</a>
                      : <a href="javascript:void(0)" onClick={e => setSignup(false)}>Signin</a>}
        </form>)
    }

    return (
        <div className="p-3 bg-warning rounded">
            {html}
        </div>
    );
}
