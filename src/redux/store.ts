import {combineReducers, createStore} from '@reduxjs/toolkit';
// eslint-disable-next-line node/no-unpublished-import
import {composeWithDevTools} from 'redux-devtools-extension/logOnlyInProduction';
import currentGroupSlice from './currentGroupSlice';
import {firebaseReducer} from 'react-redux-firebase';
import {firestoreReducer} from 'redux-firestore';

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export const combinedReducers = combineReducers({
  rootReducer,
  currentGroup: currentGroupSlice,
});

const initialState = {};
export const store = createStore(
  combinedReducers,
  initialState,
  composeWithDevTools()
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
