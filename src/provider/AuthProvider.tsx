import React, {useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import firebase from 'firebase/app';
import {auth} from '../service/firebase';
import PropTypes from 'prop-types';
import {users as firebaseUsers} from '../service/firebase';
import {Users} from '../interfaces/groups';
import {ICurrentUser} from '../interfaces/users';
import {IFirebaseUser} from '../interfaces/firebase';

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<ICurrentUser | null>(null);

  const fetchAndAppendUserData = (
    snapshot: firebase.database.DataSnapshot,
    inputFirebaseUser: firebase.User | null
  ) => {
    let firebaseUser: firebase.User;
    if (inputFirebaseUser === null) {
      if (user === null) {
        return;
      } else {
        firebaseUser = user;
      }
    } else {
      firebaseUser = inputFirebaseUser;
    }
    const users: Users = snapshot.val();
    if (firebaseUser.uid in users) {
      // Fetch userdata and append it
      setUser({...firebaseUser, ...users[firebaseUser.uid]});
      return;
    }
    // Generate userdata
    const defaultContent: IFirebaseUser = {
      name: firebaseUser.email ?? '',
      admin: false,
    };
    // Save the user to the database
    firebaseUsers
      .child(firebaseUser.uid)
      .set(defaultContent)
      .then(() => {
        setUser({...firebaseUser, ...defaultContent});
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser === null) {
        setUser(firebaseUser);
        return;
      }
      // Fetch extra data about the user
      firebaseUsers.once('value', snapshot => {
        fetchAndAppendUserData(snapshot, firebaseUser);
      });
    });

    firebaseUsers.on('value', snapshot => {
      fetchAndAppendUserData(snapshot, null);
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
