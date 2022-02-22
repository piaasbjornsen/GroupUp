import {IFirebaseUser} from './firebase';
import firebase from 'firebase/app';

export interface IUser extends IFirebaseUser, firebase.User {}
