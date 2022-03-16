import React, {useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import firebase from 'firebase/app';
import {auth} from '../service/firebase';
import PropTypes from 'prop-types';
import {users as firebaseUsers} from '../service/firebase';
import {ICurrentUser} from '../interfaces/users';
import {IFirebaseUser, IFirebaseUsers} from '../interfaces/firebase';

export const AuthProvider: React.FC = ({children}) => {
  const updateUser = () => {
    console.log('Refetching...');
    firebaseUsers.once('value', snapshot => {
      console.log('Stuff has been fetched');
      fetchAndAppendUserData(snapshot, null);
    });
  };

  const [user, setUser] = useState<{
    currentUser: ICurrentUser | null;
    loading: boolean;
    refetchUser: () => void;
  }>({currentUser: null, loading: true, refetchUser: updateUser});

  const fetchAndAppendUserData = (
    snapshot: firebase.database.DataSnapshot,
    inputFirebaseUser: firebase.User | null
  ) => {
    let firebaseUser: firebase.User;
    if (inputFirebaseUser === null) {
      if (user.currentUser === null) {
        return;
      } else {
        firebaseUser = user.currentUser;
      }
    } else {
      firebaseUser = inputFirebaseUser;
    }
    const users: IFirebaseUsers = snapshot.val();
    if (firebaseUser.uid in users) {
      const fetchedCurrentUser = {...firebaseUser, ...users[firebaseUser.uid]};
      // Fetch userdata and append it
      setUser({
        currentUser: fetchedCurrentUser,
        loading: false,
        refetchUser: updateUser,
      });
      return;
    }
    // Generate userdata
    const defaultContent: IFirebaseUser = {
      name: firebaseUser.email ?? '',
      admin: false,
      email: firebaseUser.email ?? '',
      dateOfBirth: '',
    };
    // Save the user to the database
    firebaseUsers
      .child(firebaseUser.uid)
      .set(defaultContent)
      .then(() => {
        setUser({
          currentUser: {...firebaseUser, ...defaultContent},
          loading: false,
          refetchUser: updateUser,
        });
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      if (firebaseUser === null) {
        setUser({
          currentUser: firebaseUser,
          loading: false,
          refetchUser: updateUser,
        });
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
