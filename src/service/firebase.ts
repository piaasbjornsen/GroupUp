import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDZjOcQy3CHWnO1B_jGes4HHwxyiCeENxo',
  authDomain: 'groupup-cce4f.firebaseapp.com',
  projectId: 'groupup-cce4f',
  storageBucket: 'groupup-cce4f.appspot.com',
  messagingSenderId: '753809705423',
  appId: '1:753809705423:web:f2c0eee36a37a0f6ca2aba',
  measurementId: 'G-1BEXC7Z7QL',
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

//signing in and out
export const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => {
  sessionStorage.setItem('currentGroup', '{}');
  auth.signOut();
};

//database
const database = firebase.database().ref();
const groups = database.child('groups');
const users = database.child('users');
const interests = database.child('interests');
export {groups, users, interests};

export default firebase;
