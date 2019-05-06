import React, { Component } from 'react';
import firebase from './firebase';

import TaskDisplay from './TaskDisplay';
import TaskAdd from './TaskAdd';

import './main.css';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            task: '',
            login: false,
            updateBtn: false,
            updateKey: '',
            userInfo: '',
            displayName: '',
            profilePhoto: ''
        }
        this.checkLogin().then((res) => {
            if (res) {
                this.displayTodo();
            } else {
                alert('오류가 발생했습니다, 새로고침이 필요합니다.');
            }
        });
    }

    checkLogin = () => {
        return new Promise((resolve, reject) => {
            firebase.auth.onAuthStateChanged((user) => {
                if (user) {
                    let userInfo, displayName, profilePhoto;

                    if (user.displayName) {
                        userInfo = user.uid;
                        displayName = user.displayName;
                        profilePhoto = user.photoURL;
                    } else if (!user.displayName) {
                        displayName = user.email;
                        userInfo = user.uid;
                    }

                    this.setState({
                        login: true,
                        userInfo,
                        displayName,
                        profilePhoto,
                    });

                    resolve(true)
                } else {
                    window.location.href = '/';
                }
            })
        })
    }

    logoutBtn = () => {
        localStorage.removeItem('firebaseui::rememberedAccounts');
        firebase.auth.signOut();
    }

    checkBlank = () => {
        if (this.state.task === '') {
            return true;
        } else {
            return false;
        }
    }

    onClickHandler = (e) => {
        e.preventDefault();

        if (e.target.classList.contains('update')) {
            this.onUpdateFire();
            return;
        } else {
            if (this.checkBlank()) {
                alert('할 일을 작성해주세요!')
            } else {
                const firestore = firebase.firestore;
                const updateDate = new Date().getTime();

                firestore.collection(this.state.userInfo).add({ todo: this.state.task, updateDate })
                    .then(res => {
                        let tasks = [...this.state.tasks, { todo: this.state.task, id: res.id, updateDate: updateDate }];

                        tasks.sort((a, b) => {
                            return a.updateDate > b.updateDate ? -1 : a.updateDate < b.updateDate ? 1 : 0;
                        });

                        this.setState({
                            tasks,
                            task: ''
                        });
                    });
            }
        }
    }

    initInput = (e) => {
        e.value = '';
        this.setState({ task: '' })
    }

    onCancelHandler = (e) => {
        if (e) {
            e.preventDefault();
        }

        const inputField = document.querySelector('form.field').querySelector('div.control').children[0];
        const btn = document.querySelector('form.field').querySelector('.btnBox').children[0];

        this.initInput(inputField);
        btn.classList.remove('update');
        btn.classList.add('add');

        this.setState({
            task: '',
            updateKey: '',
            updateBtn: false
        })
    }

    onChangeHandler = (e) => {
        this.setState({
            task: e.target.value
        })
    }

    onUpdateHandler = (id, e) => {
        const ele = e.target.parentElement.previousElementSibling.children[0];
        const content = ele.innerHTML;
        const inputField = document.querySelector('form.field').querySelector('div.control').children[0];
        const btn = document.querySelector('form.field').querySelector('.btnBox').children[0];

        inputField.value = content;
        inputField.focus();

        btn.classList.remove('add');
        btn.classList.add('update');

        this.setState({
            updateBtn: true,
            updateKey: id
        })
    }

    onUpdateFire = () => {
        const firestore = firebase.firestore;

        firestore.collection(this.state.userInfo).doc(this.state.updateKey).update({ todo: this.state.task }).then(() => {
            this.onCancelHandler();
            this.displayTodo();
        });
    }

    onDeleteHandler = (id) => {
        const firestore = firebase.firestore;

        firestore.collection(this.state.userInfo).doc(id).delete()
            .then(() => {
                const tasks = this.state.tasks.filter((task) => task.id !== id);
                this.setState({ tasks });
            })
    }

    displayTodo = () => {
        const firestore = firebase.firestore;
        const inputField = document.querySelector('form.field').querySelector('div.control').children[0];
        const tasks = [];

        firestore.collection(this.state.userInfo)
            .orderBy('updateDate', 'desc').get().then(docs => {
                docs.forEach(doc => {
                    tasks.push({ todo: doc.data().todo, id: doc.id, updateDate: doc.data().updateDate })
                });

                this.initInput(inputField);
                this.setState({
                    tasks
                })
            })
    }

    render() {
        return (
            <div className="container">
                {
                    this.state.login === true ?
                        <div>
                            <h2 className="appTitle"> My <span> Todo </span> App</h2>
                            <div className="profileArea">
                                {this.state.profilePhoto ?
                                    <div className="profileInner">
                                        <img alt="profilePhoto" src={this.state.profilePhoto} />
                                    </div>
                                    : null
                                }
                                <h1> Welcome {this.state.displayName} 님!! </h1>
                                <div className="logout" onClick={this.logoutBtn}>LOGOUT</div>
                            </div>
                            <TaskAdd
                                value={this.state.task}
                                updateBtn={this.state.updateBtn}
                                onChangeHandler={this.onChangeHandler}
                                onClickHandler={this.onClickHandler}
                                onCancelHandler={this.onCancelHandler}
                            />
                            <div>
                                <TaskDisplay
                                    tasks={this.state.tasks}
                                    onUpdateHandler={this.onUpdateHandler}
                                    onDeleteHandler={this.onDeleteHandler}
                                />
                            </div>
                        </div> : null
                }
            </div>
        )
    }

}

export default Main;