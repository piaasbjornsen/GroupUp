import React from 'react';
import {ICurrentUser} from '../interfaces/users';

export const AuthContext = React.createContext<ICurrentUser | null>(null);
