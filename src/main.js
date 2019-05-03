import React, { Component } from 'react';
import firebase from './firebase';

import TaskDisplay from './TaskDisplay';
import TaskAdd from './TaskAdd';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            task: '',
            login: false,
            userInfo: '',
            displayName: '',
            profilePhoto: ''
        }
        this.checkLogin().then((res) => {
            if (res) {
                this.displayTodo();
            } else {
                alert('오류가 발생했습니다, 다시 시도 해주세요');
            }
        }
        );
    }

    checkLogin = () => {
        return new Promise((resolve, reject) => {
            firebase.auth.onAuthStateChanged((user) => {
                if (user) {
                    var userInfo, displayName, profilePhoto;

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
        localStorage.removeItem('firebaseui::rememberedAccounts')
        firebase.auth.signOut();
    }

    onClickHandler = (e) => {
        e.preventDefault();
        const firestore = firebase.firestore;
        const updateDate = new Date().getTime();

        firestore.collection(this.state.userInfo).add({ todo: this.state.task, updateDate })
            .then(res => {
                var tasks = [...this.state.tasks, { todo: this.state.task, id: res.id, updateDate: updateDate }];

                tasks.sort((a, b) => {
                    return a.updateDate > b.updateDate ? -1 : a.updateDate < b.updateDate ? 1 : 0;
                });

                this.setState({
                    tasks,
                    task: ''
                });
            });
    }

    onChangeHandler = (e) => {
        console.log(e.target.value)
        this.setState({
            task: e.target.value
        })
    }

    onUpdateHandler = (id, e) => {
        // UI 
        // document.querySelector('button.is-danger').style.color = 'blue'
        const ele = e.target.parentElement.previousElementSibling.children[0];
        const content = ele.innerHTML;
        const inputField = document.querySelector('form.field').querySelector('div.is-expanded').children[0];

        inputField.value = content;
        inputField.focus();

        // const firestore = firebase.firestore;

        // firestore.collection(this.state.userInfo).doc(id).update({todo:'수정'}).then((res) => {
        //     console.log(res)
        // });
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
        const tasks = [...this.state.tasks]

        firestore.collection(this.state.userInfo).orderBy('updateDate', 'desc').get()
            .then(docs => {
                docs.forEach(doc => {
                    tasks.push({ todo: doc.data().todo, id: doc.id, updateDate: doc.data().updateDate })
                });

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
                                onChangeHandler={this.onChangeHandler}
                                onClickHandler={this.onClickHandler}
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