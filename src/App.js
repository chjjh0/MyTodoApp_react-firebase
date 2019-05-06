import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Login from './Login';
import Main from './main';

class MyBookApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            login: false
        }
    }

    checkLogin = () => {
        const user = localStorage.getItem('firebaseui::rememberedAccounts');
        if (user !== null) {
            return true;
        } else {
            return false;
        }
    }

    componentWillMount() {
        if (this.checkLogin()) {
            this.setState({
                login: true
            })
        }
    }

    componentDidMount() {
        if (this.state.login) {
            // 로그인 중
        } else {
            // 로그인 필요
        }
    }

    render() {
        return (
            <div className="wrap">
                <Route exact path="/" render={() => <Login login={this.checkLogin} />} />
                <Route exact path="/main" render={() => <Main />} />
            </div>
        );
    }
}

export default MyBookApp;
