import React from 'react';
import {ICurrentUser} from '../interfaces/users';

export const AuthContext = React.createContext<{
  currentUser: ICurrentUser | null;
  loading: boolean;
  refetchUser: () => void;
}>({currentUser: null, loading: true, refetchUser: () => {}});
