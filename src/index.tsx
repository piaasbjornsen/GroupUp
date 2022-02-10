import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {ReactReduxFirebaseProvider} from 'react-redux-firebase';
import {createFirestoreInstance} from 'redux-firestore';
import {rootReducer} from './state/reducers';
import App from './App';

const firebaseConfig = {
  apiKey: 'AIzaSyDZjOcQy3CHWnO1B_jGes4HHwxyiCeENxo',
  authDomain: 'groupup-cce4f.firebaseapp.com',
  projectId: 'groupup-cce4f',
  storageBucket: 'groupup-cce4f.appspot.com',
  messagingSenderId: '753809705423',
  appId: '1:753809705423:web:f2c0eee36a37a0f6ca2aba',
  measurementId: 'G-1BEXC7Z7QL',
};

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

const initialState = {};
const store = createStore(rootReducer, initialState);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
