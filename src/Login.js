import React, { Component } from 'react';
import firebase from './firebase';
import app from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import './login.css';

class Login extends Component {
    state = {
        username: '',
        password: ''
    }
    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            app.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccessWithAuthResult : () => this.props.login()
        }
    }

    onChangeHandler = e => {
        const { name, value } = e.target;
        this.setState({
            [name] : value
        })
    }

    onClickHandler = e => {
        e.preventDefault();

        firebase.loginByEmail(this.state.username, this.state.password)
            .then( r => this.props.login())
    }

    onGoogleLogin = e => {
        e.preventDefault();
        firebase.loginByGoogle();
    }

    render() {
        const { username, password } = this.state;
        return (
            <div className="loginContainer"> 
                <div className="inner">
                    <h1>Sign in</h1>
                    <div className="social-container">
                    <StyledFirebaseAuth
                        uiConfig={this.uiConfig}
                        firebaseAuth={app.auth()}
                    />
                    </div>
                    <span>or use your account</span>
                    <input type="text" name="username" value={username} onChange={this.onChangeHandler} placeholder="Email" />
                    <input type="password" name="password" value={password} onChange={this.onChangeHandler} placeholder="Password" />
                    <button onClick={this.onClickHandler}>Sign In</button>
                </div>
            </div>
        )
    }
}

export default Login;