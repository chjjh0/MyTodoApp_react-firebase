import React from 'react';
import { Route } from 'react-router-dom';

import Login from './Login';
import Main from './main';

const checkLogin = () => {
    const user = localStorage.getItem('firebaseui::rememberedAccounts');
    if (user !== null) {
        return true;
    } else {
        return false;
    }
}

const myTodoApp = () => {
    return (
        <div className="wrap">
            <Route exact path="/" render={() => <Login login={checkLogin} />} />
            <Route exact path="/main" render={() => <Main />} />
        </div>
    )
}

export default myTodoApp;
