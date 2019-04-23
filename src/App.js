import React, { Component } from 'react';
import TaskDisplay from './TaskDisplay';
import TaskAdd from './TaskAdd';
import firebase from './firebase';
import app from 'firebase';
import Login from './Login';
import './app.css'

class MyBookApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      task: '',
      login: false,
      userInfo: '',
      profilePhoto: ''
    }
  }


  onClickHandler = (e) => {
    e.preventDefault();
    const firestore = firebase.firestore;
    const updateDate = new Date().getTime();

    firestore.collection(this.state.userInfo).add({ todo: this.state.task, updateDate })
      .then( res => {
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
    this.setState({
      task: e.target.value
    })
  }

  onDeleteHandler = (id) => {
    const firestore = firebase.firestore;

    firestore.collection(this.state.userInfo).doc(id).delete()
      .then( () => {
        const tasks = this.state.tasks.filter((task) => task.id !== id);
        this.setState({tasks});
      })
  }

  displayTodo = () => {
    const firestore = firebase.firestore;
    const tasks = [...this.state.tasks]

    firestore.collection(this.state.userInfo).orderBy('updateDate', 'desc').get()
      .then(docs => {
        docs.forEach( doc => {
          tasks.push({ todo: doc.data().todo, id: doc.id, updateDate: doc.data().updateDate })
        });

        this.setState({
          tasks
        })
      })
  }

  checkLogin = () => {
    if (firebase.auth.currentUser) {
      localStorage.setItem('user', JSON.stringify({
        userInfo: app.auth().currentUser.uid,
        profilePhoto: app.auth().currentUser.photoURL
      }))

      this.setState({
        login: true,
        userInfo: JSON.parse(localStorage.getItem('user')).userInfo,
        profilePhoto: JSON.parse(localStorage.getItem('user')).profilePhoto
      });
      
      this.displayTodo();
    }
  }

  

  render() {
    return (
      <div className="container">
        { this.state.login ? 
        <div>
          <h1> 반갑습니다 {app.auth().currentUser.displayName} 님!! </h1>
          { this.state.profilePhoto ? 
            <img alt="profilePhoto" src={this.state.profilePhoto} />
            : null
          }
          <TaskAdd 
            value = {this.state.task}
            onChangeHandler = {this.onChangeHandler}
            onClickHandler = {this.onClickHandler}
          />
          <div>
            <TaskDisplay 
              tasks = {this.state.tasks}
              onDeleteHandler = {this.onDeleteHandler}
            />
          </div>
        </div>
        : <Login login={this.checkLogin}></Login>
        }
      </div>
    );
  }
}

export default MyBookApp;
