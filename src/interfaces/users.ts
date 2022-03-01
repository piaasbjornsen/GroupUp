import {IFirebaseUser} from './firebase';
import firebase from 'firebase/app';

export interface ICurrentUser extends IFirebaseUser, firebase.User {}
