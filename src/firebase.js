import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from './fbConfig';

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.firestore = firebase.firestore();
    this.auth = firebase.auth();
  }

  loginByEmail(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password).catch(err => {
      alert(err.message)
    });
  }
}

export default new Firebase();