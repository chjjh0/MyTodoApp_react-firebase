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
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loginByGoogle() {
    return this.auth.onAuthStateChanged( (user) => {
      if (user) {
        return user.uid;
      } else {
        console.log('구글 로그인 실패')
      }
    });
  }
}

export default new Firebase();